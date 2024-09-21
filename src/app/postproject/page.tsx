"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/page";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/lib/UserContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: "",
    projectIdea: "",
    image: null,
    video: null,
    businessPhase: "",
  });

  const [userProjects, setUserProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (email) {
        try {
          const response = await fetch(`/api/getEntrepreneurProject`);
          const data = await response.json();
          if (response.ok) {
            setUserProjects(data);
          } else {
            toast.error("Failed to fetch projects.");
          }
        } catch (error) {
          toast.error("An error occurred while fetching projects.");
        }
      }
    };

    fetchUserProjects();
  }, [email]);

  const handleDelete = async (pitchId: string) => {
    try {
      const response = await fetch(`/api/deletePitch?pitchId=${pitchId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Pitch deleted successfully!");
        setUserProjects((prevProjects) =>
          prevProjects.filter((proj) => proj._id !== pitchId)
        );
      } else {
        toast.error("Failed to delete pitch.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the pitch.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // Capture file for file inputs, else capture value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      businessPhase: value,
    }));
  };

  const redirectToCheckOut = async () => {
    // Save project data to FormData for file handling
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.projectIdea ||
      !formData.businessPhase
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const projectData = new FormData();
    projectData.append("companyName", formData.companyName);
    projectData.append("projectIdea", formData.projectIdea);
    projectData.append("businessPhase", formData.businessPhase);
    if (formData.image) projectData.append("image", formData.image);
    if (formData.video) projectData.append("video", formData.video);

    try {
      const response = await fetch("/api/saveProject", {
        method: "POST",
        body: projectData, // Use FormData to include files
      });

      if (response.ok) {
        toast.success("Pitch posted");
      } else {
        toast.error("An error occurred. Please try again.");
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
                  onChange={handleChange} // handleChange will capture the image file
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
                  onChange={handleChange} // handleChange will capture the video file
                />
              </div>
            </div>

            <div>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[280px] bg-card text-card-foreground">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent side="bottom" sideOffset={5}>
                  <SelectItem
                    value="Initial Phase"
                    className="bg-card text-card-foreground"
                  >
                    Initial Phase
                  </SelectItem>
                  <SelectItem
                    value="Startup Phase"
                    className="bg-card text-card-foreground"
                  >
                    Startup Phase
                  </SelectItem>
                  <SelectItem
                    value="Growth Phase"
                    className="bg-card text-card-foreground"
                  >
                    Growth Phase
                  </SelectItem>
                  <SelectItem
                    value="Maturity Phase"
                    className="bg-card text-card-foreground"
                  >
                    Maturity Phase
                  </SelectItem>
                  <SelectItem
                    value="Expansion Phase"
                    className="bg-card text-card-foreground"
                  >
                    Expansion Phase
                  </SelectItem>
                  <SelectItem
                    value="Decline Phase"
                    className="bg-card text-card-foreground"
                  >
                    Decline/Renewal Phase
                  </SelectItem>
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
                      <Image
                        src={project.projectImage}
                        alt={`${project.companyName} Image`}
                        width={400}
                        height={300}
                        className="mt-2 w-full h-40 object-cover"
                        priority={true}
                      />
                    )}
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg"
                    >
                      Delete
                    </button>
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
