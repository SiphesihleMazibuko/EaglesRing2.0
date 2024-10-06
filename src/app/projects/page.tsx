"use client";
import React, { useState, useEffect } from "react";
import InvestorNavbar from "../investornavbar/page";
import Footer from "../footer/page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Loader from "@/components/ui/Loader";

interface Pitch {
  projectImage: string;
  _id: string;
  entrepreneurId: string;
  entrepreneurEmail: string;
  companyName: string;
  projectIdea: string;
  pitchVideo: string;
  investmentAmount: string;
  businessPhase: string;
  createdAt: string;
}

const Page = () => {
  const { data: session } = useSession();
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [expandedPitchStates, setExpandedPitchStates] = useState<{
    [key: string]: boolean;
  }>({}); // Track expanded states for each pitch
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchPitches = async () => {
      try {
        const response = await fetch("/api/getProject");
        const data = await response.json();
        setPitches(data);
      } catch (error) {
        console.error("Error fetching pitches:", error);
      }
    };

    fetchPitches();
  }, [session?.user?.id]);

  const toggleReadMore = (id: string) => {
    setExpandedPitchStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id], // Toggle the specific pitch state
    }));
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

  const handleInvest = async (
    pitchId: string,
    amount: number,
    entrepreneurEmail: string,
    companyName: string
  ) => {
    try {
      setLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          entrepreneurEmail,
          pitchId,
          companyName,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to the Stripe Checkout URL returned by the API
        window.location.href = data.url;
      } else {
        console.error("No session URL returned from Stripe");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error starting payment:", error);
      setLoading(false);
    }
  };

  return (
    <section className="background-container flex flex-col items-center">
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
              const createdAtDate = new Date(
                pitch.createdAt
              ).toLocaleDateString("en-UK", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              });

              const isExpanded = expandedPitchStates[pitch._id] || false; // Check if the pitch is expanded

              return (
                <Card
                  key={pitch._id}
                  className="border-gray-950 bg-input shadow-sm"
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => toggleReadMore(pitch._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Display pitch image as an icon */}
                        <Image
                          src={pitch.projectImage}
                          alt={`${pitch.companyName} logo`}
                          width={48}
                          height={48}
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
                          <p className="text-xs text-muted-foreground">
                            {pitch.entrepreneurEmail}
                          </p>

                          {/* Display the investment amount */}
                          <p className="text-sm font-semibold text-neutral-950">
                            Amount requested for: R{pitch.investmentAmount}
                          </p>
                        </div>
                      </div>
                      <Button className="text-sm font-semibold text-blue-950 btn btn-outline">
                        {isExpanded ? "Read Less" : "Read More"}
                      </Button>
                    </div>
                  </div>

                  {/* Hidden content: video and project idea */}
                  {isExpanded && (
                    <div className="p-4">
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
                          onClick={() =>
                            handleInvest(
                              pitch._id,
                              parseInt(pitch.investmentAmount),
                              pitch.entrepreneurEmail,
                              pitch.companyName
                            )
                          }
                          disabled={loading}
                          variant="secondary"
                          size="sm"
                          className="font-bold text-sm py-2 px-5 mt-4 rounded-lg cursor-pointer hover:scale-105 bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
                        >
                          {loading ? <Loader /> : "Invest"}
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </section>
  );
};

export default Page;
