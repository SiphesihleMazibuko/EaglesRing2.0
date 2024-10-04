import { getServerSession } from 'next-auth'; 
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import authOptions from '@/lib/authOptions';

// Ensure that the Stripe secret key is provided
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    throw new Error("Stripe secret key is missing in environment variables");
}

// Initialize Stripe
const stripe = new Stripe(stripeSecretKey)

// Named export for the POST request handler
export async function POST(req) {
  try {
    const body = await req.json(); // Parse the request body

    const { amount, entrepreneurEmail, companyName } = body;

    // Fetch session from NextAuth using getServerSession
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      throw new Error("Investor email not found in session.");
    }

    const investorEmail = session.user.email;

    // Create a payment session with Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'zar',
            product_data: {
              name: `Investment for Pitch: ${companyName}`,
            },
            unit_amount: amount * 100, // Convert amount to cents for Stripe
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-success`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
      metadata: {
        entrepreneurEmail,
        companyName,
      },
    });

    // Send email notification
    await sendEmailNotification(entrepreneurEmail, amount, investorEmail);

    // Return the session ID as a response
    return new Response(JSON.stringify({ id: stripeSession.id }), { status: 200 });
  } catch (error) {
    console.error('Error during payment session creation:', error);
    return new Response(JSON.stringify({ error: 'Payment session creation failed' }), { status: 500 });
  }
}

// Helper function to send email notifications
async function sendEmailNotification(
  entrepreneurEmail, 
  amount, 
  investorEmail
) {

  console.log('Entrepreneur Email:',entrepreneurEmail);

  if(!entrepreneurEmail){
    throw new Error("No recipient email provided")
  }
 const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email credentials
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
  },
});


  const mailOptions = {
    from: process.env.EMAIL_USER, // Platform email (e.g., noreply@yourwebsite.com)
    to: entrepreneurEmail, // Entrepreneur's email (recipient)
    subject: 'Investment Received',
    text: `You have received an investment of R${amount} from ${investorEmail}. Please log in to your dashboard for more details.`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email notification failed.');
  }
}
