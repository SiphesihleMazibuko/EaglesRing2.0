"use client"
import { ToastContainer, toast } from "react-toastify";
import {useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (validate()) {
      toast.success("Login successful!");
      router.push('/services')
    } else {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
    }
  };
  const handleLogin = () =>{

  }

  return (
    <div className="flex justify-center py-12 bg-background min-h-screen">
      <ToastContainer />
      <div className="w-full max-w-sm p-8 bg-card rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold text-center text-card-foreground mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>
          <Button  onClick={handleLogin} type="submit" className="w-full mt-6 transform hover:scale-105 text-black bg-gradient-to-r from-[#917953] to-[#CBAC7C] font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:border-[#917953] border-[#917953]">Login</Button>
        </form>
        <div className="text-center mt-4">
          <label className="text-sm font-medium leading-none text-card-foreground">
            Don&apos;t have an account? <Link href="/signup" className="text-info hover:underline">Register</Link>
          </label>
        </div>
      </div>
    </div>
  );
}

function MailIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
  )
}

function EyeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
  )
}

function EyeOffIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
  )
}
