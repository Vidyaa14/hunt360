import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export async function sendMailWithRetry(
    mailOptions,
    retries = 3,
    delay = 2000
) {
    for (let attempt = retries; attempt > 0; attempt--) {
        try {
            const info = await transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            if (attempt === 1) throw error;
            console.warn(
                `Retrying email send... Attempts left: ${attempt - 1}. Error: ${error.message}`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}
