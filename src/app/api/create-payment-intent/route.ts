import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
    try{
        const {amount} = await request.json();

        if(!amount){
            throw new Error("Amount is missing")
        }
        console.log("Amount received:", amount)

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "zar",
            automatic_payment_methods: {enabled: true},
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret});
    } catch (error){
        console.error("Internal Error:", error);

        return NextResponse.json(
            {error:`Internal Server error: ${error}`},
            {status: 500}
        );
    }
}