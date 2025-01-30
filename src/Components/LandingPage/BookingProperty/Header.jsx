"use client";
import { LayoutGrid } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export default function Header() {
  const [activeButton, setActiveButton] = useState(1);

  const buttons = [
    { id: 1, label: "Property" },
    { id: 2, label: "Room1" },
    { id: 3, label: "Room2" },
  ];

  return (
    <>
      <div className="container mx-auto px-4 md:px-10 lg:px-36 flex flex-col md:flex-row gap-4 relative mt-6">
        <Image
          src="/assets/head1.png"
          alt="Head Component1"
          width={610}
          height={438}
          className="object-cover w-full md:w-[300px] lg:w-[490px] h-auto rounded-xl"
        />

        <div className="grid grid-cols-2 gap-2 flex-1">
          <Image
            src="/assets/head2.png"
            alt="Head Component2"
            width={300}
            height={215}
            className="object-cover w-full h-auto"
          />
          <Image
            src="/assets/head3.png"
            alt="Head Component3"
            width={300}
            height={215}
            className="object-cover w-full h-auto"
          />
          <Image
            src="/assets/head4.png"
            alt="Head Component4"
            width={300}
            height={215}
            className="object-cover w-full h-auto"
          />

          <div className="relative w-full">
            <Image
              src="/assets/head5.png"
              alt="Head Component5"
              width={300}
              height={215}
              className="object-cover w-full h-auto"
            />

            <div className="absolute bottom-2 lg:bottom-4 left-1/2 transform -translate-x-1/2 w-max">
              <button className="flex items-center sm:px-4 sm:py-2 px-2 py-1.5 rounded-lg bg-white border-[1.5px] border-black text-black shadow-md">
                <LayoutGrid size={16} />
                <span className="font-medium text-[12px] sm:text-[14px] ml-1.5">
                  Show all photos
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center sm:justify-end gap-2 sm:pr-36 mb-10">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => setActiveButton(button.id)}
            className={`sm:px-9 sm:py-2 px-4 py-1.5 rounded-full border-[1px] border-gray-300 text-black font-medium transition-all duration-300
        ${
          activeButton === button.id
            ? "bg-[#3CD9C8] text-white"
            : "bg-white hover:bg-[#3CD9C8]"
        }`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </>
  );
}
