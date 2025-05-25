import { Request, Response } from 'express';
import { createWallet, mintNFT, transferNFT } from '../utils/solana';
import { sendMessagetoEmail } from '../utils/gmailNotify';
import { ProductService } from '../services/product.service';
import UserService from '../services/user.service';
import { getAllProducts } from '../utils/getAllproduct';
export const buyProductController = async (req: Request, res: Response) => {
    try {
        const { contact_email, line_items, id } = req.body;
        for (let i = 0; i < line_items.length; i++) {
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
            await ProductService.saveUserProductHistory(contact_email, productMetadata, id);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const userInfo = await UserService.getUserByEmail(contact_email);
            let walletaddress = '';
            if (userInfo && userInfo.length > 0) {
                walletaddress = userInfo[0].walletaddress;
            }
            else {
                const wallet = await createWallet();
                walletaddress = wallet.publicKey;
                await UserService.addUser(contact_email, walletaddress, wallet.privateKey);
            }
            const mintAddress = await mintNFT(productMetadata);
            if (mintAddress) {
                setTimeout(async () => {
                    const transfer = await transferNFT(mintAddress, walletaddress);
                    if (transfer) {
                        await sendMessagetoEmail(contact_email, `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`, walletaddress);
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
