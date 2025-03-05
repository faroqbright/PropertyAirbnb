"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Heart,
  Star,
} from "lucide-react";
import { db } from "../../../firebase/firebaseConfig"; 
import { collection, getDocs } from "firebase/firestore"; 
import { Swiper, SwiperSlide } from "swiper/react"; 
import "swiper/css"; 
import "swiper/css/pagination"; 
import { Pagination } from "swiper/modules"; 

export default function Card() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;
  const [properties, setProperties] = useState([]);
  const [totalProperties, setTotalProperties] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const propertiesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(propertiesList);
        setTotalProperties(propertiesList.length);
      } catch (error) {
        console.error("Error fetching properties: ", error);
      }
    };

    fetchProperties();
  }, []);

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(totalProperties / propertiesPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto px-4 min-[450px]:px-10 sm:px-4 lg:px-10 py-8 mt-5 mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProperties.map((property) => (
          <div
            key={property.id}
            className="relative bg-white rounded-xl overflow-hidden cursor-pointer group border"
            onClick={() =>
              router.push(
                `/Landing/Properties/PropertiesDetail?id=${property.id}`
              )
            }
          >
            <div className="relative h-[200px] w-full overflow-hidden">
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
                      className="h-full w-full object-cover rounded-t-xl"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Heart
                className={`absolute top-2 right-2 h-6 w-6 text-black ${
                  property.favorite
                    ? "fill-[#FDA4AF] text-[#F86D83]"
                    : "fill-transparent/25"
                }`}
              />
            </div>

            <div className="py-6 space-y-1 px-4">
              <div className="flex items-center justify-between pr-1">
                <h2 className="text-[16px] font-medium text-[#222222]">
                  {property.location || property.name}
                </h2>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-[15px] w-[15px] text-black fill-black" />
                  <span>{property.rating || "4.92"}</span>
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
          disabled={currentPage === 1}
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={18} />
        </button>
        {[...Array(totalPages).keys()].slice(0, 12).map((page) => (
          <button
            key={page + 1}
            className={`w-8 h-8 rounded-full border ${
              currentPage === page + 1
                ? "bg-teal-400 text-white"
                : "border-gray-300 bg-white hover:bg-gray-100"
            }`}
            onClick={() => goToPage(page + 1)}
          >
            {page + 1}
          </button>
        ))}
        {totalPages > 3 && <span className="px-2">...</span>}
        {totalPages > 3 && (
          <button
            className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
            onClick={() => goToPage(totalPages)}
          >
            {totalPages}
          </button>
        )}
        <button
          className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={18} />
        </button>
        <button
          className="p-2 hidden sm:block rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}