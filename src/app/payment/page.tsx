"use client";
import CheckOutPage from "@/components/CheckOutPage";
import Spinner from "@/components/ui/Spinner";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const amount = 149.99;

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount * 100 }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      })
      .catch((error) => {
        console.error("Error fetching client secret:", error);
      });
  }, [amount]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const username = session?.user?.name || "Guest";
  return (
    <div className="min-h-[100dvh] max-w-6xl mx-auto p-10 text-input background-container text-center border m-10 rounded-md bg-gradient-to-tr from-[#917953] to-[#CBAC7C]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">{username}</h1>
        <h2 className="text-2xl">
          wants to pay <span className="font-bold">R{amount}</span>
        </h2>
      </div>
      {clientSecret ? (
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
      ) : (
        <Spinner />
      )}
    </div>
  );
}
