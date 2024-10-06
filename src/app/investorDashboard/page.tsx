"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/Spinner";
import { MessageSquare } from "lucide-react";
import React, { useState, useEffect } from "react";

interface InvestorDashboardProps {
  customerId: string;
}

const InvestorDashboard: React.FC<InvestorDashboardProps> = ({
  customerId,
}) => {
  const [loading, setLoading] = useState(true);
  const [investmentCount, setInvestmentCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Customer ID:", customerId); // Verify if customerId is being passed
    const fetchInvestmentCount = async () => {
      try {
        const response = await fetch(
          `/api/investments?customerId=${customerId}`
        );
        const data = await response.json();

        if (response.ok) {
          setInvestmentCount(data.count);
        } else {
          setError(data.error || "Something went wrong");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Safely access the error message
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentCount();
  }, [customerId]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Number of Investments
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Spinner /> : error ? error : investmentCount}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorDashboard;
