import Stripe from "stripe";
import  connectToDatabase  from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    // Parse request body
    const { email } = await req.json();
    
    if (!email) {
      console.error("No email provided");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Ensure the database is connected
    await connectToDatabase();

    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`User not found with email: ${email}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.subscriptionID) {
      console.error(`No subscription ID for user: ${email}`);
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    // Cancel the subscription in Stripe
    try {
      await stripe.subscriptions.cancel(user.subscriptionID);
    } catch (stripeError) {
      console.error("Error cancelling subscription in Stripe:", stripeError);
      return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
    }

    // Update the user’s record in the database
    user.plan = "basic";
    user.subscriptionID = null;
    user.subscriptionStatus = null;
    
    try {
      await user.save();
    } catch (dbError) {
      console.error("Error saving user data:", dbError);
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }

    return NextResponse.json({ message: "Subscription canceled successfully" }, { status: 200 });
  } catch (err) {
    console.error("Internal Server Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
