"use client";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  fullName: string;
  email: string;
  userType: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export default function Component() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    userType: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [avatarImage, setAvatarImage] = useState("/placeholder-user.jpg");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.userType) newErrors.userType = "User type is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms and conditions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      toast.success("Form submitted successfully!");
    } else {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
    }
  };

  return (
    <div className="flex justify-center py-12 bg-background min-h-screen">
      <ToastContainer />
      <div className="w-full max-w-sm p-8 bg-card rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold text-center text-card-foreground mb-6">
          Registration
        </h1>
        <div className="flex flex-col items-center mb-4">
          <Avatar>
            <AvatarImage src={avatarImage} />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Button variant="secondary" className="mt-2 hover:underline">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              Upload an image
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <UserIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="fullName"
              placeholder="Full Name"
              className="bg-card text-card-foreground pr-8"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="relative">
            <MailIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="email"
              placeholder="Email"
              type="email"
              className="bg-card text-card-foreground pr-8"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <Select
            value={formData.userType}
            onValueChange={(value) =>
              setFormData({ ...formData, userType: value })
            }
          >
            <SelectTrigger id="option" className="bg-card text-card-foreground">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="Entrepreneur"
                className="bg-card text-card-foreground"
              >
                Entrepreneur
              </SelectItem>
              <SelectItem
                value="Investor"
                className="bg-card text-card-foreground"
              >
                Investor
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Input
              name="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="bg-card text-card-foreground pr-8"
              value={formData.password}
              onChange={handleInputChange}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>
          <div className="relative">
            <Input
              name="confirmPassword"
              placeholder="Confirm Password"
              type={showPassword ? "text" : "password"}
              className="bg-card text-card-foreground pr-8"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              name="termsAccepted"
              checked={formData.termsAccepted}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none text-card-foreground"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-info hover:underline">
                Terms & Conditions
              </Link>
            </label>
          </div>
          <Button
            type="submit"
            className="w-full mt-6 transform hover:scale-105 text-black bg-gradient-to-r from-[#917953] to-[#CBAC7C] font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:border-[#917953] border-[#917953]"
          >
            Register
          </Button>
        </form>
        <div className="text-center mt-4">
          <label className="text-sm font-medium leading-none text-card-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-info hover:underline">
              Login
            </Link>
          </label>
        </div>
      </div>
    </div>
  );
}

// Icon components for password visibility toggle
function EyeIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94a10.92 10.92 0 0 0 2.56-2.69C23 12 19 5 12 5c-1.79 0-3.5.46-5 .126" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

function MailIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function UserIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
