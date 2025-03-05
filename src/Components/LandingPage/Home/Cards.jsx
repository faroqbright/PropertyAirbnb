"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import { useSelector } from "react-redux";
import { db } from "../../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper components
import "swiper/css"; // Import Swiper styles
import "swiper/css/pagination";
import { Pagination } from "swiper/modules"; // Import pagination module

const countries = [
  "France",
  "Finland",
  "Cyprus",
  "Poland",
  "Germany",
  "Spain",
  "Italy",
  "Sweden",
  "Denmark",
  "Hungary",
];

export default function Card() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(null);
  const [userType, setUserType] = useState("");
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const propertiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(propertiesData.slice(0, 8));
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const handleButtonClick = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (userInfo) {
      setUserType(userInfo?.userType);
    }
  }, [userInfo]);

  return (
    <div className="container mx-auto px-4 min-[450px]:px-10 sm:px-4 lg:px-10 py-8 mt-5">
      <div className="overflow-x-auto no-scrollbar mb-6">
        <div className="flex space-x-4">
          {countries.map((country, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(index)}
              className={`px-10 py-3 rounded-full border ${
                activeIndex === index
                  ? "bg-[#3CD9C8] text-white"
                  : "bg-white text-black"
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="relative bg-white rounded-xl overflow-hidden cursor-pointer group border"
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
                      className="h-full w-full object-cover rounded-xl"
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
              {property.isGuestFavorite && (
                <div className="absolute top-2 left-2 text-black bg-white px-2 py-1 text-sm rounded-2xl font-medium text-[14px]">
                  Guest Favourite
                </div>
              )}
            </div>

            <div className="py-4 space-y-1 px-4">
              <div className="flex items-center justify-between pr-1">
                <h2 className="text-[16px] font-medium text-[#222222]">
                  {property.location || property.name}
                </h2>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-[15px] w-[15px] text-black fill-black" />
                  <span>4.92</span>
                </div>
              </div>
              <p className="text-sm text-[#6A6A6A]">
                {property.rooms.length} rooms
              </p>
              <p className="text-sm text-[#222222]">
                ${property.pricePerMonth}/month
              </p>
            </div>
          </div>
        ))}
      </div>

      {userType !== "LandLord" && (
        <button
          onClick={() => router.push("/Landing/Home/MoreProperties")}
          className="bg-bluebutton mt-16 text-white px-6 py-2 rounded-full font-medium text-[14px] block mx-auto"
        >
          Rent New Properties
        </button>
      )}

      <button
        onClick={() => router.push("/Landing/Home/MoreProperties")}
        className="bg-bluebutton mt-16 text-white px-6 py-2 rounded-full font-medium text-[14px] block mx-auto"
      >
        Rent New Properties
      </button>
    </div>
  );
}
