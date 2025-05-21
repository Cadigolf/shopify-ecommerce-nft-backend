import { Request, Response } from 'express';
import { createWallet, mintNFT, transferNFT } from '../utils/solana';
import { sendMessagetoEmail } from '../utils/gmailNotify';
import { ProductService } from '../services/product.service';
import UserService from '../services/user.service';
export const buyProductController = async (req: Request, res: Response) => {
    try {
        const { email, productMetadata } = req.body;
        for (let i = 0; i < productMetadata.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between iterations
            const mintAddress = await mintNFT(productMetadata[i]);
            const userInfo = await UserService.getUserByEmail(email);
            let walletAddress = '';
            if (userInfo && userInfo.length > 0) {
                walletAddress = userInfo[0].walletAddress;
            }
            else {
                const wallet = await createWallet();
                walletAddress = wallet.publicKey;
                await UserService.addUser(email, walletAddress, wallet.privateKey);
            }
            if (mintAddress) {
                setTimeout(async () => {
                    const transfer = await transferNFT(mintAddress, walletAddress);
                    if (transfer) {
                        await sendMessagetoEmail(email, `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`, walletAddress);
                        await ProductService.saveUserProductHistory(email, productMetadata[i]);
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