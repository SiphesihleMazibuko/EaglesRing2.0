"use client";
import React from "react";
import Navbar from "../navbar/page";
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
        <h3 className="text-3xl font-semibold mb-8 text-gray-950">
          Lifecycle of a Business: A Guide to Identifying Your Business Phase
        </h3>
        <div className="w-4/5">
          <div className="mb-8">
            <h4 className="text-2xl font-bold mb-2 text-black">
              Initial Phase:
            </h4>
            <p className="text-base leading-7 text-gray-700">
              This is the phase where the business idea is born. Entrepreneurs
              brainstorm, research, and validate their business idea, assessing
              its viability and potential market demand.
            </p>
          </div>
          <div className="mb-8">
            <h4 className="text-2xl font-bold mb-2 text-black">
              Startup Phase:
            </h4>
            <p className="text-base leading-7 text-gray-700">
              This is the phase where the business idea is turned into reality.
              The entrepreneur creates a business plan, secures funding,
              establishes the legal structure, and starts operations. This is
              when the business officially starts, but it&aps;s still in its
              infancy, with the focus on building the product or service and
              acquiring the first customers.
            </p>
          </div>
          <div className="mb-8">
            <h4 className="text-2xl font-bold mb-2 text-black">
              Growth Phase:
            </h4>
            <p className="text-base leading-7 text-gray-700">
              In this stage, the business begins to expand. Sales increase, the
              customer base grows, and the company may start scaling operations.
              The focus is on increasing market share, optimizing operations,
              and possibly entering new markets.
            </p>
          </div>
          <div className="mb-8">
            <h4 className="text-2xl font-bold mb-2 text-black">
              Maturity Phase:
            </h4>
            <p className="text-base leading-7 text-gray-700">
              During this phase, the business is well-established with a stable
              customer base and steady revenue. The focus shifts to maintaining
              market position, optimizing processes, and maximizing profits.
              Businesses may also innovate to stay competitive or explore
              diversification.
            </p>
          </div>
          <div className="mb-8">
            <h4 className="text-2xl font-bold mb-2 text-black">
              Expansion Phase:
            </h4>
            <p className="text-base leading-7 text-gray-700">
              Some businesses enter this phase where they look to expand their
              operations, either by entering new markets, launching new
              products, or acquiring other businesses. This phase can involve
              significant investment and carries higher risks.
            </p>
          </div>
          <div className="mb-8">
            <h4 className="text-2xl font-bold mb-2 text-black">
              Renewal/Decline Phase:
            </h4>
            <p className="text-base leading-7 text-gray-700">
              Eventually, a business might face a decline due to market
              saturation, competition, or changing customer preferences. At this
              point, the business may either innovate and renew itself to stay
              relevant or face decline, which could lead to downsizing,
              restructuring, or even closure.
            </p>
          </div>
        </div>
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
      </div>
      <Footer />
    </section>
  );
};

export default homepage;
