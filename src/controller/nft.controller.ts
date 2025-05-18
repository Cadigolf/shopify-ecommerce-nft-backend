import { Request, Response } from 'express';
import { mintNFT, transferNFT } from '../utils/solana';

export const NFTController = async (req: Request, res: Response) => {
    try {
        const { userWalletAddress, SKUMetadata } = req.body;
        const metadata = JSON.parse(SKUMetadata);
        console.log("🚀 ~ mintNFT ~ metadata:", metadata)
        const mint = await mintNFT(metadata);
        res.status(200).json({ message: 'NFT minted successfully', mint });
    } catch (error) {
        console.error('❌ Error minting NFT:', error);
        res.status(500).json({ error: 'Failed to mint NFT' });
    }
};

export const transferNFTController = async (req: Request, res: Response) => {
    try {
        const { mintAddress, toAddress } = req.body;
        const transfer = await transferNFT(mintAddress, toAddress);
        res.status(200).json({ message: 'NFT transferred successfully', transfer });
    } catch (error) {
        console.error('❌ Error transferring NFT:', error);
        res.status(500).json({ error: 'Failed to transfer NFT' });
    }
}

