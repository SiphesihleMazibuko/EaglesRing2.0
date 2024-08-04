import React from "react";
import InvestorNavbar from "../investornavbar/page";
import Footer from "../footer/page";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Business1 from "@/assets/Business1.png";
import Business2 from "@/assets/Busines2.jpeg";

const page = () => {
  return (
    <section className="background-container flex flex-col items-center ">
      <div className="w-full bg-neutral-50">
        <InvestorNavbar />
      </div>
      <div className="container grid gap-10 px-4 md:px-6">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mt-10">
            Explore Project Ideas
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Browse through the latest project ideas from entrepreneurs and
            startups.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <Image
                src={Business1}
                width={400}
                height={225}
                alt="Project Image"
                className="aspect-video object-cover"
              />
            </CardContent>
            <CardFooter className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        alt="Company Logo"
                      />
                      <AvatarFallback>AC</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-medium">Acme Inc</h4>
                      <p className="text-xs text-muted-foreground">
                        Project Idea
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="font-bold text-sm py-2 px-5 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
                  >
                    Connect
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Revolutionize the way you manage your finances with our
                    innovative budgeting app.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="aspect-video object-cover" />
            </CardContent>
            <CardFooter className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        alt="Company Logo"
                      />
                      <AvatarFallback>BC</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-medium">Bravo Corp</h4>
                      <p className="text-xs text-muted-foreground">
                        Project Idea
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="font-bold text-sm py-2 px-5 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
                  >
                    Connect
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Streamline your workflow with our all-in-one project
                    management platform.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <Image
                src={Business2}
                width={400}
                height={225}
                alt="Project Image"
                className="aspect-video object-cover"
              />
            </CardContent>
            <CardFooter className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        alt="Company Logo"
                      />
                      <AvatarFallback>CC</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-medium">Charlie Co</h4>
                      <p className="text-xs text-muted-foreground">
                        Project Idea
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="font-bold text-sm py-2 px-5 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
                  >
                    Connect
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Unlock the power of AI-driven insights to transform your
                    business.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="aspect-video object-cover" />
            </CardContent>
            <CardFooter className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        alt="Company Logo"
                      />
                      <AvatarFallback>DC</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-medium">Delta Inc</h4>
                      <p className="text-xs text-muted-foreground">
                        Project Idea
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="font-bold text-sm py-2 px-5 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 bg-gradient-to-r from-[#917953] to-[#CBAC7C]"
                  >
                    Connect
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Elevate your e-commerce experience with our cutting-edge
                    online store platform.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default page;
