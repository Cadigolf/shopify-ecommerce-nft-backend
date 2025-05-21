import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata, createNft, burnV1, TokenStandard, transferV1 } from "@metaplex-foundation/mpl-token-metadata";
import { keypairIdentity, percentAmount, generateSigner, publicKey } from "@metaplex-foundation/umi";
import bs58 from "bs58";
import { mockStorage } from "@metaplex-foundation/umi-storage-mock";
import { Connection, PublicKey } from "@solana/web3.js";

import dotenv from "dotenv";
dotenv.config();

const solanaRpcUrl = process.env.SOLANA_RPC_URL;
const umi = createUmi(solanaRpcUrl || "");
const privateKey = process.env.SOLANA_WALLET_PRIVATEKEY;
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(privateKey || ""));
umi.use(keypairIdentity(umiKeypair))
    .use(mplTokenMetadata())
    .use(mockStorage());

const connection = new Connection(solanaRpcUrl || "");
// Minimum SOL required for NFT minting (0.02 SOL to be safe)
// const MIN_SOL_REQUIRED = 0.02;

export const createWallet = async () => {
    const wallet = generateSigner(umi);
    return { publicKey: wallet.publicKey.toString(), privateKey: bs58.encode(wallet.secretKey) };
}

export const mintNFT = async (metadata: any): Promise<string> => {
    try {
        const mint = generateSigner(umi);

        const minimalMetadata = {
            name: metadata.title,
            symbol: metadata.symbol,
            description: metadata.description?.substring(0, 100),
        };
        // Create shorter URI
        const metadataUri = `data:application/json;base64,${Buffer.from(JSON.stringify(minimalMetadata)).toString('base64')}`;

        const nft = await createNft(umi, {
            mint,
            name: metadata.title,
            symbol: metadata.symbol,
            uri: metadataUri,
            sellerFeeBasisPoints: percentAmount(0),
            isMutable: true,
            creators: [{
                    address: umi.identity.publicKey,
                    verified: true,
                    share: 100,
                }],
            collection: null,
            uses: null,
        }).sendAndConfirm(umi, {
            send: {
                commitment: "finalized",
                preflightCommitment: "confirmed"
            }
        });

        console.log("1️⃣ NFT minted successfully!");
        return mint.publicKey.toString()
    } catch (error: any) {
        const errorMessage = error.message || "Unknown error occurred while minting NFT";
        console.error("ERROR------> NFT minting failed:", errorMessage);
        return "false";
    }
}

export const burnNFT = async (privateKey: string, mintAddress: string) => {
    try {
        const umiKeypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(privateKey || ""));
        umi.use(keypairIdentity(umiKeypair))
            .use(mplTokenMetadata())
            .use(mockStorage());

        if (!mintAddress) {
            throw new Error("Mint address is required");
        }

        const mint = publicKey(mintAddress);

        await burnV1(umi, {
            mint,
            authority: umi.identity,
            tokenStandard: TokenStandard.NonFungible,
        }).sendAndConfirm(umi, {
            send: { commitment: "finalized" }
        });
        console.log("✅ NFT burned successfully!");
    } catch (error: any) {
        const errorMessage = error.message || "Unknown error occurred while burning NFT";
        console.error("ERROR------> NFT burning failed:", errorMessage);
        return { success: false, error: errorMessage };
    }
};

export const transferNFT = async (mintAddress: string, toAddress: string) => {
    try {
        const mint = publicKey(mintAddress);
        const to = publicKey(toAddress);
        await transferV1(umi, {
            mint,
            authority: umi.identity,
            tokenOwner: umi.identity.publicKey,
            destinationOwner: to,
            tokenStandard: TokenStandard.NonFungible,
        }).sendAndConfirm(umi, {
            send: { commitment: "finalized" }
        });
        console.log("2️⃣ NFT transferred successfully!");
        return true;
    } catch (error: any) {
        const errorMessage = error.message || "Unknown error occurred while transferring NFT";
        console.error("ERROR------> NFT transferring failed:", errorMessage);
        return false;
    }
}