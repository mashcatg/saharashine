const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, message } = req.body;

        // Validate inputs
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ error: 'Please enter a valid email' });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: `"Sahara Shine Contact Form" <${process.env.EMAIL_USER}>`,
            to: 'istiaquezaman51@gmail.com',
            replyTo: email,
            subject: `New Contact Form Message from ${name}`,
            text: `
You have received a new message from your website contact form.

Name: ${name}
Email: ${email}

Message:
${message}
            `,
            html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Thank you! Your message has been sent.' });
    } catch (error) {
        console.error('Mail error:', error);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
}
