"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../navbar/page";
import { Button } from "@/components/ui/button";
import InvestorNavbar from "../investornavbar/page";
import Loader from "@/components/ui/Loader";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const ContactPage = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
      } else {
        toast.error("Failed to send message");
        console.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="background-container min-h-screen">
      {session?.user?.userType === "Investor" ? <InvestorNavbar /> : <Navbar />}
      <div className="flex items-center justify-center min-h-screen p-4">
        <ToastContainer />
        <div className="w-full max-w-4xl p-8 rounded-lg shadow-lg text-white">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">
            Contact Us
          </h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-black p-6 rounded-lg flex items-center justify-center border-solid border-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h2m0-6a2 2 0 012 2v6m0 0h4m0-6a2 2 0 012 2v6m0 0h4"
                  />
                </svg>
              </div>
              <p className="mt-4 text-black">icrdgroup@gmail.com</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="p-3 rounded bg-neutral-50 border-solid border-2 border-yellow-700 text-black"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="p-3 rounded bg-neutral-50 border-solid border-2 border-yellow-700 text-black"
                />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="p-3 rounded bg-neutral-50 border-solid border-2 border-yellow-700 text-black"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Message"
                className="p-3 rounded bg-neutral-50 border-solid border-2 border-yellow-700 text-black"
                rows={4}
              ></textarea>
              <Button
                type="submit"
                disabled={isSending}
                className="text-white font-bold text-sm py-2 px-8 rounded cursor-pointer transition-all ease-in-out duration-300 hover:text-[#917953] hover:bg-black hover:outline-[#917953] outline-none bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
              >
                {isSending ? <Loader /> : "Send"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
