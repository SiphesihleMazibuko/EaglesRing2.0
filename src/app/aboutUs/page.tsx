"use client"
import BackButton from '@/components/backbutton/Button'
import React from 'react'
import Navbar from '../navbar/page'

const AboutUs = () => {
  return (
    <div className="background-container min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-screen-xl px-4 md:px-8 lg:px-0">
          <BackButton />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-black text-center mb-6">About Us</h1>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-black">Our Mission</h2>
                <p className="text-lg lg:text-xl text-black leading-relaxed">
                  At Eagles Ring, our mission is to bridge the gap between innovative entrepreneurs and visionary investors. We provide a platform where entrepreneurs can present their groundbreaking ideas to a panel of experienced business moguls, known as the &quot;Eagles.&quot; Our goal is to foster entrepreneurship and drive economic growth by facilitating access to capital and mentorship.
                </p>
              </div>
              <div className='mb-6'>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-black">Our Vision</h2>
                <p className="text-lg lg:text-xl text-black leading-relaxed">
                  We envision a world where every entrepreneur has the resources and support to turn their innovative ideas into reality. Through our platform, we aim to create a thriving community of entrepreneurs and investors who work together to build successful businesses and foster economic growth.
                </p>
              </div>
              <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-black">Our Values</h2>
              <p className="text-lg lg:text-xl text-black leading-relaxed">
              Integrity, innovation, and inclusivity are at the heart of everything we do. We believe in creating a supportive and transparent environment for entrepreneurs and investors alike.
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
