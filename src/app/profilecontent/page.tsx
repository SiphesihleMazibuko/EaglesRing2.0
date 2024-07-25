"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "../navbar/page";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Profile() {
  const { user, isLoaded } = useUser(); 
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [id, setId] = useState("");
  const [company, setCompany] = useState("");
  const [tax, setTax] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (isLoaded && user && user.primaryEmailAddress) { 
      setEmail(user.primaryEmailAddress.emailAddress);
      setName(user.firstName || "");
      setSurname(user.lastName || "");
    }
  }, [isLoaded, user]);

  const handleSaveChanges = () => {
    let valid = true;

    if (!email.includes("@")) {
      toast.error("Invalid email address");
      valid = false;
    }
    if (!name.trim()) {
      toast.error("First Name is required");
      valid = false;
    }
    if (!surname.trim()) {
      toast.error("Last Name is required");
      valid = false;
    }
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
      console.log({ email, name, surname, id, company, tax, file });
      toast.success("Profile updated successfully!");
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

  if (!isLoaded) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="background-container min-h-screen">
      <Navbar />
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
                  <AvatarImage src={user ? user.profileImageUrl : "/placeholder-user.jpg"} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">First Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-neutral-50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="surname">Last Name</Label>
                <Input
                  id="surname"
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="bg-neutral-50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-neutral-50"
                />
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
                  <Input id="documents" type="file" onChange={(e) => setFile(e.target.files[0])} />
                  <Button onClick={handleFileUpload} className="hover:underline">Upload</Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end">
              <Button onClick={handleSaveChanges} className="hidden md:block text-white font-bold text-sm py-2 px-8 rounded cursor-pointer transition-all ease-in-out duration-300 hover:text-[#917953] hover:bg-black hover:outline-[#917953] outline-none bg-gradient-to-r from-[#917953] to-[#CBAC7C]">Save Changes</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
