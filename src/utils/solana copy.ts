import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairIdentity, generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { Umi, Keypair } from '@metaplex-foundation/umi'
import bs58 from 'bs58'
import dotenv from 'dotenv'

dotenv.config()

// Validate environment variables
if (!process.env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY is not set in .env file')
}

// Setup UMI
let secretKey: Uint8Array
try {
    const privateKeyString = process.env.PRIVATE_KEY.trim()
    console.log('🔑 Using existing wallet...')

    // Decode base58 private key
    secretKey = bs58.decode(privateKeyString)
    console.log('✅ Private key loaded successfully')
} catch (error) {
    console.error('❌ Private key parsing error:', error)
    throw new Error('Invalid PRIVATE_KEY format. It should be a base58 encoded private key.')
}

// Initialize UMI with proper configuration
const umi = createUmi('https://api.devnet.solana.com')
    .use(mplTokenMetadata())

// Create signer from private key
let keypair: Keypair;
try {
    keypair = umi.eddsa.createKeypairFromSecretKey(secretKey)
    umi.use(keypairIdentity(keypair))
    console.log('✅ Wallet connected successfully')
    console.log('📝 Using wallet address:', keypair.publicKey)
} catch (error) {
    console.error('❌ Wallet connection error:', error)
    throw new Error('Failed to connect wallet')
}

// Create a simple metadata object
const metadata = {
    name: "RIJIYONG",
    symbol: "PRETTYCAT",
    description: "A simple NFT is my new token!"
}

async function mint() {
    try {
        console.log('🚀 Starting NFT minting process...')

        // Generate a new mint signer
        const mint = generateSigner(umi)
        console.log('🎯 Generated mint signer:', mint.publicKey)

        // Create a data URI for the metadata
        const metadataUri = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`
        console.log('📄 Metadata URI length:', metadataUri.length)

        console.log('⏳ Creating NFT...')
        const nft = await createNft(umi, {
            mint,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadataUri,
            sellerFeeBasisPoints: percentAmount(0),
            isMutable: true,
            creators: [
                { address: keypair.publicKey, verified: true, share: 100 }
            ]
        }).sendAndConfirm(umi)

        console.log('✅ NFT Created Successfully!')
        console.log('🔗 Transaction Signature:', nft.signature)
        console.log('🔍 View on Solana Explorer:', `https://explorer.solana.com/tx/${nft.signature}?cluster=devnet`)
        console.log('🎯 NFT Address:', mint.publicKey)
    } catch (error: any) {
        console.error('❌ Error creating NFT:', error.message)
        if (error.logs) {
            console.error('Transaction logs:', error.logs)
        }
        if (error.stack) {
            console.error('Stack trace:', error.stack)
        }
        if (error.cause) {
            console.error('Error cause:', error.cause)
        }
        process.exit(1)
    }
}

// Add error handler for unhandled rejections
process.on('unhandledRejection', (error: any) => {
    console.error('Unhandled promise rejection:', error)
    process.exit(1)
})

mint()
