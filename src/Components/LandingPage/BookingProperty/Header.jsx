"use client";
import { LayoutGrid } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "../../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const [activeButton, setActiveButton] = useState(1);
  const [fromProperties, setFromProperties] = useState(false);
  const [property, setProperty] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

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

  const selectedImages =
    activeButton === 1
      ? property?.imageUrls?.slice(0, 5)
      : property?.rooms?.[activeButton - 2]?.images?.slice(0, 5);

  const allImages =
    activeButton === 1
      ? property?.imageUrls
      : property?.rooms?.[activeButton - 2]?.images;

  return (
    <>
      <div className="container mx-auto px-4 md:px-10 lg:px-36 flex flex-col md:flex-row gap-4 relative mt-6 overflow-hidden">
        {selectedImages?.length === 1 && (
          <>
            <div className="grid grid-cols-1 gap-2 w-full">
              <img
                src={selectedImages[0]}
                alt="Main Image"
                width={610}
                height={438}
                className="object-cover w-full md:w-full lg:w-full h-[438px] rounded-xl"
              />
              <div className="relative w-full">
                <div className="absolute bottom-2 lg:bottom-4 left-1/2 transform -translate-x-1/2 w-max">
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="flex items-center sm:px-4 sm:py-2 px-2 py-1.5 rounded-lg bg-white border-[1.5px] border-black text-black shadow-md"
                  >
                    <LayoutGrid size={16} />
                    <span className="font-medium text-[12px] sm:text-[14px] ml-1.5">
                      Show all photos
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedImages?.length === 2 && (
          <>
            <div className="grid grid-cols-2 gap-2 w-full">
              {selectedImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="object-cover w-full h-[300px] rounded-xl"
                />
              ))}
              <div className="relative w-full">
                <div className="absolute bottom-2 lg:bottom-4 left-1/2 transform -translate-x-1/2 w-max">
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="flex items-center sm:px-4 sm:py-2 px-2 py-1.5 rounded-lg bg-white border-[1.5px] border-black text-black shadow-md"
                  >
                    <LayoutGrid size={16} />
                    <span className="font-medium text-[12px] sm:text-[14px] ml-1.5">
                      Show all photos
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedImages?.length === 3 && (
          <>
            <div className="grid grid-cols-3 gap-2 w-full">
              {selectedImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="object-cover w-full h-[300px] rounded-xl"
                />
              ))}
              <div className="relative w-full">
                <div className="absolute bottom-2 lg:bottom-4 left-1/2 transform -translate-x-1/2 w-max">
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="flex items-center sm:px-4 sm:py-2 px-2 py-1.5 rounded-lg bg-white border-[1.5px] border-black text-black shadow-md"
                  >
                    <LayoutGrid size={16} />
                    <span className="font-medium text-[12px] sm:text-[14px] ml-1.5">
                      Show all photos
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedImages?.length >= 4 && (
          <>
            {selectedImages?.[0] && (
              <img
                src={selectedImages[0]}
                alt="Main Image"
                width={610}
                height={438}
                className="object-cover w-full md:w-[300px] lg:w-[490px] h-[438px] rounded-xl"
              />
            )}

            <div className="grid grid-cols-2 gap-2 flex-1">
              {selectedImages?.slice(1, 5).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Image ${index + 2}`}
                  width={300}
                  height={215}
                  className="object-cover w-full h-[215px] rounded-xl"
                />
              ))}

              <div className="relative w-full">
                <div className="absolute bottom-2 lg:bottom-4 left-1/2 transform -translate-x-1/2 w-max">
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="flex items-center sm:px-4 sm:py-2 px-2 py-1.5 rounded-lg bg-white border-[1.5px] border-black text-black shadow-md"
                  >
                    <LayoutGrid size={16} />
                    <span className="font-medium text-[12px] sm:text-[14px] ml-1.5">
                      Show all photos
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

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

      {showAllPhotos && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="relative bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Show All Photos
              </h2>
              <button
                onClick={() => setShowAllPhotos(false)}
                className="text-gray-600 hover:text-black text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="object-cover w-full h-32 md:h-48 lg:h-64 rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
