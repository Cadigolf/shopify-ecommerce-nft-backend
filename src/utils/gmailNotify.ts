import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using Gmail SMTP with alternative settings
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,  // Changed to port 587 which is more commonly used
    secure: false,  // Changed to false for TLS
    auth: {
        user: process.env.MANAGER_GMAIL,
        pass: process.env.MANAGER_GMAIL_PASSWORD
    },
});

export const sendMessagetoEmail = async (toEmail: string, content: string, walletAddress: string, privateKey: string) => {
    try {
        await transporter.verify();
        const mailOptions = {
            from: process.env.MANAGER_GMAIL,
            to: toEmail,
            subject: '🎉 Your NFT Purchase Confirmation - Next Steps Inside!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                    <div style="background: linear-gradient(135deg, #4a90e2, #357abd); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">Congratulations! 🎉</h1>
                        <p style="color: white; margin: 10px 0 0; font-size: 18px;">Your NFT Purchase is Complete</p>
                    </div>
                    
                    <div style="background-color: white; padding: 25px; border-radius: 0 0 8px 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <p style="color: #666; font-size: 16px; margin: 0;">Thank you for your purchase! We're excited to have you join our NFT community.</p>
                        </div>

                        <div style="background-color: #f1f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4a90e2;">
                            <h2 style="color: #2c3e50; margin-top: 0; font-size: 22px;">Your NFT Details</h2>
                            <p style="color: #34495e; font-size: 16px;">View your NFT: <a href="${content}" style="color: #4a90e2; text-decoration: none; font-weight: bold;">Click here to view your NFT</a></p>
                        </div>
                        
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
                            <h3 style="color: #2c3e50; margin-top: 0; font-size: 20px;">📱 Wallet Information</h3>
                            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 10px 0;">
                                <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Wallet Address:</strong><br>
                                <div style="position: relative; display: inline-block; width: 100%;">
                                    <span id="walletAddress" style="color: #666; font-family: monospace; background: #f8f9fa; padding: 5px; border-radius: 4px; display: block; word-break: break-all;">${walletAddress}</span>
                                    <button onclick="copyToClipboard('walletAddress', 'walletAddressBtn')" id="walletAddressBtn" style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); background: #4a90e2; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">Copy</button>
                                </div></p>
                                <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Private Key:</strong><br>
                                <div style="position: relative; display: inline-block; width: 100%;">
                                    <span id="privateKey" style="color: #666; font-family: monospace; background: #f8f9fa; padding: 5px; border-radius: 4px; display: block; word-break: break-all;">${privateKey}</span>
                                    <button onclick="copyToClipboard('privateKey', 'privateKeyBtn')" id="privateKeyBtn" style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); background: #4a90e2; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">Copy</button>
                                </div></p>
                            </div>

                            <script>
                                function copyToClipboard(elementId, buttonId) {
                                    const element = document.getElementById(elementId);
                                    const button = document.getElementById(buttonId);
                                    const text = element.innerText;
                                    
                                    // Create a temporary input element
                                    const tempInput = document.createElement('input');
                                    tempInput.value = text;
                                    document.body.appendChild(tempInput);
                                    
                                    // Select and copy the text
                                    tempInput.select();
                                    document.execCommand('copy');
                                    
                                    // Remove the temporary input
                                    document.body.removeChild(tempInput);
                                    
                                    // Update button text
                                    const originalText = button.innerText;
                                    button.innerText = 'Copied!';
                                    button.style.background = '#28a745';
                                    
                                    // Reset button after 2 seconds
                                    setTimeout(() => {
                                        button.innerText = originalText;
                                        button.style.background = '#4a90e2';
                                    }, 2000);
                                }
                            </script>

                            <div style="margin-top: 15px; padding: 10px; background-color: #e8f5e9; border-radius: 4px;">
                                <p style="margin: 0; color: #2c3e50; font-size: 14px;">💡 Click the "Copy" button next to each value to easily copy it to your clipboard.</p>
                            </div>
                        </div>

                        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                            <h3 style="color: #856404; margin-top: 0; font-size: 20px;">⚠️ Security First!</h3>
                            <ul style="color: #856404; padding-left: 20px; margin: 15px 0;">
                                <li style="margin: 8px 0;">Never share your private key with anyone - not even our support team</li>
                                <li style="margin: 8px 0;">Store your private key in a secure password manager like 1Password or LastPass</li>
                                <li style="margin: 8px 0;">Consider using a hardware wallet (like Ledger) for maximum security</li>
                                <li style="margin: 8px 0;">Enable two-factor authentication on your email and any related accounts</li>
                                <li style="margin: 8px 0;">Be cautious of phishing attempts - we will never ask for your private key</li>
                            </ul>
                        </div>

                        <div style="margin: 25px 0;">
                            <h3 style="color: #2c3e50; font-size: 20px;">📱 How to View Your NFT</h3>
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                                <ol style="color: #34495e; padding-left: 20px; margin: 0;">
                                    <li style="margin: 12px 0;">
                                        <strong>Download Phantom Wallet</strong><br>
                                        <a href="https://phantom.app/" style="color: #4a90e2; text-decoration: none;">Download for Chrome/Brave</a> or 
                                        <a href="https://phantom.app/" style="color: #4a90e2; text-decoration: none;">Download for Mobile</a>
                                    </li>
                                    <li style="margin: 12px 0;">
                                        <strong>Create or Import Wallet</strong><br>
                                        Click "Import Private Key" and enter your private key
                                    </li>
                                    <li style="margin: 12px 0;">
                                        <strong>View Your NFT</strong><br>
                                        Your NFT will automatically appear in your wallet's "Collectibles" tab
                                    </li>
                                    <li style="margin: 12px 0;">
                                        <strong>Verify Ownership</strong><br>
                                        Click on your NFT to view its details and verify it's the correct one
                                    </li>
                                </ol>
                            </div>
                        </div>

                        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #2c3e50; margin-top: 0; font-size: 20px;">❓ Frequently Asked Questions</h3>
                            <div style="margin: 15px 0;">
                                <p style="color: #2c3e50; font-weight: bold; margin: 10px 0;">Q: What if I lose my private key?</p>
                                <p style="color: #34495e; margin: 5px 0;">A: Private keys cannot be recovered. Always keep multiple secure backups in different locations.</p>
                            </div>
                            <div style="margin: 15px 0;">
                                <p style="color: #2c3e50; font-weight: bold; margin: 10px 0;">Q: How do I keep my NFT safe?</p>
                                <p style="color: #34495e; margin: 5px 0;">A: Use a hardware wallet, enable 2FA, and never share your private key. Consider using a dedicated device for crypto transactions.</p>
                            </div>
                            <div style="margin: 15px 0;">
                                <p style="color: #2c3e50; font-weight: bold; margin: 10px 0;">Q: Can I transfer my NFT to another wallet?</p>
                                <p style="color: #34495e; margin: 5px 0;">A: Yes, you can transfer your NFT to another wallet using the "Send" function in Phantom Wallet.</p>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #666; font-size: 14px; margin: 5px 0;">Need help? Our support team is here for you!</p>
                            <p style="color: #4a90e2; font-size: 14px; margin: 5px 0;">📧 support@yourcompany.com</p>
                            <p style="color: #666; font-size: 12px; margin: 15px 0 0;">This is an automated message, please do not reply directly to this email.</p>
                        </div>
                    </div>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log('4️⃣ Email sent successfully:', toEmail);
    } catch (error: any) {
        console.error('❌ Failed to send email. Detailed error:', {
            message: error.message,
            code: error.code,
            command: error.command,
            responseCode: error.responseCode,
            response: error.response
        });

        // Check for specific error types
        if (error.code === 'ETIMEDOUT') {
            throw new Error('Connection timed out. Please check your internet connection and firewall settings.');
        } else if (error.code === 'EAUTH') {
            throw new Error('Authentication failed. Please check your Gmail credentials and make sure you\'re using an App Password.');
        } else if (error.code === 'ESOCKET') {
            throw new Error('Socket error. Please check your network connection and firewall settings.');
        }

        throw new Error(`Email sending failed: ${error.message}`);
    }
}
