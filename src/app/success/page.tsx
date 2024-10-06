"use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Success = () => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    setRedirecting(true);

    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      router.push("/services");
    }, 5000);
    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownTimer);
    };
  }, [router]);
  return (
    <main className="max-w-6xl  mx-auto p-10 text-input text-center border m-10 rounded-md bg-gradient-to-tr from-[#917953] to-[#CBAC7C]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">
          Thank you! Your Premium Subscription has been paid
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
};

export default Success;
