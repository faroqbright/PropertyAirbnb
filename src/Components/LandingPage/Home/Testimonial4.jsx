"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Testimonial4 = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col lg:flex-row justify-end w-full py-12 lg:pl-4">
      <div className="flex flex-col lg:flex-row lg:w-[85%] justify-end lg:items-center relative">
        <div className="w-full lg:w-[500px] h-[350px] mb-10 lg:mb-0 z-10 items-center lg:mr-[-100px] lg:px-[0px] px-[100px]">
          <img
            src="/assets/head5.png"
            alt="Rental House"
            className="rounded-3xl shadow-lg w-full h-full object-cover"
          />
        </div>

        <div className="bg-gradient-to-r from-[#EEEEEE00] via-[#f3e8ff] to-[#E4E5F9] py-12 lg:py-36  lg:pl-36 rounded-l-2xl lg:w-[70%] lg:justify-self-end lg:text-left text-center">
          <h1 className="text-3xl sm:text-4xl mb-4 lg:text-left text-center font-semibold">
            Experience Hassle-Free Renting
          </h1>

          <p className="mb-8 lg:w-[90%] lg:ml-0 ml-10 text-[15px] sm:text-[16px] text-gray-500">
            CoLivers isn't just another rental platform—it's your partner in
            finding the perfect place to call home. We prioritize security,
            simplicity, and satisfaction to deliver an unmatched renting
            experience. Here's why CoLivers is the right choice for you.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button
              className="px-6 py-3 bg-teal-500 text-white rounded-xl shadow-md hover:bg-teal-600 transition"
              onClick={() => router.push("/Landing/Profile")}
            >
              Secure Transactions
            </button>
            <button
              className="px-6 py-3 bg-purple-500 text-white rounded-xl shadow-md hover:bg-purple-600 transition"
              onClick={() => router.push("/Landing/Profile")}
            >
              Tailored Options
            </button>
            <button
              className="px-6 py-3 bg-gray-700 text-white rounded-xl shadow-md hover:bg-gray-800 transition"
              onClick={() => router.push("/Landing/Profile")}
            >
              Communication
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial4;
