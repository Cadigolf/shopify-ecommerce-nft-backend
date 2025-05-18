import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata, createNft, burnV1, TokenStandard, transferV1 } from "@metaplex-foundation/mpl-token-metadata";
import { keypairIdentity, percentAmount, generateSigner, publicKey } from "@metaplex-foundation/umi";
import bs58 from "bs58";
import { mockStorage } from "@metaplex-foundation/umi-storage-mock";
import dotenv from "dotenv";
dotenv.config();

const solanaRpcUrl = process.env.SOLANA_RPC_URL;
const umi = createUmi(solanaRpcUrl || "");
const privateKey = process.env.SOLANA_WALLET_PRIVATEKEY;
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(privateKey || ""));
umi.use(keypairIdentity(umiKeypair))
    .use(mplTokenMetadata())
    .use(mockStorage());


export const mintNFT = async (metadata: any) => {
    try {
        const mint = generateSigner(umi);
        const uri = await umi.uploader.uploadJson(metadata);
        await createNft(umi, {
            mint,
            name: metadata.name,
            symbol: metadata.symbol,
            uri,
            updateAuthority: umi.identity.publicKey,
            sellerFeeBasisPoints: percentAmount(0),
        }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

        console.log("🚀NFT minted successfully!");
        console.log(`https://solscan.io/token/${mint.publicKey}?cluster=devnet`);
        return mint.publicKey;
    } catch (error) {
        console.error("ERROR------> NFT minting failed", error);
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
        console.log("🔥NFT burned successfully!");
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
        console.log("🔄NFT transferred successfully!");
    } catch (error: any) {
        const errorMessage = error.message || "Unknown error occurred while transferring NFT";
        console.error("ERROR------> NFT transferring failed:", errorMessage);
        return { success: false, error: errorMessage };
    }
}