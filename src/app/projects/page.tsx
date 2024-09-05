"use client";
import React, { useState, useEffect } from "react";
import InvestorNavbar from "../investornavbar/page";
import Footer from "../footer/page";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Pitch {
  _id: string;
  companyName: string;
  projectIdea: string;
  pitchVideo: string;
  businessPhase: string;
  createdAt: string;
}

interface PitchState {
  isExpanded: boolean;
  isConnected: boolean;
}

const Page = () => {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [pitchStates, setPitchStates] = useState<{ [key: string]: PitchState }>(
    {}
  );

  useEffect(() => {
    const fetchPitches = async () => {
      try {
        const response = await fetch("/api/getProject");
        const data = await response.json();
        console.log("Fetched Pitches in Frontend:", data);
        setPitches(data);
      } catch (error) {
        console.error("Error fetching pitches:", error);
      }
    };

    fetchPitches();
  }, []);

  const toggleReadMore = (id: string) => {
    setPitchStates((prevStates) => ({
      ...prevStates,
      [id]: {
        ...prevStates[id],
        isExpanded: !prevStates[id]?.isExpanded,
      },
    }));
  };

  const handleConnect = (id: string) => {
    toast.info("Connection request sent! Waiting for approval.");
    setPitchStates((prevStates) => ({
      ...prevStates,
      [id]: {
        ...prevStates[id],
        isConnected: true,
      },
    }));
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
        {pitches.length === 0 ? (
          <p>No pitches found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {pitches.map((pitch) => {
              const pitchState = pitchStates[pitch._id] || {
                isExpanded: false,
                isConnected: false,
              };

              const createdAtDate = new Date(
                pitch.createdAt
              ).toLocaleDateString("en-UK", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <Card key={pitch._id} className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <video
                      controls
                      width={400}
                      height={225}
                      className="aspect-video object-cover"
                    >
                      <source src={pitch.pitchVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </CardContent>
                  <CardFooter className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div>
                            <h4 className="text-sm font-medium">
                              {pitch.companyName}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {pitch.businessPhase}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Created on: {createdAtDate}{" "}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className={`font-bold text-sm py-2 px-5 ml-10 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out ${
                            pitchState.isConnected
                              ? "bg-gray-400 cursor-not-allowed"
                              : "hover:scale-105 bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
                          }`}
                          onClick={() => handleConnect(pitch._id)}
                          disabled={pitchState.isConnected}
                        >
                          {pitchState.isConnected
                            ? "Pending Approval"
                            : "Connect"}
                        </Button>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {pitchState.isExpanded
                            ? pitch.projectIdea
                            : `${pitch.projectIdea.slice(0, 100)}...`}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 mt-1 text-sm font-semibold text-blue-500 hover:underline"
                          onClick={() => toggleReadMore(pitch._id)}
                        >
                          {pitchState.isExpanded ? "Read Less" : "Read More"}
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </section>
  );
};

export default Page;
