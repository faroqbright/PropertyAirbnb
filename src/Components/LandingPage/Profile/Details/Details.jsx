"use client";
import { Check, Star } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export default function Bookings() {
  const [status, setStatus] = useState("Info");
  const [checkedItems, setCheckedItems] = useState([false, false, false]);

  const feeItems = [
    { label: "$79 x 3 months", price: 555 },
    { label: "Cleaning Fees", price: 62 },
    { label: "Service Fee", price: 75 },
  ];

  const handleToggle = (index) => {
    setCheckedItems((prevState) => {
      const updatedCheckedItems = [...prevState];
      updatedCheckedItems[index] = !updatedCheckedItems[index];
      return updatedCheckedItems;
    });
  };

  const totalPrice = feeItems.reduce((acc, item, index) => {
    return checkedItems[index] ? acc + item.price : acc;
  }, 0);

  return (
    <div className="min-h-screen p-4 md:p-10 lg:p-20">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-xl border-[1.5px] border-gray-200 px-6 pt-1 pb-4 mb-1">
        <div className="container p-2 mb-5">
          <div className="w-full h-auto flex flex-col md:flex-row justify-between">
            <div className="left flex gap-5 mb-4 md:mb-0 flex-col md:flex-row">
              <Image
                src="/assets/admin.jpeg"
                alt="User"
                width={40}
                height={50}
                className="w-full md:w-40 md:w-50 rounded-3xl h-40 md:h-full"
              />
              <div className="container pr-5 py-2">
                <p className="text-textclr font-bold md:w-full text-center md:text-left">
                  Hassan Saleem
                </p>
                <p className="text-textclr text-md md:w-full text-center md:text-left">
                  Entire loft in Florence, Italy
                </p>
              </div>
            </div>

            <div className="price w-full md:w-40 flex items-center justify-center md:justify-end pl-5">
              <div className="border-l-2 hidden md:block border-gray-300 h-10 text-center"></div>
              <p className="text-textclr -ml-5 md:-ml-0 md:pl-5">$120</p>
            </div>
            <div className="right w-full md:w-40 flex items-center justify-center mt-4">
              <div className="flex flex-col items-center gap-y-4">
                <button className="bg-bluebutton text-white w-32 px-9 py-1 rounded-2xl">
                  Accept
                </button>
                <button className="px-9 py-1 w-32 text-white rounded-2xl bg-black">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 h-[1px] mb-5"></div>
        <div className="flex flex-col md:flex-row w-full">
          <div className="md:w-[50%] lg:w-[70%] w-full mb-5 md:mb-0">
            <ul>
              <li className="mb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 text-xl">•</span>
                    <p className="text-textclr font-medium">Hobbies</p>
                  </div>
                  <div className="flex gap-3 ml-5 mt-2">
                    <button className="border-gray-200 border-[1px] px-5 py-[2px] rounded-3xl text-slate-500">
                      Gym
                    </button>
                    <button className="border-gray-200 border-[1px] px-5 py-[2px] rounded-3xl text-slate-500">
                      Running
                    </button>
                  </div>
                </div>
              </li>

              <li className="mb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 text-xl">•</span>
                    <p className="text-textclr font-medium">Pet Friendly</p>
                  </div>
                  <div className="flex gap-3 ml-5 mt-2">
                    <button className="border-gray-200 border-[1px] px-5 py-[2px] rounded-3xl text-slate-500">
                      Allergic to Pets
                    </button>
                  </div>
                </div>
              </li>

              <li className="mb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 text-xl">•</span>
                    <p className="text-textclr font-medium">
                      Dietary Preferences
                    </p>
                  </div>
                  <div className="flex gap-3 ml-5 mt-2">
                    <button className="border-gray-200 border-[1px] px-5 py-[2px] rounded-3xl text-slate-500">
                      Vegetarian
                    </button>
                  </div>
                </div>
              </li>

              <div className="flex gap-4 md:gap-10">
                <li className="mb-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400 text-xl">•</span>
                      <p className="text-textclr font-medium">Smoking Habit</p>
                    </div>
                    <div className="flex gap-3 ml-5 mt-2">
                      <button className="border-gray-200 border-[1px] px-5 py-[2px] rounded-3xl text-slate-500">
                        Smoker
                      </button>
                    </div>
                  </div>
                </li>
                <li className="mb-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400 text-xl">•</span>
                      <p className="text-textclr font-medium">Drinking Habit</p>
                    </div>
                    <div className="flex gap-3 ml-5 mt-2">
                      <button className="border-gray-200 border-[1px] px-5 py-[2px] rounded-3xl text-slate-500">
                        In House
                      </button>
                    </div>
                  </div>
                </li>
              </div>
            </ul>
          </div>

          <div className="md:w-[50%] 2xl:h-[43vh] h-[50vh] lg:w-[40%] w-full rounded-3xl bg-purplebutton">
            <div className="container pt-10 px-5">
              <div className="flex justify-between items-center">
                <div className="w-1/2 flex items-center">
                  <p className="pr-1 font-semibold text-lg text-white">$75</p>{" "}
                  <p className="text-md text-white">/ month</p>
                </div>
                <div className="flex gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <p className="text-md text-white">5.0</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-white">•</span>
                    <p className="underline text-md text-white">7 reviews</p>
                  </div>
                </div>
              </div>

              <div className="h-[1px] w-full bg-purple-300 mt-5 mb-5"></div>
              <ul>
                {feeItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 mb-2">
                    <div className="flex justify-between w-full items-center">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={checkedItems[index]}
                            onChange={() => handleToggle(index)}
                          />
                          <div
                            className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
                              checkedItems[index] ? "bg-white " : "border-white"
                            }`}
                          >
                            {checkedItems[index] && (
                              <Check className="text-bluebutton w-4 h-4" />
                            )}
                          </div>
                        </label>
                        <label
                          htmlFor="plan"
                          className="cursor-pointer text-white"
                        >
                          {item.label}
                        </label>
                      </div>
                      <div>
                        <p className="text-white">${item.price}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="h-[1px] w-full bg-purple-300 mt-5 mb-5"></div>
              <div className="flex justify-between">
                <p className="text-white">Total</p>
                <h2 className="font-bold text-xl items-center text-white">
                  ${totalPrice}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}