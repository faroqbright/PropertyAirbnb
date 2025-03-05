"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

export default function Testimonial2() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col md:flex-row items-center py-12">
      <div className="md:w-[40%] w-full relative">
        <img
          src="/assets/bg.png"
          className="object-cover w-full h-full absolute inset-0 opacity-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-transparent opacity-85"></div>
        <div className="relative z-10 py-20 md:pl-20 px-8 min-[570px]:px-28 md:px-0 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple Steps to Your Dream Stay
          </h1>
          <p className="text-gray-700 mb-6 font-medium text-[16px] py-4">
            At CoLivers, we’ve designed a streamlined process to make finding
            and renting your perfect property as easy as possible. Whether
            you're searching for a cozy room, a spacious apartment, or a
            luxurious house, our platform ensures a smooth and secure experience
            for both tenants and landlords.
          </p>
          <button
            className="bg-bluebutton text-white px-6 py-2 rounded-full font-medium shadow-md"
            onClick={() => router.push("/Landing/Home")}
          >
            Find Your CoLivers Home
          </button>
        </div>
      </div>

      <div className="md:w-[60%] w-full flex flex-col gap-6 pr-0 lg:pr-16 lg:-ml-0 -ml-16 mt-14 md:mt-0">
        {[
          {
            title: "Search & Explore",
            img: "/assets/image1.png",
            label: "Secure Transactions",
            color: "bluebutton",
            bgcolor: "bg-bluebutton",
          },
          {
            title: "Book & Verify",
            img: "/assets/image2.png",
            label: "Tailored Options",
            color: "purplebutton",
            bgcolor: "bg-purplebutton",
          },
          {
            title: "Move In",
            img: "/assets/image3.png",
            label: "Communication",
            color: "darkpurplebutton",
            bgcolor: "bg-darkpurplebutton",
          },
        ].map((item, index) => (
          <div key={index} className="relative flex items-center">
            <div className="flex flex-col justify-center items-end px-3 py-1">
              <div
                className={`-rotate-90 md:ml-24 whitespace-nowrap text-[15px] w-[163px] transform px-4 py-2 rounded-r-xl rounded-l-xl text-white font-medium ${item.bgcolor} flex justify-center items-center`}
              >
                {item.label}
              </div>
            </div>

            <div className="relative -ml-10">
              <Image
                src={item.img}
                alt={item.title}
                width={250}
                height={100}
                className="w-[600px] h-[145px] py-1"
              />
              <h2 className="absolute bottom-2 left-2 text-[16px] font-medium text-white p-2 w-full z-10">
                {item.title}
              </h2>
              <div
                className="absolute inset-x-0 bottom-1 h-[138px] lg:rounded-2xl rounded-lg"
                style={{
                  backgroundImage: `linear-gradient(to right, ${
                    item.color === "purplebutton"
                      ? "#af99d6"
                      : item.color === "bluebutton"
                      ? "#3CD9C8"
                      : item.color === "darkpurplebutton"
                      ? "#5c4b6d"
                      : "#5c4b6d"
                  }, transparent)`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
