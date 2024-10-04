"use client";
import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { Label } from "@radix-ui/react-label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Component() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mentorFullName, setmentorFullName] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [idnum, setIdnum] = useState("");
  const [idType, setIdType] = useState("ID");
  const [errors, setErrors] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.match(/(?=.*[0-9].*[0-9])/)) strength += 25;
    if (pass.match(/(?=.*[!@#$%^&*])/)) strength += 25;
    if (pass.match(/(?=.*[a-z])(?=.*[A-Z])/)) strength += 25;
    return strength;
  };

  const passwordRequirements = [
    {
      label: "At least 8 characters long",
      check: (pass: string) => pass.length >= 8,
    },
    {
      label: "Contains at least 2 numbers",
      check: (pass: string) => (pass.match(/\d/g) || []).length >= 2,
    },
    {
      label: "Contains at least 1 special character",
      check: (pass: string) => /[!@#$%^&*]/.test(pass),
    },
    {
      label: "Contains uppercase and lowercase letters",
      check: (pass: string) => /(?=.*[a-z])(?=.*[A-Z])/.test(pass),
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !userType ||
      !idnum
    ) {
      setErrors("All fields are required");
      toast.error("All fields are required");
      setLoading(false);
      return;
    }
    if (!termsAccepted) {
      setErrors("You must agree to the terms and conditions");
      toast.error("You must agree to the terms and conditions");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrors("Passwords do not match");
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (idType === "ID" && (idnum.length !== 13 || isNaN(Number(idnum)))) {
      setErrors("ID number must be 13 digits");
      toast.error("ID number must be 13 digits");
      setLoading(false);
      return;
    }

    if (idType === "Passport" && !/^[a-zA-Z0-9]{5,10}$/.test(idnum)) {
      setErrors("Passport number must be 5 to 10 alphanumeric characters");
      toast.error("Passport number must be valid");
      setLoading(false);
      return;
    }
    if (userType === "Investor") {
      if (!mentorFullName || !mentorEmail) {
        setErrors("Mentor Details Required");
        toast.error("Mentor Details Required");
        setLoading(false);
        return;
      }
    }

    try {
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setErrors("Email already exists.");
        toast.error("Email already exists.");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          userType,
          password,
          idnum,
          idType,
          ...(userType === "Investor" && { mentorFullName, mentorEmail }),
        }),
      });

      if (res.ok) {
        setFullName("");
        setEmail("");
        setUserType("");
        setPassword("");
        setConfirmPassword("");
        setIdnum("");
        setMentorEmail("");
        setmentorFullName("");
        setTermsAccepted(false);
        toast.success("Registration successful");
        console.log({
          fullName,
          email,
          userType,
          password,
          idnum,
          idType,
          mentorFullName,
          mentorEmail,
        });

        router.push("/signin");
      } else {
        const data = await res.json();
        toast.error(data.message || "User registration failed");
        setLoading(false);
      }
    } catch (error) {
      console.log("Error during registration", error);
      toast.error("Error during registration");
      setLoading(false);
    }
  };

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  return (
    <div className="flex justify-center py-12 bg-background min-h-screen">
      <ToastContainer />
      <div className="w-full max-w-sm p-8 bg-card rounded-lg shadow-lg border border-border flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-center text-card-foreground mb-6">
          Registration
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <div className="relative">
            <UserIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="fullName"
              placeholder="Full Name"
              className="bg-card text-card-foreground pr-8"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="relative">
            <MailIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="email"
              placeholder="Email"
              type="email"
              className="bg-card text-card-foreground pr-8"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* ID or Passport Type Selector */}
          <Select value={idType} onValueChange={(value) => setIdType(value)}>
            <SelectTrigger id="idType" className="bg-card text-card-foreground">
              <SelectValue placeholder="Select ID or Passport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ID" className="bg-card text-card-foreground">
                ID Number
              </SelectItem>
              <SelectItem
                value="Passport"
                className="bg-card text-card-foreground"
              >
                Passport Number
              </SelectItem>
            </SelectContent>
          </Select>

          {/* ID or Passport Input */}
          <div className="relative">
            <UserIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="id"
              placeholder={idType === "ID" ? "ID number" : "Passport number"}
              type="text"
              className="bg-card text-card-foreground pr-8"
              value={idnum}
              onChange={(e) => setIdnum(e.target.value)}
            />
          </div>

          <Select
            value={userType}
            onValueChange={(value) => setUserType(value)}
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
          {userType === "Investor" && (
            <>
              <div className="space-y-2">
                <div className="relative">
                  <UserIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="mentorFullName"
                    placeholder=" Mentor Full Name (Required)"
                    className="pl-10"
                    required
                    value={mentorFullName}
                    onChange={(e) => setmentorFullName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <MailIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="mentorEmail"
                    type="email"
                    placeholder="Mentor Email (Required)"
                    className="pl-10"
                    value={mentorEmail}
                    onChange={(e) => setMentorEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}
          {/* Password Input */}
          <div className="relative">
            <Input
              name="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="bg-card text-card-foreground pr-8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>
          <Progress value={passwordStrength} className="w-full" />

          {/* Password strength bar */}
          <div className="space-y-1 mt-2">
            {passwordRequirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-2">
                {req.check(password) ? (
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <span
                  className={`text-sm ${
                    req.check(password) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {req.label}
                </span>
              </div>
            ))}
          </div>
          {passwordStrength < 100 && (
            <p className="text-sm text-destructive">
              {passwordStrength === 0 && "Very Weak"}
              {passwordStrength === 25 && "Weak"}
              {passwordStrength === 50 && "Medium"}
              {passwordStrength === 75 && "Strong"}
            </p>
          )}
          {passwordStrength === 100 && (
            <p className="text-sm text-accent">Very Strong</p>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <Input
              name="confirmPassword"
              placeholder="Confirm Password"
              type={showPassword ? "text" : "password"}
              className="bg-card text-card-foreground pr-8"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              name="termsAccepted"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
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
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="sr-only">Loading...</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader />
                </span>
              </>
            ) : (
              "Register"
            )}
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
