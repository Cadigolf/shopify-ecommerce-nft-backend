import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);  // Replace with your actual API key

export const sendMessagetoEmail = async (toEmail: string, content: string) => {
    try {
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev', // Must use a verified domain or the default Resend sender
            to: toEmail,
            subject: "Congratulations!",
            html: '<p>Hey there! 👋<br>You received a new NFT.</p><a href="' + content + '">View NFT</a>'
        });

        console.log('3️⃣ Email sent successfully');
    } catch (error) {
        console.error('❌ Failed to send email:', error);
    }
}
