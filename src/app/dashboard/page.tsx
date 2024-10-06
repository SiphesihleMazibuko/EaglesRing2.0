"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, MessageSquare, Link } from "lucide-react";
import { toast } from "react-toastify";
import Spinner from "@/components/ui/Spinner";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    numberOfPitches: 0,
    numberOfConnectios: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboardData");
        const data = await response.json();

        if (response.ok) {
          setDashboardData(data);
        } else {
          setError(data.message || "Error fetching data");
        }
      } catch (error) {
        toast.error("Error fetching dashboard data");
        setError("Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Spinner />; // Show a loading state while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if API call fails
  }
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Number of Pitches
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.numberOfPitches}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Investments Earned
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R 0</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
