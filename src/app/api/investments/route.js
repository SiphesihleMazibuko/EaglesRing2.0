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

    // Get the session and check if the investor email exists
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: 'Investor email not found in session' }), { status: 401 });
    }

    const investorEmail = session.user.email;

    await connectMongoDB();

    const investor = await User.findOne({ email: investorEmail });
    console.log('Investor found:', investor); // Debugging

    if (!investor || !investor.mentorFullName || !investor.mentorEmail) {
      return new Response(JSON.stringify({ error: 'Mentor details not found for this investor' }), { status: 404 });
    }

    // Check if the investor already has a Stripe customer ID
    let customerId = investor.stripeCustomerId;

    if (!customerId) {
      // Create a new Stripe customer if none exists
      const customer = await stripe.customers.create({
        email: investorEmail,
        name: `${investor.fullName}`, // Assuming you store investor's name in the DB
      });

      console.log('Stripe customer created:', customer.id); // Debugging

      // Update the MongoDB database with the new Stripe customer ID
      investor.stripeCustomerId = customer.id;

      // Save the updated investor object
      try {
        await investor.save();
        console.log('Investor updated with customerId:', investor.stripeCustomerId); // Debugging
      } catch (error) {
        console.error('Error saving investor:', error); // Debugging save error
        return new Response(JSON.stringify({ error: 'Failed to save customerId in database' }), { status: 500 });
      }

      customerId = customer.id;
    }

    // Create the Stripe Checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      customer: customerId, // Attach the Stripe customer ID here
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

    // Send email notification to the entrepreneur
    await sendEmailNotification(entrepreneurEmail, amount, investorEmail, companyName, investor.mentorFullName, investor.mentorEmail);

    // Return the session URL as a response for redirecting
    return new Response(JSON.stringify({ url: stripeSession.url }), { status: 200 });
  } catch (error) {
    console.error('Error during payment session creation:', error);
    return new Response(JSON.stringify({ error: 'Payment session creation failed' }), { status: 500 });
  }
}

// Helper function to send email notifications
async function sendEmailNotification(entrepreneurEmail, amount, investorEmail, companyName, mentorFullName, mentorEmail) {
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
    from: process.env.EMAIL_USER, 
    to: entrepreneurEmail,
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
