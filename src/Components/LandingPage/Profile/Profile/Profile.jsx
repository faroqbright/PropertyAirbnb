"use client";
import React, { useState } from "react";

export default function Bookings() {
  const [status, setStatus] = useState("Info");

  const handleToggle = (newStatus) => {
    setStatus(newStatus);
  };

  return (
    <>
      <div className="flex justify-end space-x-2 mb-5 lg:-mt-20">
        <button
          className={`px-4 w-32 py-2.5 text-sm font-medium rounded-full ${
            status === "Info"
              ? "bg-purplebutton text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => handleToggle("Info")}
        >
          Info
        </button>
        <button
          className={`px-4 w-32 py-2.5 text-sm font-medium rounded-full ${
            status === "Lifestyle"
              ? "bg-purplebutton text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => handleToggle("Lifestyle")}
        >
          Lifestyle
        </button>
      </div>
      {status === "Lifestyle" ? (
        <div className="w-full bg-white rounded-xl border-[1.5px] border-gray-200 px-6 pt-1 pb-4">
          <div className="flex flex-wrap px-4 mt-6 w-full max-w-[75%] justify-between gap-4">
            <div className="w-full sm:w-[48%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-[#3CD9C8] rounded-full inline-block mr-2 mb-0.5"></span>
                Hobbies
              </h2>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  className="text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 transition-all duration-200 
        hover:bg-[#3CD9C8] hover:text-white 
        active:bg-[#3CD9C8] active:text-white 
        focus:bg-[#3CD9C8] focus:text-white"
                >
                  Gym
                </button>
                <button
                  className="text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 transition-all duration-200 
        hover:bg-[#3CD9C8] hover:text-white 
        active:bg-[#3CD9C8] active:text-white 
        focus:bg-[#3CD9C8] focus:text-white"
                >
                  Running
                </button>
              </div>
            </div>

            <div className="w-full sm:w-[48%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-[#3CD9C8] rounded-full inline-block mr-2 mb-0.5"></span>
                Pet Friendly
              </h2>
              <button
                className="text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 mt-3 transition-all duration-200 
      hover:bg-[#3CD9C8] hover:text-white 
      active:bg-[#3CD9C8] active:text-white 
      focus:bg-[#3CD9C8] focus:text-white"
              >
                Allergic to pets
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-between my-10 px-4 w-full max-w-[90%] gap-4">
            <div className="w-full sm:w-[30%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-[#3CD9C8] rounded-full inline-block mr-2 mb-0.5"></span>
                Dietary Preference
              </h2>
              <button
                className="text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 mt-3 transition-all duration-200 
      hover:bg-[#3CD9C8] hover:text-white 
      active:bg-[#3CD9C8] active:text-white 
      focus:bg-[#3CD9C8] focus:text-white"
              >
                Vegetarian
              </button>
            </div>

            <div className="w-full sm:w-[30%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-[#3CD9C8] rounded-full inline-block mr-2 mb-0.5"></span>
                Smoking Habit
              </h2>
              <button
                className="text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 mt-3 transition-all duration-200 
      hover:bg-[#3CD9C8] hover:text-white 
      active:bg-[#3CD9C8] active:text-white 
      focus:bg-[#3CD9C8] focus:text-white"
              >
                Smoker
              </button>
            </div>

            <div className="w-full sm:w-[30%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-[#3CD9C8] rounded-full inline-block mr-2 mb-0.5"></span>
                Drinking Habit
              </h2>
              <button
                className="text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 mt-3 transition-all duration-200 
      hover:bg-[#3CD9C8] hover:text-white 
      active:bg-[#3CD9C8] active:text-white 
      focus:bg-[#3CD9C8] focus:text-white"
              >
                In house
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center mt-14 mb-10 w-full px-4">
            <button
              className="text-[15px] text-white bg-[#3CD9C8] rounded-full border-[1.5px] border-gray-200 px-14 py-1 transition-all duration-200 
    hover:bg-[#2FB5A8] hover:text-white 
    active:bg-[#2FB5A8] active:text-white 
    focus:bg-[#2FB5A8] focus:text-white"
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
