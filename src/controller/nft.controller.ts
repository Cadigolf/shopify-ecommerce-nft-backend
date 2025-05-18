import { Request, Response } from 'express';
import { mintNFT, transferNFT } from '../utils/solana';
import { sendMessagetoEmail } from '../utils/gmailNotify';
import { ProductService } from '../services/product.service';
export const buyProductController = async (req: Request, res: Response) => {
    try {
        const { user, productMetadata } = req.body;
        const mintAddress = await mintNFT(productMetadata);
        if (mintAddress) {
            setTimeout(async () => {
                const transfer = await transferNFT(mintAddress, user.walletAddress);
                if (transfer) {
                    sendMessagetoEmail(user.email, `https://solscan.io/token/${mintAddress}?cluster=devnet`);
                    await ProductService.saveUserProductHistory(user.email, productMetadata);
                    console.log("✔️ Everything is done.");
                    res.status(200).json({ message: 'NFT transferred successfully', transfer });
                } else {
                    res.status(400).json({ message: 'Failed to transfer NFT' });
                }
            }, 10000);
        } else {
            res.status(400).json({ message: 'Failed to mint NFT' });
        }
    } catch (error) {
        console.error('❌ Error minting NFT:', error);
        res.status(500).json({ error: 'Failed to mint NFT' });
    }
};