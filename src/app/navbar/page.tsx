"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleImageClick = () => {
    router.push("/services");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <nav className="bg-neutral-950 p-4 sticky top-0 z-30 flex items-center">
        <div className="max-w-[1300px] flex items-center justify-between mx-auto w-full">
          <Image
            src="/Logo.png"
            alt="logo"
            width={96}
            height={96}
            className="w-24 h-24 cursor-pointer"
            onClick={handleImageClick}
          />
          <div className="flex-grow flex justify-center">
            <ul className={`md:flex items-center gap-6 list-none ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
              <li>
                <Link href="/services" className="menu-item cursor-pointer text-white hover:text-gray-300">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/chat" className="menu-item cursor-pointer text-white hover:text-gray-300">
                  Chat
                </Link>
              </li>
              <li>
                <Link href="/contact" className="menu-item cursor-pointer text-white hover:text-gray-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/aboutUs" className="menu-item cursor-pointer text-white hover:text-gray-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/profile" className="menu-item cursor-pointer text-white hover:text-gray-300">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <UserButton />
          </div>
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleSidebar} aria-label="Toggle sidebar">
              <HiMenu className="text-background text-2xl " />
            </button>
          </div>
        </div>
      </nav>

      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-neutral-800 text-white z-40 transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="p-4 flex items-center justify-between">
          <button onClick={toggleSidebar} aria-label="Close sidebar">
            <HiX className="text-white text-2xl" />
          </button>
          <UserButton />
        </div>
        <ul className="flex flex-col items-center gap-4 mt-8">
          <li>
            <Link href="/services" className="menu-item cursor-pointer text-white hover:text-gray-300">
              Services
            </Link>
          </li>
          <li>
            <Link href="/chat" className="menu-item cursor-pointer text-white hover:text-gray-300">
              Chat
            </Link>
          </li>
          <li>
            <Link href="/contact" className="menu-item cursor-pointer text-white hover:text-gray-300">
              Contact Us
            </Link>
          </li>
          <li>
            <Link href="/aboutUs" className="menu-item cursor-pointer text-white hover:text-gray-300">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/profile" className="menu-item cursor-pointer text-white hover:text-gray-300">
              Profile
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Navbar;
