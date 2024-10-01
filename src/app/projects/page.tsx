"use client";
import React, { useState, useEffect } from "react";
import InvestorNavbar from "../investornavbar/page";
import Footer from "../footer/page";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";

interface Pitch {
  projectImage: string;
  _id: string;
  entrepreneurId: string;
  companyName: string;
  projectIdea: string;
  pitchVideo: string;
  investmentAmount: string;
  businessPhase: string;
  createdAt: string;
  status: string; // Add the connection status from backend
}

interface PitchState {
  isExpanded: boolean;
  isConnected: boolean;
  status: string; // Track the status (pending, accepted, declined)
}

const Page = () => {
  const { data: session } = useSession();
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [pitchStates, setPitchStates] = useState<{ [key: string]: PitchState }>(
    {}
  );
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("newest");

  useEffect(() => {
    const fetchPitches = async () => {
      const investorId = session?.user?.id;
      try {
        const response = await fetch(`/api/getProject`);
        const data = await response.json();
        setPitches(data);
      } catch (error) {
        console.error("Error fetching pitches:", error);
      }
    };

    fetchPitches();
  }, [session?.user?.id]);

  const toggleReadMore = (id: string) => {
    setPitchStates((prevStates) => ({
      ...prevStates,
      [id]: {
        ...prevStates[id],
        isExpanded: !prevStates[id]?.isExpanded,
      },
    }));
  };

  const handleConnect = async (pitch: Pitch) => {
    try {
      const response = await fetch("/api/connectInvestor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          investorId: session?.user?.id,
          entrepreneurId: pitch.entrepreneurId,
          pitchId: pitch._id,
        }),
      });

      if (response.ok) {
        toast.info("Connection request sent! Waiting for approval.");
        setPitchStates((prevStates) => ({
          ...prevStates,
          [pitch._id]: {
            ...prevStates[pitch._id],
            isConnected: true,
            status: "pending",
          },
        }));
      } else {
        toast.error("Failed to send connection request.");
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const filteredPitches = pitches
    .filter((pitch) => {
      if (!selectedPhase) return true;
      return pitch.businessPhase === selectedPhase;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

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

        <div className="flex justify-between gap-4">
          {/* Filter by Business Phase */}
          <div className="w-1/2">
            <Select onValueChange={(value) => setSelectedPhase(value)}>
              <SelectTrigger
                aria-label="Filter by Business Phase"
                className="bg-card text-card-foreground"
              >
                <SelectValue placeholder="Filter by Business Phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="Initial Phase"
                  className="bg-card text-card-foreground"
                >
                  Initial Phase
                </SelectItem>
                <SelectItem
                  value="Startup Phase"
                  className="bg-card text-card-foreground"
                >
                  Startup Phase
                </SelectItem>
                <SelectItem
                  value="Growth Phase"
                  className="bg-card text-card-foreground"
                >
                  Growth Phase
                </SelectItem>
                <SelectItem
                  value="Maturity Phase"
                  className="bg-card text-card-foreground"
                >
                  Maturity Phase
                </SelectItem>
                <SelectItem
                  value="Expansion Phase"
                  className="bg-card text-card-foreground"
                >
                  Expansion Phase
                </SelectItem>
                <SelectItem
                  value="Decline Phase"
                  className="bg-card text-card-foreground"
                >
                  Decline/Renewal Phase
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort by Date */}
          <div className="w-1/2">
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger aria-label="Sort by Date">
                <SelectValue placeholder="Sort by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="newest"
                  className="bg-card text-card-foreground"
                >
                  Newest
                </SelectItem>
                <SelectItem
                  value="oldest"
                  className="bg-card text-card-foreground"
                >
                  Oldest
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredPitches.length === 0 ? (
          <p>No pitches found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 mt-10">
            {filteredPitches.map((pitch) => {
              const pitchState = pitchStates[pitch._id] || {
                isExpanded: false,
                isConnected: pitch.status !== "pending", // Use status to check if connected
                status: pitch.status || "pending", // Use status from the backend
              };

              const createdAtDate = new Date(
                pitch.createdAt
              ).toLocaleDateString("en-UK", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              });

              return (
                <Card key={pitch._id} className="border-0 shadow-sm">
                  <div
                    tabIndex={0}
                    className={`collapse collapse-arrow bg-input border ${
                      pitchState.isExpanded ? "collapse-open" : ""
                    }`}
                    onClick={() => toggleReadMore(pitch._id)} // Toggle specific pitch collapse
                  >
                    <div className="collapse-title p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* Display pitch image as an icon */}
                          <img
                            src={pitch.projectImage}
                            alt={`${pitch.companyName} logo`}
                            className="w-12 h-12 object-cover rounded-badge"
                          />
                          <div>
                            {/* Company name, business phase, and created date */}
                            <h4 className="text-sm font-medium">
                              {pitch.companyName}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {pitch.businessPhase}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Created on: {createdAtDate}
                            </p>

                            {/* Display the investment amount */}
                            <p className="text-sm text-neutral-950">
                              Amount requested for: R{pitch.investmentAmount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Hidden content: video and project idea */}
                    <div className="collapse-content p-4">
                      <div className="flex flex-col gap-2">
                        <video
                          controls
                          width={400}
                          height={225}
                          className="aspect-video object-cover"
                        >
                          <source src={pitch.pitchVideo} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>

                        <p className="text-sm text-muted-foreground mt-2">
                          {pitch.projectIdea}
                        </p>

                        <Button
                          variant="secondary"
                          size="sm"
                          className={`font-bold text-sm py-2 px-5 mt-4 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out ${
                            pitchState.isConnected
                              ? "bg-gray-400 cursor-not-allowed"
                              : "hover:scale-105 bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
                          }`}
                          onClick={() => handleConnect(pitch)} // Pass the whole pitch object
                          disabled={pitchState.isConnected}
                        >
                          {pitchState.status === "pending"
                            ? "Connect"
                            : pitchState.status === "accepted"
                            ? "Connected"
                            : "Declined"}
                        </Button>
                      </div>
                    </div>
                  </div>
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
