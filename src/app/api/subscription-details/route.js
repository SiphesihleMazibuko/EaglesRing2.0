import Stripe from "stripe";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET or POST handler for subscription details
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400 }
      );
    }

    // Connect to the MongoDB database
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user || !user.subscriptionID) {
      return new Response(
        JSON.stringify({ error: "Subscription not found" }),
        { status: 404 }
      );
    }

    // Fetch subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      user.subscriptionID
    );

    return new Response(
      JSON.stringify({
        subscriptionStatus: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return new Response(
      JSON.stringify({ error: "Email is required" }),
      { status: 400 }
    );
  }

  try {
    // Connect to the MongoDB database
 await connectToDatabase();
    const user = await User.findOne({ email });


    if (!user || !user.subscriptionID) {
      return new Response(
        JSON.stringify({ error: "Subscription not found" }),
        { status: 404 }
      );
    }

    // Fetch subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      user.subscriptionID
    );

    return new Response(
      JSON.stringify({
        subscriptionStatus: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
