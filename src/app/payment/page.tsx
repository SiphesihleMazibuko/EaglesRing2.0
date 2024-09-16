"use client";
import CheckOutPage from "@/components/CheckOutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPage() {
  const amount = 149.99;
  return (
    <main className="max-w-6xl mx-auto p-10 text-input text-center border m-10 rounded-md bg-gradient-to-tr from-[#917953] to-[#CBAC7C]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Username</h1>
        <h2 className="text-2xl">
          want to pay
          <span className="font-bold">R{amount}</span>
        </h2>
      </div>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "zar",
        }}
      >
        <CheckOutPage amount={amount} />
      </Elements>
    </main>
  );
}
