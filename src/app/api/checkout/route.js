import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import authOptions from '@/lib/authOptions';
import connectMongoDB from '@/lib/mongodb';
import User from '@/models/user';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is missing in environment variables");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(req) {
  try {
    const body = await req.json(); 

    const { amount, entrepreneurEmail, companyName } = body;

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: 'Investor email not found in session' }), { status: 401 });
    }

    const investorEmail = session.user.email;

    await connectMongoDB();
    const investor = await User.findOne({email: investorEmail})

     if (!investor || !investor.mentorFullName || !investor.mentorEmail) {
      return new Response(JSON.stringify({ error: 'Mentor details not found for this investor' }), { status: 404 });
    }

    const mentorFullName = investor.mentorFullName;
    const mentorEmail = investor.mentorEmail;

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
    await sendEmailNotification(entrepreneurEmail, amount, investorEmail, companyName, mentorFullName, mentorEmail);

    // Return the session URL as a response for redirecting
    return new Response(JSON.stringify({ url: stripeSession.url }), { status: 200 });
  } catch (error) {
    console.error('Error during payment session creation:', error);
    return new Response(JSON.stringify({ error: 'Payment session creation failed' }), { status: 500 });
  }
}

// Helper function to send email notifications
async function sendEmailNotification(entrepreneurEmail, amount, investorEmail, companyName, mentorFullName, mentorEmail) {
  console.log('Entrepreneur Email:', entrepreneurEmail);

  if (!entrepreneurEmail) {
    throw new Error("No recipient email provided");
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
     text: `You have received an investment of R${amount} from ${investorEmail} regarding your project "${companyName}" posted on Eagles Ring. Your assigned mentor is ${mentorFullName}, and their email is ${mentorEmail}. We urge you to stay in touch with them. Please log in to your dashboard for more details.`,
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
