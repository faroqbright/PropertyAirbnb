"use client";
import { LayoutGrid } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "../../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const [activeButton, setActiveButton] = useState(1);
  const [fromProperties, setFromProperties] = useState(false);
  const [property, setProperty] = useState(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");

  useEffect(() => {
    if (!propertyId) {
      console.log("Error Fetching the Property");
      return;
    }
    const fetchProperty = async () => {
      try {
        const propertyRef = doc(db, "properties", propertyId);
        const propertySnap = await getDoc(propertyRef);

        if (propertySnap.exists()) {
          setProperty({ id: propertySnap.id, ...propertySnap.data() });
        } else {
          console.error("Property not found!");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    };

    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    if (localStorage.getItem("FromProperties")) {
      setFromProperties(true);
    }
  }, []);

  const handleHeaderButtonClick = (id) => {
    localStorage.removeItem("FromProperties");
    router.push("/Landing/Home");
  };

  // Determine which images to display
  const selectedImages =
    activeButton === 1
      ? property?.imageUrls?.slice(0, 5) // Property images
      : property?.rooms?.[activeButton - 2]?.images?.slice(0, 5); // Room images

  return (
    <>
      {fromProperties && (
        <div className="flex flex-wrap justify-center px-4 gap-4 my-9 max-w-full">
          <button
            onClick={() => handleHeaderButtonClick(1)}
            className="h-10 min-w-[140px] text-white font-medium rounded-full bg-bluebutton transition"
          >
            Edit Room
          </button>
          <button
            onClick={() => handleHeaderButtonClick(2)}
            className="h-10 min-w-[140px] text-white font-medium rounded-full bg-purplebutton transition"
          >
            Inactive Room
          </button>
          <button
            onClick={() => handleHeaderButtonClick(3)}
            className="h-10 min-w-[140px] text-white font-medium rounded-full bg-red-500 transition"
          >
            Delete Room
          </button>
        </div>
      )}

      {/* Image Display */}
      <div className="container mx-auto px-4 md:px-10 lg:px-36 flex flex-col md:flex-row gap-4 relative mt-6 overflow-hidden">
        {selectedImages?.[0] && (
          <img
            src={selectedImages[0]}
            alt="Main Image"
            width={610}
            height={438}
            className="object-cover w-full md:w-[300px] lg:w-[490px] h-[438px] rounded-xl" // Fixed height
          />
        )}

        <div className="grid grid-cols-2 gap-2 flex-1">
          {selectedImages?.slice(1, 4).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Image ${index + 2}`}
              width={300}
              height={215}
              className="object-cover w-full h-[215px]" // Fixed height
            />
          ))}
          {selectedImages?.[4] && (
            <div className="relative w-full">
              <img
                src={selectedImages[4]}
                alt="Last Image"
                width={300}
                height={215}
                className="object-cover w-full h-[215px]" // Fixed height
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
          )}
        </div>
      </div>

      {/* Room Selection Buttons */}
      <div className="mt-8 flex justify-center sm:justify-end gap-2 sm:pr-36 mb-10">
        <button
          onClick={() => setActiveButton(1)}
          className={`sm:px-9 sm:py-2 px-4 py-1.5 rounded-full border-[1px] border-gray-300 text-black font-medium transition-all duration-300
          ${
            activeButton === 1
              ? "bg-[#3CD9C8] text-white"
              : "bg-white hover:bg-[#3CD9C8]"
          }`}
        >
          Property
        </button>
        {property?.rooms?.map((room, index) => (
          <button
            key={index + 2}
            onClick={() => setActiveButton(index + 2)}
            className={`sm:px-9 sm:py-2 px-4 py-1.5 rounded-full border-[1px] border-gray-300 text-black font-medium transition-all duration-300
            ${
              activeButton === index + 2
                ? "bg-[#3CD9C8] text-white"
                : "bg-white hover:bg-[#3CD9C8]"
            }`}
          >
            Room {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}
