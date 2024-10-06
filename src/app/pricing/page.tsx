"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/backbutton/Button";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Pricing: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const payId = "price_1Q6fbf09wN7R5HTy2MhXhG9c";

  const handleServices = async (plan: string, priceId?: string) => {
    setLoading(true);
    if (plan === "basic") {
      router.push("/services");
    } else if (plan === "premium") {
      if (!priceId) {
        console.error("Price ID is required for the premium plan");
        setLoading(false);
        return;
      }
      const stripe = await stripePromise;

      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: "premium",
            priceId: payId,
            email: userEmail,
          }),
        });

        const { sessionId, error } = await response.json();

        if (error) {
          throw new Error(error);
        }

        const result = await stripe?.redirectToCheckout({ sessionId });

        if (result?.error) {
          console.error("Stripe Checkout Error: ", result.error.message);
        }
      } catch (error) {
        console.error("Error during checkout: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 min-h-[100dvh] md:grid-cols-2 gap-8 max-w-4xl mx-auto py-12 px-4 md:px-0 background-container">
      <BackButton />
      <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-[#917953]">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-black">Basic Plan</h3>
          <div className="text-4xl font-bold text-black">-</div>
        </div>
        <p className="text-gray-950 mt-4">
          Get started with our basic plan for small teams.
        </p>
        <div className="mt-6 space-y-3">
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-5 w-5 text-accent" />
            <span className="text-black">Pitch Guide Videos</span>
          </div>
          <div className="flex items-center space-x-2 opacity-50">
            <XIcon className="h-5 w-5 text-destructive" />
            <span className="line-through text-black">
              Unlimited Business Events
            </span>
          </div>
          <div className="flex items-center space-x-2 opacity-50">
            <XIcon className="h-5 w-5 text-destructive" />
            <span className="line-through text-black">Priority Support</span>
          </div>
        </div>
        <Button
          className="w-full mt-6 bg-border transform transition duration-300 hover:scale-105"
          onClick={() => handleServices("basic")}
        >
          {loading ? <Loader /> : "Get Started"}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-[#917953]">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-black">Premium Plan</h3>
        </div>
        <p className="text-gray-500 dark:text-gray-950 mt-4">
          Our premium plan offers advanced features for growing teams.
        </p>
        <div className="mt-6 space-y-3">
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-5 w-5 text-accent" />
            <span className="text-black">Basic Plan</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-5 w-5 text-accent" />
            <span className="text-black">Unlimited Business Assistance</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-5 w-5 text-accent" />
            <span className="text-black">Priority Support</span>
          </div>
        </div>
        <Button
          className="w-full mt-6 bg-border transform transition duration-300 hover:scale-105"
          onClick={() => handleServices("premium", "250")} // Pass the correct Stripe Price ID here
        >
          {loading ? <Loader /> : "Get Started"}
        </Button>
      </div>
    </div>
  );
};

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export default Pricing;
