import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";

function Footer() {
  return (
    <>
      <footer className="flex flex-col w-full px-5 py-6 text-white gap-y-3 bg-gradient-to-b from-violet-600 to-violet-700 md:px-5 lg:px-25 ">
        <div className="flex flex-col w-full md:flex-row md:justify-between gap-y-4 px-4 md:px-0">
          <div className="flex flex-col  gap-y-1.5 w-full md:w-1/2">
            <h1 className="text-2xl font-bold">
              Graduation Project Management
            </h1>
            <p className="pl-1.5 text-sm md:text-base text-neutral-200 ">
              Your go-to platform for managing graduation projects efficiently.
            </p>
          </div>
          <div className="flex flex-col gap-y-1.5">
            <h1 className="text-lg font-bold">Contact Us</h1>
            <ul className="flex flex-col gap-y-0.5 pl-1.5">
              <li className="text-sm md:text-base text-neutral-100">
                Email:{" "}
                <span className="text-xs md:text-sm text-neutral-100">
                  contact@graduationprojectmanagement.com
                </span>
              </li>
              <li className="text-sm md:text-base text-neutral-100">
                Phone:{" "}
                <span className="text-xs md:text-sm text-neutral-100">
                  +966 123 456 7890
                </span>
              </li>
              <li className="text-sm md:text-base text-neutral-100">
                Address:{" "}
                <span className="text-xs md:text-sm text-neutral-100">
                  123 King Fahd Road, Riyadh, Saudi Arabia
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center w-full md:justify-end gap-x-4 ">
          <FaFacebook className="text-2xl transition duration-200 cursor-pointer hover:text-white text-neutral-200 hover:scale-105" />
          <FaXTwitter className="text-2xl transition duration-200 cursor-pointer hover:text-white text-neutral-200 hover:scale-105" />
          <FaInstagram className="text-2xl transition duration-200 cursor-pointer hover:text-white text-neutral-200 hover:scale-105" />
          <FaLinkedin className="text-2xl transition duration-200 cursor-pointer hover:text-white text-neutral-200 hover:scale-105" />
          <FaDiscord className="text-2xl transition duration-200 cursor-pointer hover:text-white text-neutral-200 hover:scale-105" />
          <FaGithub className="text-2xl transition duration-200 cursor-pointer hover:text-white text-neutral-200 hover:scale-105" />
        </div>
        <div className="text-center text-white ">
          <p className="text-xs md:text-sm text-neutral-200">
            © 2025 Tuwaiq Homework. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
