"use client";
import React, { useState, useEffect } from "react";
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
import { useUser } from "@/lib/UserContext";

interface Project {
  _id: string;
  companyName: string;
  projectIdea: string;
  businessPhase: string;
  pitchVideo: string | null;
  projectImage: string | null;
  createdAt: string;
}

function PostProject() {
  const { user } = useUser();
  const email = user?.email;

  const [formData, setFormData] = useState({
    companyName: "",
    projectIdea: "",
    image: null,
    video: null,
    businessPhase: "",
  });

  const [userProjects, setUserProjects] = useState<Project[]>([]);

  // Fetch user's previously posted projects on page load
  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!email) return;

      try {
        const response = await fetch(`/api/getUserProject?email=${email}`);
        const data = await response.json();
        setUserProjects(data);
      } catch (error) {
        console.error("Error fetching user projects:", error);
      }
    };

    fetchUserProjects();
  }, [email]);

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

    try {
      const payload = {
        email,
        companyName: formData.companyName,
        projectIdea: formData.projectIdea,
        businessPhase: formData.businessPhase,
        image: formData.image ? URL.createObjectURL(formData.image) : null,
        video: formData.video ? URL.createObjectURL(formData.video) : null,
      };

      const response = await fetch("/api/saveProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

        const updatedProjects = await response.json();
        setUserProjects((prevProjects) => [...prevProjects, updatedProjects]);
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

            <div>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent side="bottom" sideOffset={5}>
                  <SelectGroup>
                    <SelectItem value="Initial Phase">Initial Phase</SelectItem>
                    <SelectItem value="Startup Phase">Startup Phase</SelectItem>
                    <SelectItem value="Growth Phase">Growth Phase</SelectItem>
                    <SelectItem value="Maturity Phase">
                      Maturity Phase
                    </SelectItem>
                    <SelectItem value="Expansion Phase">
                      Expansion Phase
                    </SelectItem>
                    <SelectItem value="Decline Phase">
                      Decline/Renewal Phase
                    </SelectItem>
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
          </form>

          {/* Display user's posted projects */}
          <div className="mt-10">
            <h3 className="text-2xl font-semibold">Your Posted Projects</h3>
            {userProjects.length === 0 ? (
              <p>You haven&apos;t posted any projects yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {userProjects.map((project) => (
                  <div key={project._id} className="border p-4 rounded-lg">
                    <h4 className="text-lg font-bold">{project.companyName}</h4>
                    <p className="text-sm">{project.projectIdea}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {project.pitchVideo && (
                      <video controls className="mt-2" width="100%">
                        <source src={project.pitchVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {project.projectImage && (
                      <img
                        src={project.projectImage}
                        alt={`${project.companyName} Image`}
                        className="mt-2 w-full h-40 object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostProject;
