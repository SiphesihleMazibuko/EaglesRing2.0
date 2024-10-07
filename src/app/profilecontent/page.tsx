"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import InvestorNavbar from "../investornavbar/page";
import Navbar from "../navbar/page";
import DashboardPage from "../dashboard/page";
import Loader from "@/components/ui/Loader";
import InvestorDashboard from "../investorDashboard/page";
import { Button } from "@/components/ui/button";

interface SubscriptionInfo {
  status: string;
  nextBillingDate: string;
}

export function Profile() {
  const { data: session, update: updateSession } = useSession();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [contractUrl, setContractUrl] = useState<string | null>(null); // New state for PDF URL

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || "");
      setFullName(session.user.name || "");
    }

    const fetchSubscriptionDetails = async () => {
      try {
        const response = await fetch(`/api/subscription-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session?.user?.email }),
        });
        const data = await response.json();
        if (response.ok) {
          setSubscriptionInfo({
            status: data.subscriptionStatus,
            nextBillingDate: new Date(
              data.currentPeriodEnd * 1000
            ).toLocaleDateString(),
          });
        }
      } catch (error) {
        console.error("Error fetching subscription details:", error);
      }
    };

    const fetchContractUrl = async () => {
      try {
        const response = await fetch(`/api/getContractUrl`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session?.user?.email }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch contract URL. Status: ${response.status}`
          );
        }

        const data = await response.json();
        if (data.contractUrl) {
          setContractUrl(data.contractUrl); // Store contract URL
        }
      } catch (error) {
        console.error("Error fetching contract URL:", error);
      }
    };

    if (session?.user?.userType === "Entrepreneur") {
      fetchSubscriptionDetails();
      fetchContractUrl();
    }
  }, [session]);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/updateProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          fullName,
        }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");

        await updateSession({
          user: {
            ...session?.user,
            email: email,
            name: fullName,
          },
        });
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    setCanceling(true);
    try {
      const response = await fetch(`/api/cancel-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("Subscription canceled successfully.");
        setSubscriptionInfo(null);
      } else {
        toast.error("Failed to cancel subscription.");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error("An error occurred while canceling your subscription.");
    } finally {
      setCanceling(false);
    }
  };

  const downloadPDF = () => {
    if (contractUrl) {
      const link = document.createElement("a");
      link.href = contractUrl;
      link.setAttribute("download", "Investment_Contract.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      toast.error("No contract available to download.");
    }
  };

  return (
    <div className="background-container min-h-screen flex-1">
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
                <Label htmlFor="fullName">Full Name</Label>
                <input
                  type="text"
                  id="fullName"
                  className="bg-transparent  border border-gray-300 p-3 rounded-lg font-bold text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <input
                  type="email"
                  id="email"
                  className="bg-transparent border border-gray-300 p-3 rounded-lg font-bold text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="userType">Type</Label>
                <span
                  id="userType"
                  className="bg-input border border-gray-300 p-3 rounded-lg font-bold text-black"
                >
                  {session?.user?.userType || "N/A"}
                </span>
              </div>
            </div>

            {/* Subscription Information */}
            {subscriptionInfo && (
              <div className="card bg-input shadow-xl p-4 w-52">
                <div className="grid gap-2">
                  <Label>Subscription Status</Label>
                  <p className="font-bold">{subscriptionInfo.status}</p>
                  <Label>Next Billing Date</Label>
                  <p className="font-bold">
                    {subscriptionInfo.nextBillingDate}
                  </p>
                  <Button
                    className="btn btn-error font-bold"
                    onClick={cancelSubscription}
                    disabled={canceling}
                  >
                    {canceling ? <Loader /> : "Cancel Subscription"}
                  </Button>
                </div>
              </div>
            )}

            {/* Download Contract Button */}
            {contractUrl && (
              <Button className="btn btn-error font-bold" onClick={downloadPDF}>
                Download Contract
              </Button>
            )}

            <Button
              className="ml-auto font-bold text-sm py-2 px-5 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
              onClick={handleProfileUpdate}
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : "Update Profile"}
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow py-10">
        {session?.user?.userType === "Investor" ? (
          <InvestorDashboard />
        ) : (
          <DashboardPage />
        )}
      </div>
    </div>
  );
}

export default Profile;
