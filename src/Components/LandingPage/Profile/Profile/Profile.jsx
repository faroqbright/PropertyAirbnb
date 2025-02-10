"use client";
import { CameraIcon, Plus, Star, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export default function Bookings() {
  const [status, setStatus] = useState("Info");
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleToggle = (newStatus) => {
    setStatus(newStatus);
  };
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveImage = () => {
    setUploadedImage(null);
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
        <div className="w-full bg-white rounded-xl border-[1.5px] border-gray-200 px-6 pt-2 pb-5 sm:pb-10 sm:pt-5">
          <div className="flex flex-wrap px-4 mt-6 w-full justify-between gap-4">
            <div className="w-full sm:w-[48%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-bluebutton rounded-full inline-block mr-2 mb-0.5"></span>
                Hobbies
              </h2>
              <div className="flex flex-wrap gap-2 mt-3">
                <button className="text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 transition-all duration-200 focus:border-none focus:bg-bluebutton focus:text-white">
                  Gym
                </button>
                <button className="text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 transition-all duration-200 focus:border-none focus:bg-bluebutton focus:text-white">
                  Running
                </button>
              </div>
            </div>

            <div className="w-full sm:w-[48%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-bluebutton rounded-full inline-block mr-2 mb-0.5"></span>
                Pet Friendly
              </h2>
              <button className="text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 mt-3 transition-all duration-200 focus:bg-bluebutton focus:text-white focus:border-none">
                Allergic to pets
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-around my-10 px-4 w-full gap-4">
            <div className="w-full sm:w-[30%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-bluebutton rounded-full inline-block mr-2 mb-0.5"></span>
                Dietary Preference
              </h2>
              <button className="text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 mt-3 transition-all duration-200 focus:border-none focus:bg-bluebutton focus:text-white">
                Vegetarian
              </button>
            </div>

            <div className="w-full sm:w-[30%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-bluebutton rounded-full inline-block mr-2 mb-0.5"></span>
                Smoking Habit
              </h2>
              <button className="text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 mt-3 transition-all duration-200 focus:border-none focus:bg-bluebutton focus:text-white">
                Smoker
              </button>
            </div>

            <div className="w-full sm:w-[30%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-bluebutton rounded-full inline-block mr-2 mb-0.5"></span>
                Drinking Habit
              </h2>
              <button className="text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 mt-3 transition-all duration-200 focus:border-none focus:bg-bluebutton focus:text-white">
                In house
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center sm:mt-16 mt-10 w-full px-4">
            <button className="text-[14px] text-white bg-bluebutton rounded-full px-20 py-2.5 transition-all duration-200">
              Edit
            </button>
          </div>
        </div>
      ) : (
        <div className="border-[1px] rounded-2xl p-8 md:p-6 lg:p-8">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                    <CameraIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-semibold">5.0</span>
                </div>
              </div>
              <button className="text-white bg-bluebutton py-2 px-4 rounded-full">
                Change Password
              </button>
            </div>

            <div className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    className="border p-2 rounded-full w-full"
                    placeholder="Write here"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    className="border p-2 rounded-full w-full"
                    placeholder="Write here"
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Number</label>
                <input
                  className="border p-2 rounded-full w-full"
                  placeholder="Write here"
                  type="number"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <label className="border-[1px] w-[200px] rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer">
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium">Upload CNIC</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {uploadedImage && (
                <div className="relative h-[120px] w-[200px] rounded-lg overflow-hidden">
                  <Image
                    src={uploadedImage}
                    alt="CNIC Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-center ">
              <button className="bg-bluebutton text-white hover:bluebutton py-2 px-8 rounded-full">
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
