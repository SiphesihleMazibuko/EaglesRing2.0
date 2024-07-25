"use client"
import BackButton from '@/components/backbutton/Button'
import Link from 'next/link'
import React from 'react'

const Features = () => {
  return (
    <div className="background-container p-10 text-center">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Features</h1>
      <BackButton />
      <div className="flex flex-wrap justify-around gap-4 mb-10">
        <div className="dark:bg-[#917953] p-6 rounded-lg shadow-lg w-64 transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Pitch your Idea</h2>
          <p className="text-black">Present your business model to a panel of experienced investors</p>
        </div>
        <div className="dark:bg-[#917953] p-6 rounded-lg shadow-lg w-64 transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Secure Funding</h2>
          <p className="text-black">Get funding from our network of investors who are ready to back promising ventures</p>
        </div>
        <div className="dark:bg-[#917953] p-6 rounded-lg shadow-lg w-64 transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Expert Guidance</h2>
          <p className="text-black">Receive mentorship and strategic advice from successful business moguls</p>
        </div>
        <div className="dark:bg-[#917953] p-6 rounded-lg shadow-lg w-64 transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Global Reach</h2>
          <p className="text-black">Connect with investors and entrepreneurs from around the world</p>
        </div>
        <div className="dark:bg-[#917953] p-6 rounded-lg shadow-lg w-64 transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Resource Library</h2>
          <p className="text-black">Access a vast library of resources to help you grow your business</p>
        </div>
        <div className="dark:bg-[#917953] p-6 rounded-lg shadow-lg w-64 transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Networking Events</h2>
          <p className="text-black">Attend exclusive events and meet industry leaders and potential partners</p>
        </div>
        <div className="dark:bg-[#917953] p-6 rounded-lg shadow-lg w-64 transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Customizable Profiles</h2>
          <p className="text-black">Create and customize your profile to showcase your business and attract investors</p>
        </div>
        <div className="dark:bg-[#917953] p-6 rounded-lg shadow-lg w-64 transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Analytics Dashboard</h2>
          <p className="text-black">Monitor your progress with our advanced analytics and reporting tools</p>
        </div>
      </div>
      <div>
        <Link href="/signin" className="inline-flex h-9 items-center justify-center transform  hover:scale-105  text-black bg-gradient-to-r from-[#917953] to-[#CBAC7C] font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:border-[#917953]  border-[#917953]">
            Get Started
          
        </Link>
      </div>
    </div>
  )
}

export default Features
