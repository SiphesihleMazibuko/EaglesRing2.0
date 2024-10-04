"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5); // Start with 5 seconds

  useEffect(() => {
    setRedirecting(true);

    // Timer to update the countdown every second
    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Timer for redirecting after 5 seconds
    const redirectTimer = setTimeout(() => {
      router.push("/projects");
    }, 5000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownTimer); // Clean up countdown interval
    };
  }, [router]);

  return (
    <main className="max-w-6xl mx-auto p-10 text-input text-center border m-10 rounded-md bg-gradient-to-tr from-[#917953] to-[#CBAC7C]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">
          Thank you! Your Investment is highly appreciated
        </h1>
        {/* Show redirecting message and countdown */}
        {redirecting && (
          <div className="mt-5 flex flex-col items-center">
            <p className="text-lg font-medium">
              Redirecting in {countdown} seconds...
            </p>
            <div className="mt-3">
              {/* Spinner for extra feedback */}
              <div className="mt-3">
                <Spinner />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
