import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMessagetoEmail = async (toEmail: string, content: string, walletAddress: string, userSiteUrl: string, isPending: boolean = false) => {
    const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM ?? 'HubsAI <noreply@hubsai.smittyworks.com>',
        to: toEmail,
        subject: '🎉 Your NFT Purchase Confirmation - Next Steps Inside!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #333; margin: 0; font-size: 24px;">NFT Purchase Confirmation</h1>
                        <p style="color: #666; margin: 10px 0 20px; font-size: 16px;">Thank you for your purchase</p>
                        <a href="${userSiteUrl}" style="display: inline-block; text-decoration: none; font-size: 16px; padding: 10px 20px; border-radius: 4px; background-color: #357abd; color: white;">View Your NFT on HubsAI</a>
                    </div>

                    <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="color: #333; margin: 0 0 20px; font-size: 20px;">Transaction Details</h2>
                        <p style="color: #666; margin: 0 0 20px;">Your NFT purchase has been successfully completed. You can view your NFT using the link below:</p>
                        <p style="margin: 0;"><a href="${content}" style="color: #357abd; text-decoration: none;">View your NFT</a></p>
                    </div>

                    ${isPending ? `
                    <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="color: #333; margin: 0 0 20px; font-size: 20px;">Claim Your NFT</h2>
                        <p style="color: #666; margin: 0 0 10px;">Your NFT has been minted and is held securely. Log in to your HubsAI account to transfer it to your wallet:</p>
                        <p style="margin: 0;"><a href="${userSiteUrl}" style="color: #357abd; text-decoration: none; font-weight: bold;">Log in to claim your NFT &rarr;</a></p>
                    </div>

                    <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="color: #333; margin: 0 0 20px; font-size: 20px;">How to claim</h2>
                        <ol style="color: #666; padding-left: 20px; margin: 0;">
                            <li style="margin: 10px 0;">Click the button above or the "View Your NFT on HubsAI" link</li>
                            <li style="margin: 10px 0;">Sign in with the email address you used at checkout</li>
                            <li style="margin: 10px 0;">Your NFT will be transferred to your wallet automatically</li>
                        </ol>
                    </div>` : `
                    <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="color: #333; margin: 0 0 20px; font-size: 20px;">Wallet Information</h2>
                        <p style="color: #666; margin: 0 0 10px;">Your wallet address:</p>
                        <p style="color: #333; background-color: #f8f9fa; padding: 10px; border-radius: 4px; word-break: break-all; font-family: monospace; margin: 0;">${walletAddress}</p>
                    </div>

                    <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="color: #333; margin: 0 0 20px; font-size: 20px;">Viewing Your NFT</h2>
                        <ol style="color: #666; padding-left: 20px; margin: 0;">
                            <li style="margin: 10px 0;">Click the "View Your NFT on HubsAI" button above to go to your account</li>
                            <li style="margin: 10px 0;">Sign in with the email address you used at checkout</li>
                            <li style="margin: 10px 0;">Your NFT will appear in your collection</li>
                        </ol>
                    </div>`}

                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #666; font-size: 14px; margin: 0 0 10px;">For support inquiries, please contact:</p>
                        <p style="color: #357abd; font-size: 14px; margin: 0;">support@hubsai.io</p>
                    </div>
                </div>
            </div>
        `
    });

    if (error) {
        throw new Error(`Email sending failed: ${error.message}`);
    }

    console.log('4️⃣ Email sent successfully:', toEmail);
}
