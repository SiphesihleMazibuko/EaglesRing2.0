import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { generateContractPDF } from '@/lib/generateContractPDF'; 
import authOptions from '@/lib/authOptions';
import connectMongoDB from '@/lib/mongodb';
import User from '@/models/user';
import Pitch from '@/models/pitch';
import cloudinary from '@/lib/cloudinary';
import nodemailer from 'nodemailer';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is missing in environment variables");
}

const stripe = new Stripe(stripeSecretKey);

async function sendEmailNotification(recipientEmail, amount, investorEmail, companyName, entrepreneurName, mentorFullName, mentorEmail, contractBuffer) {
  console.log('Sending email to:', recipientEmail);

  if (!recipientEmail) {
    throw new Error("No recipient email provided");
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: 'Investment Received',
    text: `You have received an investment of R${amount} from ${investorEmail} for your project "${companyName}" on Eagles Ring. Your mentor is ${mentorFullName}, and their email is ${mentorEmail}. Please check the attached investment contract for details.`,
    attachments: [
      {
        filename: 'Investment_Contract.pdf',
        content: contractBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', recipientEmail);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email notification failed.');
  }
}

export async function POST(req) {
  try {
    const body = await req.json(); 

    const { amount, entrepreneurEmail, companyName, pitchId, entrepreneurName } = body;

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: 'Investor email not found in session' }), { status: 401 });
    }

    const investorEmail = session.user.email;
    const investorFullName = session.user.name;
    const investorId = session.user.id;

    await connectMongoDB();
    const investor = await User.findOne({ email: investorEmail });

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
            unit_amount: amount * 100, 
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
        entrepreneurName,
      },
    });

    // Update the pitch to reflect the investment
    await Pitch.updateOne(
      { _id: pitchId },
      {
        $set: {
          isInvested: true,
          investorId: investorId,
        },
      }
    );

    // Generate the contract PDF using the separated function
    const contractBuffer = await generateContractPDF(
      investorEmail, entrepreneurEmail, companyName, amount, investorFullName, entrepreneurName
    );

    // Upload contract to Cloudinary
    const cloudinaryUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'contracts', resource_type: 'raw', format: 'pdf' }, // Upload as raw PDF
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(contractBuffer); // Pass PDF buffer to Cloudinary upload
    });

    // Store contract URL in the database
    await Pitch.updateOne(
      { _id: pitchId },
      {
        $set: {
          isInvested: true,
          investorId: investorId,
          contractUrl: cloudinaryUpload.secure_url, 
        },
      }
    );

    // Send email notifications (if needed)
    await sendEmailNotification(
      entrepreneurEmail,
      amount,
      investorEmail,
      companyName,
      entrepreneurName,
      mentorFullName,
      mentorEmail,
      contractBuffer
    );

    await sendEmailNotification(
      investorEmail,
      amount,
      entrepreneurEmail,
      companyName,
      entrepreneurName,
      mentorFullName,
      mentorEmail,
      contractBuffer
    );

    return new Response(JSON.stringify({ url: stripeSession.url }), { status: 200 });
  } catch (error) {
    console.error('Error during payment session creation:', error);
    return new Response(JSON.stringify({ error: 'Payment session creation failed' }), { status: 500 });
  }
}
