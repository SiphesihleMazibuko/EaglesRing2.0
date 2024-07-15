"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const router = useRouter();

  const handleImageClick = () => {
    router.push("/services");
  };

  return (
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
          <ul className="hidden md:flex items-center gap-6 list-none">
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
        <div className="p-2.5">
          <UserButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
