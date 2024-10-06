import Stripe from "stripe";
import { NextResponse } from "next/server";
import  connectToDatabase from "@/lib/mongodb"; // Assuming you're using MongoDB
import User from "@/models/user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { priceId, email, plan } = await req.json();
    console.log("Received request data:", { priceId, email, plan });


    if (!priceId || !email) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}pricing`,
    });

   await connectToDatabase();
   console.log('Connected To MongoDB')
    const user = await User.findOneAndUpdate(
      { email }, 
      {
        $set: {
          plan, 
        },
      },
      { new: true, upsert: true} 
    );
    console.log('User updated:', user)

    // Return the session ID to the frontend
    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe Checkout Error: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
