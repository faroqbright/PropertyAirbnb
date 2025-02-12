"use client";
import React, { useState } from "react";
import { Camera, Check } from "lucide-react";

const Personal = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(step + 1);
  };

  return (
    <div className="flex items-center justify-center w-full mb-10 mt-10">
      {step === 1 ? (
        <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 py-14 lg:px-14 px-5 flex flex-col">
          <div className="flex bg-gray-200 rounded-full w-60 lg:w-72 m-auto lg:flex-row"></div>

          <div className="mt-10 text-center text-textclr text-2xl font-semibold">
            <h1>Personal Information!</h1>
          </div>

          <div className="flex items-center justify-center h-full mt-10 text-textclr">
            <Camera
              className="p-7 bg-gray-300 rounded-full text-textclr"
              size={90}
            />
          </div>

          <div className="mt-10">

            <div className="mt-5">
              <label className="text-textclr" name="email">
                Birth
              </label>
              <br />
              <input
                type="text"
                name="email"
                placeholder="Write Here"
                className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
              />
            </div>

            <div className="mt-5">
              <label className="text-textclr" name="number">
                Gender
              </label>
              <br />
              <input
                type="text"
                name="number"
                placeholder="Write Here"
                className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
              />
            </div>

            <div className="mt-5">
              <label className="text-textclr" name="password">
                Sex Orientation
              </label>
              <br />
              <input
                type="password"
                name="password"
                placeholder="Write Here"
                className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
              />
            </div>

            <div className="mt-5">
              <button
                className="w-full text-center mt-5 border-[1.5px] py-2 text-white bg-bluebutton rounded-full"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Personal;
