"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Check } from "lucide-react";

export default function Header() {
  const [budget, setBudget] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const dialogRef = useRef(null);
  const dropdownRef = useRef(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowSlider(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const amenitiesOptions = [
    { id: 1, name: "Primary Services" },
    { id: 2, name: "Own Bathroom" },
    { id: 3, name: "Swimming" },
    { id: 4, name: "Roof Garden" },
    { id: 5, name: "Swimming" },
    { id: 6, name: "Roof Garden" },
    { id: 7, name: "Swimming" },
    { id: 8, name: "Roof Garden" },
  ];

  const toggleSelection = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (!isClient) {
    return null;
  }

  const handleSliderChange = (e) => {
    setBudget(e.target.value);
  };

  const sliderBackground = `linear-gradient(90deg, #3cd9c8 ${
    (budget / 10000) * 100
  }%, #ddd ${(budget / 10000) * 100}%)`;

  return (
    <div className="relative">
      <div className="relative">
        <Image
          src="/assets/image 510.png"
          alt="Header Image"
          width={1600}
          height={600}
          className="w-full h-[500px]"
        />
        <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-white to-transparent"></div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <div className="w-[70%] max-w-7xl p-3 bg-purplebutton rounded-lg lg:rounded-full flex flex-wrap lg:flex-nowrap items-center gap-4 mb-4 relative">
          <div className="flex-1 min-w-0 lg:ml-10">
            <label
              className="block text-white font-semibold text-[15px]"
              htmlFor="location"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="Where are you going?"
              className="text-sm text-gray-200 placeholder:text-slate-200 bg-transparent border-none outline-none w-full"
            />
          </div>
          <div className="block border-r border-gray-300 h-8"></div>

          <div className="flex-1 min-w-0 relative">
            <label
              className="block text-white font-semibold text-[15px]"
              htmlFor="budget-input"
            >
              Budget
            </label>
            <input
              id="budget-input"
              type="text"
              value={budget ? `${budget}` : ""}
              placeholder="Add Budget"
              readOnly
              onClick={() => setShowSlider(true)}
              className="text-sm text-gray-200 placeholder:text-slate-200 bg-transparent border-none outline-none w-full cursor-pointer"
            />

            {showSlider && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div
                  ref={dialogRef}
                  className="bg-white p-6 rounded-lg shadow-xl"
                  style={{ width: "477px", height: "182px" }}
                >
                  <h2 className="text-lg font-semibold text-black text-center mb-6">
                    Select Budget
                  </h2>

                  <div className="relative">
                    <div className="absolute bottom-5 left-0 text-gray-700 text-sm">
                      Rs 0
                    </div>
                    <div className="absolute bottom-5 right-0 text-gray-700 text-sm">
                      $10k
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={budget}
                      onChange={handleSliderChange}
                      className="w-full cursor-pointer h-2 rounded-full"
                      style={{
                        background: sliderBackground,
                        transition: "background 0.1s ease",
                      }}
                    />
                  </div>

                  <p className="mt-2 text-center text-gray-700">
                    ${budget || 0}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="block border-r border-gray-300 h-8"></div>

          <div className="flex-1 min-w-0 relative">
            <label
              className="block text-white font-semibold text-[15px]"
              htmlFor="amenities"
            >
              Amenities
            </label>
            <input
              id="amenities"
              type="text"
              placeholder="Select Amenities"
              readOnly
              onClick={() => setShowDropdown((prev) => !prev)}
              className="text-sm text-gray-200 placeholder:text-slate-200 bg-transparent border-none outline-none w-full cursor-pointer"
              value={
                selectedAmenities
                  .map(
                    (id) =>
                      amenitiesOptions.find((amenity) => amenity.id === id)
                        ?.name
                  )
                  .join(", ") || "Select Amenities"
              }
            />

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute z-50 mt-5 scrollbar-hide w-full bg-white shadow-lg rounded-lg max-h-48 overflow-auto"
              >
                <div className="p-3">
                  {amenitiesOptions.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => toggleSelection(amenity.id)}
                    >
                      <span className="text-gray-700">{amenity.name}</span>
                      {selectedAmenities.includes(amenity.id) && (
                        <Check className="w-5 h-5 text-bluebutton flex items-center justify-center rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="block border-r border-gray-300 h-8"></div>

          <div className="flex-1 min-w-0">
            <label
              className="block text-white font-semibold text-[15px]"
              htmlFor="coLivers"
            >
              #coLivers
            </label>
            <input
              id="coLivers"
              type="text"
              placeholder="Add here"
              className="text-sm text-gray-200 placeholder:text-slate-200 bg-transparent border-none outline-none w-full"
            />
          </div>
          <div className="w-full border-t border-gray-300 my-2 lg:hidden pb-14"></div>
          <button
            className="p-3 bg-white rounded-full absolute bottom-4 right-4 lg:right-5 lg:bottom-auto lg:top-auto lg:translate-y-0 flex-shrink-0 hover:bg-gray-50 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
