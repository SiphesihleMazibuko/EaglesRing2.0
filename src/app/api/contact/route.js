import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { firstName, lastName, email, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return new Response(JSON.stringify({ message: "All fields are required" }), {
        status: 400,
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD, 
      },
      tls:{
        rejectUnauthorized: false,
      }
    });

    const mailOptions = {
      from: email, 
      to: 'ecotracker407@gmail.com', 
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      text: `You have received a new message from ${firstName} ${lastName} (${email}):\n\n${message}`,
    };


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
