"use client";
import React, { useState } from "react";
import Navbar from "../navbar/page";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PostProject() {
  const [formData, setFormData] = useState({
    companyName: "",
    projectIdea: "",
    image: null,
    video: null,
    businessPhase: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      businessPhase: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.projectIdea ||
      !formData.businessPhase
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const form = new FormData();
    form.append("companyName", formData.companyName);
    form.append("projectIdea", formData.projectIdea);
    form.append("businessPhase", formData.businessPhase);
    if (formData.image) form.append("image", formData.image);
    if (formData.video) form.append("video", formData.video);

    try {
      const response = await fetch("/api/saveProject", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        toast.success("Project posted successfully!");
        setFormData({
          companyName: "",
          projectIdea: "",
          image: null,
          video: null,
          businessPhase: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to post project.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <ToastContainer />
      <div className="container grid items-center justify-center gap-8 px-4 md:px-6">
        <div className="mx-auto grid max-w-3xl gap-6 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mt-10">
              Share Your Project
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed">
              Post your company name, project idea, and media to connect with
              potential partners.
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                placeholder="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="bg-muted text-neutral-950"
                required
              />
              <Input
                placeholder="Project Idea"
                name="projectIdea"
                value={formData.projectIdea}
                onChange={handleChange}
                className="bg-muted text-neutral-950"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label
                  htmlFor="image"
                  className="hover:underline cursor-pointer"
                >
                  Upload Image
                </Label>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="video"
                  className="hover:underline cursor-pointer"
                >
                  Upload Video
                </Label>
                <Input
                  type="file"
                  id="video"
                  name="video"
                  accept="video/*"
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
          <div>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent side="bottom" sideOffset={5}>
                <SelectGroup>
                  <SelectItem value="initial">Initial Phase</SelectItem>
                  <SelectItem value="startup">Startup Phase</SelectItem>
                  <SelectItem value="growth">Growth Phase</SelectItem>
                  <SelectItem value="maturity">Maturity Phase</SelectItem>
                  <SelectItem value="expansion">Expansion Phase</SelectItem>
                  <SelectItem value="decline">Decline/Renewal Phase</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="ml-auto font-bold text-sm py-2 px-5 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PostProject;
