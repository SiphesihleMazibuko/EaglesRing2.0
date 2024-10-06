"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession, signIn, signOut } from "next-auth/react"; // Import session functions
import InvestorNavbar from "../investornavbar/page";
import Navbar from "../navbar/page";
import DashboardPage from "../dashboard/page";
import Loader from "@/components/ui/Loader";
import InvestorDashboard from "../investorDashboard/page";

interface Notification {
  _id: string;
  investorId: {
    fullName: string;
  };
  pitchId: {
    companyName: string;
  } | null;
  status: string;
  createdAt: string;
}

interface SubscriptionInfo {
  status: string;
  nextBillingDate: string;
}

export function Profile() {
  const { data: session, update: updateSession } = useSession();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || "");
      setFullName(session.user.name || "");
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `/api/getNotifications?entrepreneurId=${session?.user?.id}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

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

    if (session?.user?.userType === "Entrepreneur") {
      fetchNotifications();
      fetchSubscriptionDetails();
    }
  }, [session]);

  const handleResponse = async (notificationId: string, status: string) => {
    try {
      const response = await fetch(`/api/updateNotificationStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
          status,
        }),
      });

      if (response.ok) {
        toast.success(`Notification ${status}!`);
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, status }
              : notification
          )
        );
      } else {
        toast.error("Failed to update notification.");
      }
    } catch (error) {
      console.error("Error updating notification:", error);
      toast.error("An error occurred.");
    }
  };

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

        // Update session with new email and full name
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
        setSubscriptionInfo(null); // Clear subscription info
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

  const customerId = session?.user?.stripeCustomerId || ""; // Fallback to an empty string

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
              <div
                className="card bg-input shadow-xl p-4 w-52
              "
              >
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

            <Button
              variant="default"
              className="ml-auto font-bold text-sm py-2 px-5 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
              onClick={handleProfileUpdate}
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : "Update Profile"}
            </Button>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <h3 className="text-lg font-bold">Notifications</h3>
              {notifications.length === 0 ? (
                <p>No notifications available.</p>
              ) : (
                <ul className="list-disc pl-5">
                  {notifications.map((notification) => (
                    <li key={notification._id} className="py-1">
                      {notification?.investorId?.fullName} wants to connect to
                      view your pitch &quot;
                      {notification?.pitchId?.companyName || "Unknown Pitch"}
                      &quot;. Status:{" "}
                      <span className="font-bold text-accent">
                        {notification.status}
                      </span>
                      <div className="mt-2">
                        {notification.status === "pending" && (
                          <>
                            <Button
                              variant="default"
                              className="mr-2"
                              onClick={() =>
                                handleResponse(notification._id, "accepted")
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleResponse(notification._id, "declined")
                              }
                            >
                              Decline
                            </Button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow py-10">
        {session?.user?.userType === "Investor" ? (
          <InvestorDashboard customerId={customerId} />
        ) : (
          <DashboardPage />
        )}
      </div>
    </div>
  );
}

export default Profile;
