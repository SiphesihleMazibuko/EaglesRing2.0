"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Onboarding from "./onboarding/page";
import Services from "./services/page";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check local storage or other means to determine if the user is signed in
    const signedInStatus = localStorage.getItem("isSignedIn") === "true";
    setIsSignedIn(signedInStatus);
  }, []);

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

  const navigateToSignIn = () => {
    // Navigate to the sign-in page
    router.push("/signin");
  };

  const handleSignOut = () => {
    // Implement your sign-out logic here
    localStorage.setItem("isSignedIn", "false");
    setIsSignedIn(false);
    router.push("/");
  };

  return (
    <>
      {showOnboarding ? (
        <Onboarding />
      ) : (
        <>
          {!isSignedIn ? (
            <button onClick={navigateToSignIn}>Sign In</button>
          ) : (
            <>
              <button onClick={handleSignOut}>Sign Out</button>
              <Services />
            </>
          )}
        </>
      )}
    </>
  );
}
