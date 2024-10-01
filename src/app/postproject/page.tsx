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
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";

interface Project {
  isExpanded: any;
  _id: string;
  companyName: string;
  projectIdea: string;
  businessPhase: string;
  pitchVideo: string | null;
  projectImage: string | null;
  investmentAmount: string;
  createdAt: string;
}

interface PitchState {
  isExpanded: boolean;
}

function PostProject() {
  const { user } = useUser();
  const email = user?.email;
  const router = useRouter();
  const [pitchStates, setPitchStates] = useState<{ [key: string]: PitchState }>(
    {}
  );

  const [formData, setFormData] = useState({
    companyName: "",
    projectIdea: "",
    image: null,
    video: null,
    businessPhase: "",
    investmentAmount: "",
  });

  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const response = await fetch("/api/getEntrepreneurProject");
        if (response.ok) {
          const data = await response.json();
          setUserProjects(data);
        } else {
          toast.error("Error fetching projects");
        }
      } catch (error) {
        toast.error("Error fetching projects");
      }
    };

    fetchUserProjects();
  }, []);

  const handleDelete = async (pitchId: string) => {
    try {
      const response = await fetch("/api/deletePitch", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pitchId }),
      });

      if (response.ok) {
        toast.success("Pitch deleted successfully");
        setUserProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== pitchId)
        );
      } else {
        toast.error("Error deleting pitch");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting pitch");
    }
  };

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

  const toggleReadMore = (id: string) => {
    setPitchStates((prevStates) => ({
      ...prevStates,
      [id]: {
        ...prevStates[id],
        isExpanded: !prevStates[id]?.isExpanded,
      },
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.companyName ||
      !formData.projectIdea ||
      !formData.businessPhase ||
      !formData.investmentAmount
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const projectData = new FormData();
    projectData.append("companyName", formData.companyName);
    projectData.append("projectIdea", formData.projectIdea);
    projectData.append("businessPhase", formData.businessPhase);
    projectData.append("investmentAmount", formData.investmentAmount);
    if (formData.image) projectData.append("image", formData.image);
    if (formData.video) projectData.append("video", formData.video);

    try {
      const response = await fetch("/api/saveProject", {
        method: "POST",
        body: projectData,
      });

      if (response.ok) {
        toast.success("Pitch posted");
      } else {
        const errorMessage = await response.text();
        console.error("Response error:", errorMessage);
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                type="number"
                placeholder="Investment Amount"
                name="investmentAmount"
                value={formData.investmentAmount}
                onChange={handleChange}
                className="bg-muted text-neutral-950"
                min="1"
                required
              />
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger className="w-full bg-card text-card-foreground">
                  <SelectValue placeholder="Select Business Phase" />
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="sr-only">Loading...</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Loader />
                  </span>
                </>
              ) : (
                "Post"
              )}
            </Button>
          </form>

          {/* Display user's posted projects */}
          <div className="mt-10">
            <h3 className="text-2xl font-semibold">Your Posted Projects</h3>
            {userProjects.length === 0 ? (
              <p>You haven&apos;t posted any projects yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols- mt-10">
                {userProjects.map((project) => (
                  <Card key={project._id} className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      {project.pitchVideo && (
                        <video
                          controls
                          width={400}
                          height={225}
                          className="aspect-video object-cover"
                        >
                          <source src={project.pitchVideo} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </CardContent>
                    <CardFooter className="p-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div>
                              <h4 className="text-sm font-medium">
                                {project.companyName}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {project.businessPhase}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Created on:{" "}
                                {new Date(project.createdAt).toLocaleDateString(
                                  "en-UK",
                                  {
                                    year: "2-digit",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="font-bold bg-destructive text-input text-sm py-2 px-5 ml-10 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 "
                            onClick={() => handleDelete(project._id)}
                          >
                            Delete
                          </Button>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {project.projectIdea.length > 100
                              ? `${project.projectIdea.slice(0, 100)}...`
                              : project.projectIdea}
                          </p>
                          {project.projectIdea.length > 100 && (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 mt-1 text-sm font-semibold text-blue-500 hover:underline"
                              onClick={() => toggleReadMore(project._id)}
                            >
                              {project.isExpanded ? "Read Less" : "Read More"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
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
