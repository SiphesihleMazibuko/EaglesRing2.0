import React from "react";
import Navbar from "../navbar/page";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function page() {
  return (
    <div className="min-h-screen">
      <Navbar />
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
          <form className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
              <Input
                placeholder="Company Name"
                className="bg-muted text-neutral-950"
              />
              <Input
                placeholder="Project Idea"
                className="bg-muted text-neutral-950"
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
                <Input type="file" id="image" />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="video"
                  className="hover:underline cursor-pointer"
                >
                  Upload Video
                </Label>
                <Input type="file" id="video" />
              </div>
            </div>
            <Button
              type="submit"
              className="ml-auto font-bold text-sm py-2 px-5 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
            >
              Post
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default page;
