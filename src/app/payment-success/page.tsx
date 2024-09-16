"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    setRedirecting(true);
    const timer = setTimeout(() => {
      router.push("/postproject");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="max-w-6xl mx-auto p-10 text-input text-center border m-10 rounded-md bg-gradient-to-tr from-[#917953] to-[#CBAC7C]">
      <div className="mb-10">
        <h1 className="text-4xl">Thank you! Your project has been posted</h1>
        <h2 className="text-2xl">You successfully paid</h2>
        <div className="bg-input p-2 rounded-md text-secondary mt-5 text-4xl font-bold">
          R{amount}
        </div>
        <Button type="submit" onClick={() => router.push("/postproject")}>
          Redirect
        </Button>

        {/* Show redirecting message and animation */}
        {redirecting && (
          <div className="mt-5 flex flex-col items-center">
            <p className="text-lg font-medium">Redirecting in 5 seconds...</p>
            <div className="mt-3">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-none"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
