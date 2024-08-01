import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faLinkedin,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-50 py-8 p-2.5 mt-5 w-full">
      <div className="max-w-[1300px] flex items-center justify-evenly mx-auto ">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col mb-4 md:mb-0 md:mr-8">
            <h3 className="text-lg font-semibold mb-2">Connect with us</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FontAwesomeIcon
                  icon={faTwitter}
                  className="text-2xl hover:text-blue-400"
                />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className="text-2xl hover:text-blue-600"
                />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="text-2xl hover:text-blue-700"
                />
              </a>
            </div>
          </div>
          <div className="flex flex-col mb-4 md:mb-0 md:mr-8 text-center md:text-left">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul>
              <li>
                <a href="/services" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/aboutUs" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="/chat" className="hover:underline">
                  Chat
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col text-center md:text-right">
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p>Email: icrdgroup@gmail.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
      </div>
      <div className="text-center mt-8 ">
        <p>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
