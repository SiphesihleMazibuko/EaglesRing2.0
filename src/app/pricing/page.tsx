"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import BackButton from '@/components/backbutton/Button'

const Pricing = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-12 px-4 md:px-0 background-container2">
        
      <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-[#917953]">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-black">Basic Plan</h3>
          <div className="text-4xl font-bold text-black">-</div>
        </div>
        <p className="text-gray-950  mt-4">Get started with our basic plan for small teams.</p>
        <div className="mt-6 space-y-3">
        <div className="flex items-center space-x-2">
            <CheckIcon className="h-5 w-5 text-accent" />
            <span className='text-black'>Pitch Guide Videos</span>
          </div>
        <div className="flex items-center space-x-2 opacity-50">
            <XIcon className="h-5 w-5 text-destructive" />
            <span className="line-through text-black">Unlimited Business Assistance</span>
          </div>
          <div className="flex items-center space-x-2 opacity-50">
            <XIcon className="h-5 w-5 text-destructive" />
            <span className="line-through text-black">Unlimited Business Events</span>
          </div>
          <div className="flex items-center space-x-2 opacity-50">
            <XIcon className="h-5 w-5 text-destructive" />
            <span className="line-through text-black">Priority Support</span>
          </div>
          <div className="flex items-center space-x-2 opacity-50">
            <XIcon className="h-5 w-5 text-destructive" />
            <span className="line-through text-black">Chat Enabled</span>
          </div>
          <div className="flex items-center space-x-2 opacity-50">
            <XIcon className="h-5 w-5 text-destructive" />
            <span className="line-through text-black">Business Pitch Guidance</span>
          </div>
        </div>
        <Button className="w-full mt-6 bg-border">Get Started</Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-[#917953]">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-black">Premium Plan</h3>
          <div className="text-4xl font-bold text-black">R450</div>
        </div>
        <p className="text-gray-500 dark:text-gray-950 mt-4">
          Our premium plan offers advanced features for growing teams.
        </p>
        <div className="mt-6 space-y-3">
        <div className="flex items-center space-x-2">
            <CheckIcon className="h-5 w-5 text-accent" />
            <span className='text-black'>Basic Plan</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-5 w-5 text-accent" />
            <span className='text-black'>Unlimited Business Assistance </span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-5 w-5 text-accent" />
            <span className='text-black'>Unlimited Business Events</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-5 w-5 text-accent" />
            <span className='text-black'>Priority support</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-5 w-5 text-accent" />
            <span className='text-black'>Chat Enabled </span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-5 w-5 text-accent" />
            <span className='text-black'>Business Pitch Guidance </span>
          </div>
        </div>
        <Button className="w-full mt-6 bg-border">Get Started</Button>
      </div>
    </div>
  )
}
function CheckIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    )
  }
  function XIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    )
  }

export default Pricing
