import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import authOptions from '@/lib/authOptions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  console.log("Getting session...");
  const session = await getServerSession({ req, ...authOptions });

  if (!session) {
    console.log("User not authenticated.");
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  console.log("Session details:", session);

  // Connect to the database
  await dbConnect();
  console.log("Connected to MongoDB");

  // Find the user by email
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    console.log(`User not found with email: ${session.user.email}`);
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  console.log("User found:", user);

  const baseURL = process.env.NEXTAUTH_URL;
  console.log("Base URL:", baseURL);

  // Check userType and handle accordingly
  if (user.userType === 'Investor') {
    console.log("User is an Investor. Redirecting to projects page.");
    return NextResponse.redirect(`${baseURL}/projects`);
  } else if (user.userType === 'Entrepreneur') {
    console.log("User is an Entrepreneur. Checking subscription...");

    if (user.subscriptionID) {
      console.log("User has subscriptionID:", user.subscriptionID);

      try {
        // Fetch the subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(user.subscriptionID);
        console.log("Stripe subscription fetched:", subscription);

        // If the subscription is active, redirect to services
        if (subscription.status === 'active' || subscription.status === 'paid') {
          console.log("Subscription is active/paid. Redirecting to services page.");
          return NextResponse.redirect(`${baseURL}/services`);
        } else {
          console.log(`Subscription status is ${subscription.status}. Redirecting to pricing page.`);
          return NextResponse.redirect(`${baseURL}/pricing`);
        }
      } catch (error) {
        console.error('Error fetching subscription from Stripe:', error);
        console.log("Redirecting to pricing page due to Stripe error.");
        return NextResponse.redirect(`${baseURL}/pricing`);
      }
    } else {
      console.log("No subscriptionID found. Redirecting to pricing page.");
      return NextResponse.redirect(`${baseURL}/pricing`);
    }
  } else {
    console.log("Unknown userType. Redirecting to services page.");
    return NextResponse.redirect(`${baseURL}/services`);
  }
}
