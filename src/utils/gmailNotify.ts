import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);  // Replace with your actual API key

// Function to send an email
export const sendMessagetoEmail = async () => {
    try {
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev', // Must use a verified domain or the default Resend sender
            to: 'igorkuzmenko0412@gmail.com',
            subject: 'Hello from Node.js!',
            html: '<p>Hey there! 👋<br>This message was sent from Node.js using Resend API.</p>'
        });

        console.log('✅ Email sent successfully:', response);
    } catch (error) {
        console.error('❌ Failed to send email:', error);
    }
}
