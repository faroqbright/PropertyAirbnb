"use client";
import React from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WriteReview() {
  const router = useRouter();

  const handlenav = () => {
    localStorage.setItem("fromProfile", "true");
    router.push("/Landing/Properties/PropertiesDetail");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-16 mb-10">
      <div className="flex flex-col justify-center items-center w-full max-w-[600px] space-y-6 p-4 sm:px-8 sm:py-12 bg-white border-[1.5px] rounded-2xl shadow-sm">
        <h1 className="font-semibold text-black text-2xl sm:text-2xl mb-6 text-center">
          Write review for user
        </h1>

        <div className="flex gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-8 h-8 ${
                index < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="w-full">
          <label
            htmlFor="description"
            className="text-black text-lg sm:text-[17px] font-medium block mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Write here..."
            className="w-full sm:w-[537px] h-[122px] p-4 border rounded-3xl resize-none "
          ></textarea>
        </div>

        <button
          onClick={handlenav}
          className="w-full max-w-[215px] h-[53px] bg-bluebutton text-white text-base sm:text-lg font-medium py-3 rounded-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
}