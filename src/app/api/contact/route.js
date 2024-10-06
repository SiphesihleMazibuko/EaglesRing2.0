import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { firstName, lastName, email, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return new Response(JSON.stringify({ message: "All fields are required" }), {
        status: 400,
      });
    }

    // Create a Nodemailer transporter using your email credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or any email service you use (e.g., Gmail, SMTP)
      auth: {
        user: process.env.EMAIL_USER, // Add your email address in environment variables
        pass: process.env.EMAIL_PASSWORD, // Add your email password or app-specific password in environment variables
      },
      tls:{
        rejectUnauthorized: false,
      }
    });

    // Email options
    const mailOptions = {
      from: email, // Sender email
      to: 'ecotracker407@gmail.com', // Your company email
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      text: `You have received a new message from ${firstName} ${lastName} (${email}):\n\n${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: "Message sent successfully!" }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ message: "Failed to send message" }), {
      status: 500,
    });
  }
}
