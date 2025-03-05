"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Heart,
  Star,
} from "lucide-react";
import { db } from "../../../firebase/firebaseConfig"; // Import Firebase db
import { collection, getDocs } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper components
import "swiper/css"; // Import Swiper styles
import "swiper/css/pagination";
import { Pagination } from "swiper/modules"; 

export default function Card() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const propertiesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(propertiesList);
      } catch (error) {
        console.error("Error fetching properties: ", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="container mx-auto px-4 min-[450px]:px-10 sm:px-4 lg:px-10 py-8 mt-5 mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="relative bg-white rounded-xl overflow-hidden cursor-pointer group"
            onClick={() =>
              router.push(
                `/Landing/Properties/PropertiesDetail?id=${property.id}`
              )
            }
          >
            <div className="relative h-[270px] w-full overflow-hidden">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                className="h-full w-full"
              >
                {property.imageUrls.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={property.name}
                      className="h-full w-full object-cover rounded-xl"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Heart
                className={`absolute top-2 right-2 h-6 w-6 text-white ${
                  property.favorite
                    ? "fill-[#FDA4AF] text-[#F86D83]"
                    : "fill-transparent/25"
                }`}
              />
            </div>

            <div className="py-4 space-y-1">
              <div className="flex items-center justify-between pr-1">
                <h2 className="text-[16px] font-medium text-[#222222]">
                  {property.location || property.name}
                </h2>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-[15px] w-[15px] text-black fill-black" />
                  <span>{property.rating || "N/A"}</span>
                </div>
              </div>
              <p className="text-sm text-[#6A6A6A]">
                {property.rooms?.length || 0} rooms
              </p>
              <p className="text-sm text-[#222222]">
                ${property.pricePerMonth}/month
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-1 sm:space-x-2 pt-10">
        <button
          className="p-2 hidden sm:block rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          onClick={() => goToPage(1)}
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          onClick={() => goToPage(currentPage - 1)}
        >
          <ChevronLeft size={18} />
        </button>
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className={`w-8 h-8 rounded-full border ${
              currentPage === page
                ? "bg-teal-400 text-white"
                : "border-gray-300 bg-white hover:bg-gray-100"
            }`}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}
        <span className="px-2">...</span>
        <button
          className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          onClick={() => goToPage(totalPages)}
        >
          {totalPages}
        </button>
        <button
          className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          onClick={() => goToPage(currentPage + 1)}
        >
          <ChevronRight size={18} />
        </button>
        <button
          className="p-2 hidden sm:block rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          onClick={() => goToPage(totalPages)}
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}
