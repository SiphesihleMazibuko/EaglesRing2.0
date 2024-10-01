import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import Spinner from "./ui/Spinner";

// Function to upload a file to Cloudinary with a signed request
async function uploadToCloudinary(file: string | Blob, folder: string | Blob) {
  // Fetch signature and timestamp from your API
  const signatureResponse = await fetch("/api/cloudinary-signature");
  const { signature, timestamp, cloudName } = await signatureResponse.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Cloudinary API key");
  }

  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/dx0mmgase/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${data.error.message}`);
  }

  return data.secure_url;
}

const CheckOutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

    const projectData = sessionStorage.getItem("pendingProject");

    if (projectData) {
      try {
        const parsedProjectData = JSON.parse(projectData);

        let imageUrl = null;
        let videoUrl = null;

        // Handle Cloudinary uploads (client-side)
        const imageFile = sessionStorage.getItem("pendingImage");
        const videoFile = sessionStorage.getItem("pendingVideo");

        if (imageFile) {          imageUrl = await uploadToCloudinary(
            imageFile,
            "eagles_ring_projects"
          );
        }

        if (videoFile) {
          videoUrl = await uploadToCloudinary(
            videoFile,
            "eagles_ring_projects"
          );
        }

        const response = await fetch("/api/saveProject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName: parsedProjectData.companyName,
            projectIdea: parsedProjectData.projectIdea,
            businessPhase: parsedProjectData.businessPhase,
            investmentAmount: parsedProjectData.investmentAmount,
            imageUrl, // Pass the Cloudinary image URL
            videoUrl, // Pass the Cloudinary video URL
          }),
        });

        // Check for valid JSON response
        const responseText = await response.text();
        if (!response.ok) {
          throw new Error(`Failed to post project: ${responseText}`);
        }

        try {
          const responseData = JSON.parse(responseText); // Parse JSON only if it's valid
          toast.success("Project posted successfully!");
          sessionStorage.removeItem("pendingProject");
          sessionStorage.removeItem("pendingImage");
          sessionStorage.removeItem("pendingVideo");
          router.push("/project-success");
        } catch (parseError) {
          console.error("Error parsing response as JSON:", responseText);
          throw new Error(`Unexpected response format: ${responseText}`);
        }
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
        <Spinner />
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
