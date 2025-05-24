import { Request, Response } from 'express';
import { createWallet, mintNFT, transferNFT } from '../utils/solana';
import { sendMessagetoEmail } from '../utils/gmailNotify';
import { ProductService } from '../services/product.service';
import UserService from '../services/user.service';
export const buyProductController = async (req: Request, res: Response) => {
    try {
        const { contact_email, line_items } = req.body;
        const productMetadata = line_items.map((item: any) => {
            return {
                title: item.title,
                description: item.name,
                symbol: "USD",
                price: item.price,
                quantity: item.quantity,
            }
        });
        console.log("contact_email", contact_email);
        console.log("productMetadata", productMetadata);
        for (let i = 0; i < productMetadata.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between iterations
            const mintAddress = await mintNFT(productMetadata[i]);
            const userInfo = await UserService.getUserByEmail(contact_email);
            let walletAddress = '';
            if (userInfo && userInfo.length > 0) {
                walletAddress = userInfo[0].walletAddress;
            }
            else {
                const wallet = await createWallet();
                walletAddress = wallet.publicKey;
                await UserService.addUser(contact_email, walletAddress, wallet.privateKey);
            }
            if (mintAddress) {
                setTimeout(async () => {
                    const transfer = await transferNFT(mintAddress, walletAddress);
                    if (transfer) {
                        await sendMessagetoEmail(contact_email, `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`, walletAddress);
                        await ProductService.saveUserProductHistory(contact_email, productMetadata);
                        console.log("✔️ Everything is done.");
                        res.status(200).json({ message: 'NFT transferred successfully' });
                    } else {
                        res.status(400).json({ message: 'Failed to transfer NFT' });
                    }
                }, 15000);
            } else {
                res.status(400).json({ message: 'Failed to mint NFT' });
            }
        }
    } catch (error) {
        console.error('❌ Error minting NFT:', error);
        res.status(500).json({ error: 'Failed to mint NFT' });
    }
};
