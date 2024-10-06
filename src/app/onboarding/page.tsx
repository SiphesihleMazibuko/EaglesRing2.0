"use client";
import Image from "next/image";
import Link from "next/link";
import Eagle from "@/assets/EaglesRingLogo.png";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Onboarding = () => {
  const router = useRouter();

  const handleSignup = () => {
    router.push("/signin");
  };
  return (
    <div className="flex flex-col min-h-[100dvh] background-container">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Image
          src={Eagle}
          alt="logo"
          width={96}
          height={96}
          className="w-24 h-24 cursor-pointer mb-5"
        />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-black text-s font-medium hover:underline underline-offset-4"
            href="/features"
          >
            Features
          </Link>
          <Link
            className="text-black text-s font-medium hover:underline underline-offset-4"
            href="/pricing"
          >
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32 border-t">
          <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-black lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                    Streamline Your Business with Eagles Ring
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-950">
                    Discover how our innovative solutions can transform your
                    business and unlock new opportunities.
                  </p>
                </div>
                <div className="space-x-4 py-4">
                  <Button
                    className="inline-flex h-9 items-center justify-center transform hover:scale-105 text-black bg-gradient-to-r from-[#917953] to-[#CBAC7C] font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:border-[#917953] border-[#917953]"
                    onClick={handleSignup}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-[1000px] aspect-[4/3] relative">
                  <Image
                    alt="Animated Graphic"
                    className="pb-10"
                    src="/man.jpg"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-s text-gray-950">
          © 2024 Eagles Ring. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-s text-gray-950 hover:underline underline-offset-4"
            href="/terms"
          >
            Terms of Service
          </Link>
          <Link
            className="text-s text-gray-950 hover:underline underline-offset-4"
            href="/privacypolicy"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Onboarding;
