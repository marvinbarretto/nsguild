import nodemailer from 'nodemailer';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    console.log('Received form submission:', { name, email, message });

    if (!name || !email || !message) {
        return new Response(
            JSON.stringify({
              message: "Missing required fields",
            }),
            { status: 400 }
          );
    }

    // Configure Gmail SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: 'marvinbarretto+ns@gmail.com', // Your Gmail address
            pass: 'ohre gwsx cnju tbdn',   // Use an App Password here
        },
    });

    // Compose the email
    const mailOptions = {
        from: `"Website Contact" <secretary@thedomain.com>`, // Replace with sender email
        to: 'marvinbarretto@gmail.com',                        // Replace with your email
        subject: `New Contact Form Submission from ${name}`,
        text: `
            You have a new message:
            Name: ${name}
            Email: ${email}
            Message: ${message}
        `,
    };

    try {
        // Simulate sending email
        console.log('Sending email with the following data:', { name, email, message });
        await transporter.sendMail(mailOptions);
        // Return a JSON success response
        return new Response(JSON.stringify({ message: 'Message sent successfully.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ error: 'Failed to send message.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
