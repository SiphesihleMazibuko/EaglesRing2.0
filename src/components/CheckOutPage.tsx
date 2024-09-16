"use client";
import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { toast } from "react-toastify";

const CheckOutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setErrorMessage("Failed to fetch client secret.");
        }
      })
      .catch((err) => {
        console.error("Error fetching client secret:", err);
        setErrorMessage("Error fetching client secret.");
      });
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) {
      setErrorMessage(
        "Stripe has not initialized properly or client secret is missing."
      );
      setLoading(false);
      return;
    }

    // Submit payment through Stripe
    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    // Confirm payment
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `https://eagles-ring2-0.vercel.app/payment-success`,
      },
    });

    if (confirmError) {
      setErrorMessage(confirmError.message);
      setLoading(false);
      return;
    }

    const projectData = sessionStorage.getItem("projectData");

    if (projectData) {
      try {
        const response = await fetch("/api/saveProject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: projectData,
        });

        if (response.ok) {
          toast.success("Project posted successfully!");

          sessionStorage.removeItem("projectData");
        } else {
          const errorData = await response.json();
          toast.error(`Failed to post project: ${errorData.message}`);
        }
      } catch (error) {
        toast.error("An error occurred while posting the project.");
      }
    } else {
      console.error("No project data found in sessionStorage.");
    }

    setLoading(false);
  };

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-none dark:text-input"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-input p-2 rounded-md">
      <PaymentElement />
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
      <button
        disabled={!stripe || loading}
        className="text-input w-full p-5 bg-neutral-950 mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? `Pay R${amount}` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckOutPage;
