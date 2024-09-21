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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import InvestorNavbar from "../investornavbar/page";
import Navbar from "../navbar/page";
import DashboardPage from "../dashboard/page";

interface Notification {
  _id: string;
  investorId: {
    fullName: string;
  };
  pitchId: {
    companyName: string;
  } | null; // Allow null or undefined pitchId
  status: string;
  createdAt: string;
}

export function Profile() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
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

    if (session?.user?.userType === "Entrepreneur") {
      fetchNotifications();
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
        <DashboardPage />
      </div>
    </div>
  );
}

export default Profile;
