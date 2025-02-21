"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useState } from "react";

const properties = [
  {
    id: 1,
    image: "/assets/Container.png",
    location: "Moss Beach, California",
    rooms: 5,
    price: "$39/month",
    rating: 4.92,
    favorite: false,
    isGuestFavorite: false,
  },
  {
    id: 2,
    image: "/assets/Container1.png",
    location: "Moss Beach, California",
    rooms: 5,
    price: "$39/month",
    rating: 4.92,
    favorite: true,
    isGuestFavorite: true,
  },
  {
    id: 3,
    image: "/assets/Container2.png",
    location: "Moss Beach, California",
    rooms: 5,
    price: "$39/month",
    rating: 4.92,
    favorite: false,
    isGuestFavorite: false,
  },
  {
    id: 4,
    image: "/assets/Container3.png",
    location: "Moss Beach, California",
    rooms: 5,
    price: "$39/month",
    rating: 4.92,
    favorite: false,
    isGuestFavorite: false,
  },
  {
    id: 5,
    image: "/assets/Container4.png",
    location: "Moss Beach, California",
    rooms: 5,
    price: "$39/month",
    rating: 4.92,
    favorite: true,
    isGuestFavorite: true,
  },
  {
    id: 6,
    image: "/assets/Container5.png",
    location: "Moss Beach, California",
    rooms: 5,
    price: "$39/month",
    rating: 4.92,
    favorite: true,
    isGuestFavorite: true,
  },
  {
    id: 7,
    image: "/assets/Container6.png",
    location: "Moss Beach, California",
    rooms: 6,
    price: "$39/month",
    rating: 4.92,
    favorite: true,
    isGuestFavorite: true,
  },
  {
    id: 8,
    image: "/assets/Container7.png",
    location: "Moss Beach, California",
    rooms: 6,
    price: "$39/month",
    rating: 4.92,
    favorite: false,
    isGuestFavorite: false,
  },
];

const countries = ["France", "Finland", "Cyprus", "Poland", "Germany", "Spain", "Italy", "Sweden", "Denmark", "Hungary"];

export default function Card() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(null); // State to track the active button
  const handleButtonClick = (index) => {
    setActiveIndex(index); // Set the clicked button as active
  };

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
            className="relative bg-white rounded-xl overflow-hidden cursor-pointer group"
          >
            <div className="relative h-[270px] w-full overflow-hidden">
              <Image
                src={property.image}
                alt={property.location}
                layout="fill"
                className="rounded-xl group-hover:scale-105 transition-transform object-cover"
              />
              <Heart
                className={`absolute top-2 right-2 h-6 w-6 text-white ${
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

            <div className="py-4 space-y-1">
              <div className="flex items-center justify-between pr-1">
                <h2 className="text-[16px] font-medium text-[#222222]">
                  {property.location}
                </h2>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-[15px] w-[15px] text-black fill-black" />
                  <span>{property.rating}</span>
                </div>
              </div>
              <p className="text-sm text-[#6A6A6A]">{property.rooms} rooms</p>
              <p className="text-sm text-[#222222]">{property.price}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => router.push("/Landing/Home/MoreProperties")}
        className="bg-bluebutton mt-16 text-white px-6 py-2 rounded-full font-medium text-[14px] block mx-auto"
      >
        Rent New Properties
      </button>
    </div>
  );
}
