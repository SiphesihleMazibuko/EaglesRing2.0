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
    return <div>Loading...</div>; // Show a loading state while fetching data
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
              Number of Connections
            </CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pitch and Investment Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <LineChartComponent />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Connections</CardTitle>
            <CardDescription>
              You&apos;ve made 65 new connections this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentConnections />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
function LineChartComponent() {
  return (
    <div className="h-[200px] w-full">
      <svg className="w-full h-full">
        <line
          x1="0"
          y1="200"
          x2="400"
          y2="200"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="200"
          stroke="currentColor"
          strokeWidth="2"
        />
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points="0,180 100,150 200,100 300,60 400,20"
        />
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          points="0,190 100,170 200,130 300,80 400,40"
        />
      </svg>
      <div className="flex justify-center mt-2 text-sm text-muted-foreground">
        <span className="mr-4">
          <span className="inline-block w-3 h-3 mr-1 bg-blue-500 rounded-full"></span>
          Pitches
        </span>
        <span>
          <span className="inline-block w-3 h-3 mr-1 bg-green-500 rounded-full"></span>
          Investments
        </span>
      </div>
    </div>
  );
}
function RecentConnections() {
  return (
    <div className="space-y-8">
      {[
        { name: "Sarah Johnson", company: "Tech Innovators Inc.", role: "CEO" },
        {
          name: "Michael Chang",
          company: "Venture Capital Partners",
          role: "Investment Manager",
        },
        {
          name: "Emily Rodriguez",
          company: "Global Accelerator",
          role: "Program Director",
        },
        {
          name: "David Patel",
          company: "Future Fund",
          role: "Managing Partner",
        },
        {
          name: "Lisa Thompson",
          company: "Startup Ecosystem",
          role: "Community Manager",
        },
      ].map((connection, index) => (
        <div key={index} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {connection.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {connection.company}
            </p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {connection.role}
          </div>
        </div>
      ))}
    </div>
  );
}
export default DashboardPage;
