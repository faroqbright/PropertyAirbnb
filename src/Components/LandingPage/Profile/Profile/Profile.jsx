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

      <div className="w-full bg-white rounded-xl border-[1.5px] border-gray-200 px-6 pt-1 pb-4">
      </div>
    </>
  );
}
