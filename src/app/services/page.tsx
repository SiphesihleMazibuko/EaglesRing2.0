"use client";
import React from "react";
import Navbar from "../navbar/page";
import Slider from "../slider/page";
import Footer from "../footer/page";

const homepage = () => {
  return (
    <section className="background-container flex flex-col items-center">
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex flex-col items-center justify-center mt-4 w-4/5">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-4 text-center text-black">
          Eagles Ring, Home of Innovators
        </h2>
        <p className="text-base font-normal leading-8 text-center text-gray-950">
          Help in building pitches | Transform your ideas into reality | Get
          Financial Aid | Connect with Investors all over
        </p>
      </div>
      <div className="flex flex-col items-center gap-8 mt-20 w-full">
        <div className="w-full flex flex-col items-center">
          <h3 className="text-3xl font-semibold mb-4 text-gray-950">
            How to Pitch an Idea to an Investor
          </h3>
          <div className="w-4/5">
            <iframe
              className="w-full aspect-video"
              src="https://www.youtube.com/embed/XWRtG_PDRik"
              title="How to Pitch your Startup in 3 Minutes"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="w-full mt-12">
          <h3 className="text-3xl font-semibold mb-4 text-center text-gray-950">
            Latest Business Events
          </h3>
          <div className="flex justify-center">
            <div className="w-4/5">
              <Slider />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default homepage;
