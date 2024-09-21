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
import { useRouter } from "next/navigation";

export default function Component() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tax, setTax] = useState("");
  const [company, setCompany] = useState("");
  const [idnum, setIdnum] = useState("");
  const [idType, setIdType] = useState("ID");
  const [errors, setErrors] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStrengthLabel, setPasswordStrengthLabel] = useState("");
  const [avatarImage, setAvatarImage] = useState("/placeholder-user.jpg");
  const router = useRouter();

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

  const handlePasswordStrength = (password: any) => {
    let strength = 0;

    if (password.length > 0) strength++;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    setPasswordStrength(strength);

    switch (strength) {
      case 1:
        setPasswordStrengthLabel("Very Weak");
        break;
      case 2:
        setPasswordStrengthLabel("Weak");
        break;
      case 3:
        setPasswordStrengthLabel("Strong");
        break;
      case 4:
      case 5:
        setPasswordStrengthLabel("Very Strong");
        break;
      default:
        setPasswordStrengthLabel("");
    }
  };

  const handlePasswordChange = (e: { target: { value: any } }) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    handlePasswordStrength(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !userType ||
      !tax ||
      !company ||
      !idnum
    ) {
      setErrors("All fields are required");
      toast.error("All fields are required");
      return;
    }
    if (!termsAccepted) {
      setErrors("You must agree to the terms and conditions");
      toast.error("You must agree to the terms and conditions");
      return;
    }

    if (password !== confirmPassword) {
      setErrors("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (tax.length !== 13) {
      setErrors("Tax number must be 13 digits");
      toast.error("Tax number must be 13 digits");
      return;
    }

    if (idType === "ID" && (idnum.length !== 13 || isNaN(Number(idnum)))) {
      setErrors("ID number must be 13 digits");
      toast.error("ID number must be 13 digits");
      return;
    }

    if (idType === "Passport" && !/^[a-zA-Z0-9]{5,10}$/.test(idnum)) {
      setErrors("Passport number must be 5 to 10 alphanumeric characters");
      toast.error("Passport number must be valid");
      return;
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
          avatarImage,
          tax,
          company,
          idnum,
          idType,
        }),
      });

      if (res.ok) {
        setAvatarImage("/placeholder-user.jpg");
        setFullName("");
        setEmail("");
        setUserType("");
        setPassword("");
        setConfirmPassword("");
        setTax("");
        setCompany("");
        setIdnum("");
        setTermsAccepted(false);
        toast.success("Registration successful");
        router.push("/signin");
      } else {
        const data = await res.json();
        toast.error(data.message || "User registration failed");
      }
    } catch (error) {
      console.log("Error during registration", error);
      toast.error("Error during registration");
    }
  };

  return (
    <div className="flex justify-center py-12 bg-background min-h-screen">
      <ToastContainer />
      <div className="w-full max-w-sm p-8 bg-card rounded-lg shadow-lg border border-border flex flex-col space-y-4">
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
          <div className="relative">
            <MailIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="tax"
              placeholder="Tax number"
              type="text"
              className="bg-card text-card-foreground pr-8"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
            />
          </div>
          <div className="relative">
            <MailIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="company"
              placeholder="Company Name"
              type="text"
              className="bg-card text-card-foreground pr-8"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          {/* ID or Passport Type Selector */}
          <Select value={idType} onValueChange={(value) => setIdType(value)}>
            <SelectTrigger id="idType" className="bg-card text-card-foreground">
              <SelectValue placeholder="Select ID or Passport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ID">ID Number</SelectItem>
              <SelectItem value="Passport">Passport Number</SelectItem>
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

          {/* Password Input */}
          <div className="relative">
            <Input
              name="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="bg-card text-card-foreground pr-8"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>

          {/* Password strength bar */}
          <div className="relative h-2 w-full bg-gray-300 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                passwordStrength === 1
                  ? "bg-warning w-1/4"
                  : passwordStrength === 2
                  ? "bg-yellow-400 w-1/2"
                  : passwordStrength === 3
                  ? "bg-info w-3/4"
                  : passwordStrength >= 4
                  ? "bg-success w-full"
                  : "w-0"
              }`}
            />
          </div>
          <p className="mt-2 text-center text-sm font-medium text-gray-600">
            {passwordStrengthLabel}
          </p>

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
