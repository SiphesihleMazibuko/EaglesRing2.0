import React from "react";
import InvestorNavbar from "../investornavbar/page";

const page = () => {
  return (
    <section className="background-container flex flex-col items-center">
      <div className="w-full">
        <InvestorNavbar />
      </div>
    </section>
  );
};

export default page;
