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
  const [id, setId] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [tax, setTax] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleSaveChanges = async () => {
    let valid = true;

    if (!id.match(/^\d{13}$/)) {
      toast.error("ID Number must be exactly 13 numeric characters");
      valid = false;
    }
    if (company.trim() === "") {
      toast.error("Company Name is required");
      valid = false;
    }
    if (!tax.match(/^\d{13}$/)) {
      toast.error("Tax Number must be exactly 13 numeric characters");
      valid = false;
    }
    if (!file) {
      toast.error("Document upload is required");
      valid = false;
    }

    if (valid) {
      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("id", id);
        formData.append("company", company);
        formData.append("tax", tax);
        if (file) {
          formData.append("file", file); // Only append if file is not null
        }

        const response = await fetch("/api/updateProfile", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Profile updated successfully!");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to update profile");
      }
    }
  };

  const handleFileUpload = () => {
    let valid = true;

    if (!file) {
      toast.error("Documents required");
      valid = false;
    }

    if (valid) {
      console.log(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="background-container min-h-screen">
      {session?.user?.userType === "Investor" ? <InvestorNavbar /> : <Navbar />}
      <ToastContainer />
      <div className="flex flex-col items-center justify-center flex-grow py-10">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your company information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="avatar">Avatar</Label>
                <Avatar>
                  <AvatarImage
                    src={session?.user?.image || "/placeholder-user.jpg"}
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
                  {session?.user?.name}
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
                  {session?.user?.userType}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="id">ID Number</Label>
                <Input
                  id="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="bg-neutral-50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-neutral-50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="tax">Tax Number</Label>
                <Input
                  id="tax"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  className="bg-neutral-50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="documents">Upload Documents</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="documents"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <Button
                    onClick={handleFileUpload}
                    className="hover:underline"
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end">
              <Button
                onClick={handleSaveChanges}
                className="text-white font-bold text-sm py-2 px-8 rounded cursor-pointer transition-all ease-in-out duration-300 hover:text-[#917953] hover:bg-black hover:outline-[#917953] outline-none bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
              >
                Save Changes
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
