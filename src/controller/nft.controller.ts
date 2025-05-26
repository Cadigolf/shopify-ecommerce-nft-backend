import { Request, Response } from 'express';
import { createWallet, mintNFT, transferNFT } from '../utils/solana';
import { sendMessagetoEmail } from '../utils/gmailNotify';
import { ProductService } from '../services/product.service';
import UserService from '../services/user.service';
import { getAllProducts } from '../utils/getAllproduct';

export const buyProductController = async (req: Request ) => {
    try {
        const { contact_email, line_items, id } = req.body;
        for (let i = 0; i < line_items.length; i++) {
            try {
                const getProductImage = await getAllProducts('image', line_items[i].title);
                const productMetadata = {
                    id: line_items[i].id,
                    title: line_items[i].title.substring(0, 10),
                    description: line_items[i].name,
                    image: getProductImage,
                    symbol: "USD",
                    price: line_items[i].price,
                    quantity: line_items[i].quantity,
                };

                const userInfo = await UserService.getUserByEmail(contact_email);
                let walletaddress = '';
                if (userInfo && userInfo.length > 0) {
                    walletaddress = userInfo[0].walletaddress;
                } else {
                    const wallet = await createWallet();
                    walletaddress = wallet.publicKey;
                    await UserService.addUser(contact_email, walletaddress, wallet.privateKey);
                }

                await ProductService.saveUserProductHistory(contact_email, productMetadata, id);
                await new Promise(resolve => setTimeout(resolve, 1000));
                const mintAddress = await mintNFT(productMetadata);

                if (!mintAddress) {
                    throw new Error('Failed to mint NFT');
                }

                await new Promise(resolve => setTimeout(resolve, 15000));
                const transfer = await transferNFT(mintAddress, walletaddress);
                if (!transfer) {
                    throw new Error('Failed to transfer NFT');
                }

                try {
                    await sendMessagetoEmail(
                        contact_email,
                        `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`,
                        walletaddress
                    );
                } catch (emailError) {
                    console.error('Email sending failed:', emailError);
                }

                console.log(`✔️ NFT ${i + 1} of ${line_items.length} processed successfully`);
            } catch (error) {
                console.error(`❌ Error processing item ${i + 1}:`, error);
                throw error; 
            }
        }

    } catch (error) {
        console.error('❌ Error in buyProductController:', error);
    }
};

export const getAllProductsController = async (req: Request, res: Response) => {
    try {
        const products = await getAllProducts('all', 'all');
        res.status(200).json(products);
    } catch (error) {
        console.error('❌ Error in getAllProductsController:', error);
    }
};  