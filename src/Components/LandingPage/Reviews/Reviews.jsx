"use client"
import React from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WriteReview() {
  const reviewTitles = ["Organization", "Communication", "Honesty"];
  const router = useRouter()

  const handlenav = () => {
      localStorage.setItem("fromProfile", "true");
      router.push("/Landing/Properties/PropertiesDetail");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-16 mb-10">
      <div className="flex flex-col justify-center items-center w-full max-w-[600px] space-y-6 p-4 sm:px-8 sm:py-12 bg-white border-[1.5px] rounded-2xl shadow-sm">
        <h1 className="font-semibold text-black text-xl sm:text-2xl mb-6 text-center">
          Write a Review for coLiver
        </h1>

        {reviewTitles.map((title, index) => (
          <div key={index} className="w-full flex flex-col items-center">
            <span className="text-black text-base font-medium sm:text-lg text-[#000000BD] mb-3">
              {title}
            </span>
            <div className="flex space-x-1 mb-3">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star
                  key={starIndex}
                  size={30}
                  className={
                    starIndex < 4 ? "fill-[#FF9E35] text-[#FF9E35]" : "fill-[#D4CDC5] text-[#D4CDC5]"
                  }
                />
              ))}
            </div>
          </div>
        ))}

        <div className="w-full">
          <label
            htmlFor="description"
            className="text-black text-base sm:text-[17px] font-medium block mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Write here..."
            className="w-full sm:w-[537px] h-[96px] p-4 border rounded-3xl resize-none"
          ></textarea>
        </div>

        <button onClick={handlenav} className="w-full max-w-[215px] h-[53px] bg-bluebutton text-white text-base sm:text-lg font-medium py-3 rounded-full">
          Submit
        </button>
      </div>
    </div>
  );
}