import React from "react";
import Image from "next/image";

export default function Testimonial() {
  const icons = [
    { src: "/assets/icon1.png", text: "Primary Services" },
    { src: "/assets/icon2.png", text: "Own Bathroom" },
    { src: "/assets/icon3.png", text: "Gym" },
    { src: "/assets/icon4.png", text: "Swimming Pool" },
    { src: "/assets/icon5.png", text: "Roof Garden" },
    { src: "/assets/icon6.png", text: "Vigilance" },
    { src: "/assets/icon7.png", text: "Coworking" },
    { src: "/assets/icon8.png", text: "Cat friendly" },
  ];

  return (
    <div className="bg-[#FAFAFA] p-6 my-12 text-center">
      <span className="flex justify-center text-black font-bold text-[28px] mt-4">
        What this place offers
      </span>

      <div className="flex justify-center items-center my-10">
        <div className="grid min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
          {icons.map((icon, index) => (
            <div
              key={index}
              className="flex items-center justify-center border-[1px] border-gray-300 p-4 rounded-full px-8 py-2"
            >
              <Image src={icon.src} alt={icon.text} width={18} height={18} />
              <p className="text-[14px] font-medium text-[#828282] ml-2 text-nowrap">
                {icon.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
