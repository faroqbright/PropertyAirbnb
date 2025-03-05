"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Testimonial() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-[990px]:flex-row items-center justify-between px-6 min-[990px]:px-16 py-16">
      <div className="min-[990px]:w-1/2 text-center min-[990px]:text-left">
        <h1 className="font-bold sm:text-5xl text-4xl text-textclr">
          Find Your Perfect <br /> Home with CoLivers
        </h1>
      </div>
      <div className="min-[990px]:w-1/2 mt-6 min-[990px]:mt-0 text-center min-[990px]:text-left">
        <p className="text-gray-600 lg:pr-28 pb-4 min-[450px]:px-10 lg:px-0">
          Discover a seamless way to rent properties. Browse a wide range of
          rooms, apartments, and houses tailored to your needs. Whether you're a
          tenant looking for a cozy stay or a landlord ready to list your
          property, CoLivers makes the process easy, secure, and efficient.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row min-[450px]:px-14 sm:px-0 justify-center gap-4">
          <button
            className="bg-bluebutton text-white px-6 py-2 rounded-full font-medium shadow-sm"
            onClick={() => router.push("/Landing/Home")}
          >
            Find Your CoLivers Home
          </button>
          <button
            className="bg-purplebutton text-white px-6 py-2 rounded-full font-medium shadow-sm"
            onClick={() => router.push("/Landing/Properties")}
          >
            List Your Property
          </button>
        </div>
      </div>
    </div>
  );
}
