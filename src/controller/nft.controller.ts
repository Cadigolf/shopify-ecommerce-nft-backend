import { Request, Response } from 'express';
import { createWallet, mintNFT, transferNFT } from '../utils/solana';
import { sendMessagetoEmail } from '../utils/gmailNotify';
import { ProductService } from '../services/product.service';
import UserService from '../services/user.service';
import { getAllProducts } from '../utils/getAllproduct';

interface LineItem {
    id: string;
    title: string;
    name: string;
    price: number;
    quantity: number;
}

interface ProcessResult {
    success: boolean;
    message: string;
    item: string;
    mintAddress?: string;
    walletAddress?: string;
    error?: string;
}

export const buyProductController = async (req: Request, res: Response) => {
    try {
        const { contact_email, line_items, id } = req.body;

        const results = await Promise.all(line_items.map(async (item: LineItem) => {
            try {
                const getProductImage = await getAllProducts('image', item.title);
                const productMetadata = {
                    id: item.id,
                    title: item.title.substring(0, 10),
                    description: item.name,
                    image: getProductImage,
                    symbol: "USD",
                    price: item.price,
                    quantity: item.quantity,
                };

                // Get or create user wallet
                const userInfo = await UserService.getUserByEmail(contact_email);
                let walletaddress = '';
                if (userInfo && userInfo.length > 0) {
                    walletaddress = userInfo[0].walletaddress;
                } else {
                    const wallet = await createWallet();
                    walletaddress = wallet.publicKey;
                    await UserService.addUser(contact_email, walletaddress, wallet.privateKey);
                }

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mint NFT
                const mintAddress = await mintNFT(productMetadata);
                if (!mintAddress) {
                    return {
                        success: false,
                        message: 'Failed to mint NFT',
                        item: item.title
                    } as ProcessResult;
                }

                // Add delay before transferring
                await new Promise(resolve => setTimeout(resolve, 15000));

                // Transfer NFT
                const transfer = await transferNFT(mintAddress, walletaddress);
                if (!transfer) {
                    return {
                        success: false,
                        message: 'Failed to transfer NFT',
                        item: item.title
                    } as ProcessResult;
                }

                // Send email notification
                await ProductService.saveUserProductHistory(contact_email, productMetadata, id);
                await sendMessagetoEmail(
                    contact_email,
                    `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`,
                    walletaddress
                );

                return {
                    success: true,
                    message: 'NFT transferred successfully',
                    item: item.title,
                    mintAddress,
                    walletAddress: walletaddress
                } as ProcessResult;
            } catch (error: unknown) {
                console.error(`Error processing item ${item.title}:`, error);
                return {
                    success: false,
                    message: 'Error processing item',
                    item: item.title,
                    error: error instanceof Error ? error.message : 'Unknown error'
                } as ProcessResult;
            }
        }));

        // Check if all operations were successful
        const allSuccessful = results.every(result => result.success);
        
        // Send a single response with all results
        if (allSuccessful) {
            res.status(200).json({
                message: 'All NFTs processed successfully',
                results
            });
        } else {
            res.status(207).json({
                message: 'Some NFTs failed to process',
                results
            });
        }

    } catch (error: unknown) {
        console.error('❌ Error in buyProductController:', error);
        res.status(500).json({
            error: 'Failed to process NFTs',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
