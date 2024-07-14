"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "../navbar/page";

export function Profile() {
  const [email, setEmail] = useState("johndoe@gmail.com");
  const [id, setId] = useState("123456789");
  const [company, setCompany] = useState("Acme Inc");
  const [tax, setTax] = useState("987654321");
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!email.includes("@")) newErrors.email = "Invalid email address";
    if (!id.match(/^\d+$/)) newErrors.id = "ID Number must be numeric";
    if (company.trim() === "") newErrors.company = "Company Name is required";
    if (!tax.match(/^\d+$/)) newErrors.tax = "Tax Number must be numeric";
    if (!file) newErrors.file = "Document upload is required";
    return newErrors;
  };

  const handleSaveChanges = () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log({ email, id, company, tax, file });
    }
  };

  return (
    <div className="background-container min-h-screen">
      <Navbar />
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
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
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
                {errors.email && <p className="text-red-500">{errors.email}</p>}
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
                {errors.id && <p className="text-red-500">{errors.id}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-neutral-50"
                />
                {errors.company && <p className="text-red-500">{errors.company}</p>}
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
                {errors.tax && <p className="text-red-500">{errors.tax}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="documents">Upload Documents</Label>
                <div className="flex items-center gap-2">
                  <Input id="documents" type="file" onChange={(e) => setFile(e.target.files[0])} />
                  <Button onClick={handleSaveChanges}>Upload</Button>
                </div>
                {errors.file && <p className="text-red-500">{errors.file}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end">
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
