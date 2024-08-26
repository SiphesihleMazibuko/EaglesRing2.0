"use client";
import React, { useState } from "react";
import InvestorNavbar from "../investornavbar/page";
import Footer from "../footer/page";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Business1 from "@/assets/Business1.png";
import Image1 from "@/assets/wallpaperflare.com_wallpaper.jpg";

const Page = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleConnect = () => {
    toast.info("Connection request sent! Waiting for approval.");
    setIsConnected(true);
  };

  return (
    <section className="background-container flex flex-col items-center ">
      <div className="w-full bg-neutral-50">
        <InvestorNavbar />
      </div>
      <div className="container grid gap-10 px-4 md:px-6">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mt-10">
            Explore Project Ideas
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Browse through the latest project ideas from entrepreneurs and
            startups.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <Image
                src={Image1}
                width={400}
                height={225}
                alt="Project Image"
                className="aspect-video object-cover"
              />
            </CardContent>
            <CardFooter className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <h4 className="text-sm font-medium">TechInvaders</h4>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className={`font-bold text-sm py-2 px-5 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out ${
                      isConnected
                        ? "bg-gray-400 cursor-not-allowed"
                        : "hover:scale-105 bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
                    }`}
                    onClick={handleConnect}
                    disabled={isConnected}
                  >
                    {isConnected ? "Pending Approval" : "Connect"}
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Building web applications for companies
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 mt-1 text-sm font-semibold text-blue-500 hover:underline"
                    onClick={toggleReadMore}
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <Image
                src={Business1}
                width={400}
                height={225}
                alt="Project Image"
                className="aspect-video object-cover"
              />
            </CardContent>
            <CardFooter className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <h4 className="text-sm font-medium">Company 1</h4>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className={`font-bold text-sm py-2 px-5 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out ${
                      isConnected
                        ? "bg-gray-400 cursor-not-allowed"
                        : "hover:scale-105 bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
                    }`}
                    onClick={handleConnect}
                    disabled={isConnected}
                  >
                    {isConnected ? "Pending Approval" : "Connect"}
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isExpanded
                      ? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus est at ipsum reiciendis consectetur ad, cumque, ea id magnam placeat velit exercitationem in nisi sunt similique aut delectus quo maxime!"
                      : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus est at ipsum reiciendis consectetur ad, cumque, ea id magnam placeat velit exercitationem in nisi sunt similique aut delectus quo maxime!".slice(
                          0,
                          100
                        ) + "..."}
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 mt-1 text-sm font-semibold text-blue-500 hover:underline"
                    onClick={toggleReadMore}
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </section>
  );
};

export default Page;
