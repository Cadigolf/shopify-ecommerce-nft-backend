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

export const sendMessagetoEmail = async (toEmail: string, content: string, walletAddress: string) => {
    try {
        await transporter.verify();
        const mailOptions = {
            from: process.env.MANAGER_GMAIL,
            to: toEmail,
            subject: 'Congratulations!',
            html: `<p>Hey there! 👋<br><a href="${content}">You received a new NFT.</a><br>Your wallet address: ${walletAddress}</p>`
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
