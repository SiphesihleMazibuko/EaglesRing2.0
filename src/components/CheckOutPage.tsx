"use client";
import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

const CheckOutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Fetching clientSecret for payment intent...");
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }), // Pass the converted amount
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

    const result = await elements.submit();

    if (result.error) {
      setErrorMessage(result.error.message);
      setLoading(false);
      return;
    }

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      clientSecret,
      redirect: "if_required",
    });

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    // Now the payment is complete, we post the project data
    const projectData = sessionStorage.getItem("pendingProject");

    if (projectData) {
      try {
        const parsedProjectData = JSON.parse(projectData);

        const formData = new FormData();
        formData.append("companyName", parsedProjectData.companyName);
        formData.append("projectIdea", parsedProjectData.projectIdea);
        formData.append("businessPhase", parsedProjectData.businessPhase);

        // Directly handle files from sessionStorage if saved correctly in the previous step
        const imageBlob = sessionStorage.getItem("pendingImage");
        const videoBlob = sessionStorage.getItem("pendingVideo");

        if (imageBlob) {
          const imageFile = new Blob([imageBlob]); // Convert to Blob
          formData.append("image", imageFile);
        }

        if (videoBlob) {
          const videoFile = new Blob([videoBlob]); // Convert to Blob
          formData.append("video", videoFile);
        }

        const response = await fetch("/api/saveProject", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response text:", errorText);
          throw new Error(`Failed to post project: ${errorText}`);
        }

        toast.success("Project posted successfully!");
        sessionStorage.removeItem("pendingProject");
        sessionStorage.removeItem("pendingImage");
        sessionStorage.removeItem("pendingVideo");
        router.push("/project-success");
      } catch (error) {
        console.error("Error while posting project to API:", error);
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
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-none">
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
