"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "../navbar/page";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import InvestorNavbar from "../investornavbar/page";

export function Profile() {
  const { data: session } = useSession();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  return (
    <div className="background-container min-h-screen">
      {session?.user?.userType === "Investor" ? <InvestorNavbar /> : <Navbar />}
      <ToastContainer />
      <div className="flex flex-col items-center justify-center flex-grow py-10">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="avatar">Avatar</Label>
                <Avatar>
                  {/* Safely accessing the image with a fallback */}
                  <AvatarImage
                    src={session?.user?.avatarImage || "/placeholder-user.jpg"}
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <span
                  id="fullName"
                  className="bg-neutral-50 p-2 rounded font-bold"
                >
                  {session?.user?.name || "No Name Available"}
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <span
                  id="email"
                  className="bg-neutral-50 p-2 rounded font-bold"
                >
                  {session?.user?.email}
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="userType">Type</Label>
                <span
                  id="userType"
                  className="bg-neutral-50 p-2 rounded font-bold"
                >
                  {session?.user?.userType || "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
