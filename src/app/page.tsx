"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import Onboarding from "./onboarding/page";
import { useAuth, useUser, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Services from "./services/page";

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleGetStartedClick = () => {
    setShowOnboarding(false);
  };
  
  useEffect(() => {
    if (isSignedIn) {
      setShowOnboarding(false);
    }
  }, [isSignedIn]);
  
  useEffect(() => {
    if (!isSignedIn && !showOnboarding) {
      setShowOnboarding(true);
      router.push("/");
    }
  }, [isSignedIn, showOnboarding, router]);
  
  return (
    <>
      {showOnboarding ? (
        <Onboarding onGetStartedClick={handleGetStartedClick} />
      ) : (
        <>
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <Services />
          </SignedIn>
        </>
      )}
    </>
  );
  
}
