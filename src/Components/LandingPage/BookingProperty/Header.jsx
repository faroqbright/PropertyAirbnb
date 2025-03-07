"use client";
import { LayoutGrid } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "../../../firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Header() {
  const [activeButton, setActiveButton] = useState(1);
  const [fromProperties, setFromProperties] = useState(false);
  const router = useRouter();

  const headerButtons = [
    { id: 1, label: "Edit Room", bgColor: "bg-bluebutton" },
    { id: 2, label: "Inactive Room", bgColor: "bg-purplebutton" },
    { id: 3, label: "Delete Room", bgColor: "bg-red-500" },
  ];

  const buttons = [
    { id: 1, label: "Property" },
    { id: 2, label: "Room1" },
    { id: 3, label: "Room2" },
  ];

  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");
  const [property, setProperty] = useState(null);
  
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
          const propertyData = { id: propertySnap.id, ...propertySnap.data() };
          setProperty(propertyData);
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

  return (
    <>
      {fromProperties && (
        <div className="flex flex-wrap justify-center px-4 gap-4 my-9 max-w-full">
          {headerButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleHeaderButtonClick(button.id)}
              className={`h-10 min-w-[140px] w-full sm:w-[170px] text-white font-medium rounded-full ${button.bgColor} transition`}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
      <div className="container mx-auto px-4 md:px-10 lg:px-36 flex flex-col md:flex-row gap-4 relative mt-6">
        <img
          src={property?.imageUrls?.[0]}
          alt="Head Component1"
          width={610}
          height={438}
          className="object-cover w-full md:w-[300px] lg:w-[490px] h-auto rounded-xl"
        />

        <div className="grid grid-cols-2 gap-2 flex-1">
          <img
            src={property?.imageUrls?.[1]}
            alt="Head Component2"
            width={300}
            height={215}
            className="object-cover w-full h-auto"
          />
          <img
            src={property?.imageUrls?.[2]}
            alt="Head Component3"
            width={300}
            height={215}
            className="object-cover w-full h-auto"
          />
          <img
            src={property?.imageUrls?.[3]}
            alt="Head Component4"
            width={300}
            height={215}
            className="object-cover w-full h-auto"
          />

          <div className="relative w-full">
            <img
              src={property?.imageUrls?.[4]}
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
