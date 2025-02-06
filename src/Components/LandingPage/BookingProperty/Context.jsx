"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Star, Check } from "lucide-react";

export default function Context() {
  const [selectedRooms, setSelectedRooms] = useState("room1");
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState([]);
  const [buttonText, setButtonText] = useState("Reserve");
  const [fromProfile, setFromProfile] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("fromProfile")) {
      setButtonText("Message");
      setFromProfile(true);
    }

    const handleRouteChange = () => {
      localStorage.removeItem("fromProfile");
    };

    window.addEventListener("beforeunload", handleRouteChange);
    router.events?.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
      router.events?.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  const handleButtonClick = () => {
    if (fromProfile) {
      router.push("/Landing/Profile");
    } else {
      router.push("/Landing/Properties/PropertiesDetail/Payment");
    }
    localStorage.removeItem("fromProfile");
  };

  const rooms = [
    { id: "room1", name: "Room 1", price: 555 },
    { id: "room2", name: "Room 2", price: 62 },
    { id: "room3", name: "Room 3", price: 83 },
  ];

  const services = [
    { id: "parking", name: "Parking lot", price: 555 },
    { id: "primary", name: "Primary Services", price: 62 },
    { id: "maintenance", name: "Maintenance", price: 83 },
  ];

  const calculateTotal = () => {
    const roomsTotal = rooms
      .filter((room) => selectedRooms.includes(room.id))
      .reduce((sum, room) => sum + room.price, 0);

    const servicesTotal = services
      .filter((service) => selectedServices.includes(service.id))
      .reduce((sum, service) => sum + service.price, 0);

    return roomsTotal + servicesTotal;
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-10 lg:pr-20 lg:pl-32 min-[450px]:px-8 px-4 sm:px-28 pb-10 md:pb-0 lg:mx-0">
      <div className="lg:w-[60%] w-full px-3">
        <h1 className="font-bold text-black text-[24px] sm:text-[26px]">
          Entire loft in Florence, Italy
        </h1>
        <div className="mt-2">
          <p className="font-medium text-gray-600 text-[16px] sm:text-[18px]">
            The House of Books, chic with City View
          </p>
        </div>
        <div className="mt-8">
          <p className="text-gray-600 sm:text-[14px] text-[13px]">
            Come and stay in this superb duplex T2, in the heart of the historic
            center of Bordeaux. Spacious and bright, in a real Bordeaux building
            in exposed stone, you will enjoy all the charms of the city thanks
            to its ideal location. Close to many shops, bars and restaurants,
            you can access the apartment by tram A and C and bus routes 27 and
            44. ...
          </p>
        </div>

        <div className="mt-5 flex justify-start gap-2 border-gray-400 border-b pb-10">
          <button className="flex items-center space-x-1 hover:underline text-black font-semibold">
            <span>Show more</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="lg:w-[40%] w-full bg-[#B19BD9] text-white rounded-2xl p-6 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-5 border-gray-300">
          <div className="text-2xl font-medium">
            $75{" "}
            <span className="text-lg text-gray-200 font-normal">/ month</span>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
            <span>5.0</span>
            <span className="text-purple-200">· 7 reviews</span>
          </div>
        </div>

        <div className="space-y-3 pt-5">
          {rooms.map((room) => (
            <label
              key={room.id}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRooms.includes(room.id)}
                    onChange={(e) => {
                      setSelectedRooms(
                        e.target.checked
                          ? [...selectedRooms, room.id]
                          : selectedRooms.filter((id) => id !== room.id)
                      );
                    }}
                    className="hidden"
                  />
                  <span
                    className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all duration-200 ease-in-out ${
                      selectedRooms.includes(room.id)
                        ? "bg-white text-[#3CD9C8]"
                        : "bg-[#B19BD9]"
                    }`}
                  >
                    {selectedRooms.includes(room.id) && (
                      <Check className="w-5 h-5" />
                    )}
                  </span>
                </label>
                <span className="text-[15px] font-medium">{room.name}</span>
              </div>
              <span className="text-[15px] font-medium">${room.price}</span>
            </label>
          ))}
        </div>

        <div className="space-y-2 rounded-lg bg-purple-300 px-4 py-3 my-5">
          {services.map((service) => (
            <label
              key={service.id}
              className="relative flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedServices.includes(service.id)}
                onChange={(e) => {
                  setSelectedServices(
                    e.target.checked
                      ? [...selectedServices, service.id]
                      : selectedServices.filter((id) => id !== service.id)
                  );
                }}
                className="hidden"
              />
              <span
                className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all duration-200 ease-in-out ${
                  selectedServices.includes(service.id)
                    ? "bg-white text-[#3CD9C8]"
                    : "bg-[#B19BD9]"
                }`}
              >
                {selectedServices.includes(service.id) && (
                  <Check className="w-5 h-5" />
                )}
              </span>
              <div className="flex items-center gap-2 ml-3">
                <span className="text-[15px] font-medium">{service.name}</span>
                <span className="text-[15px] font-medium">
                  ${service.price}
                </span>
              </div>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 mb-5 border-t border-gray-300">
          <span className="font-medium text-[16px]">Total</span>
          <span className="text-xl font-bold">${calculateTotal()}</span>
        </div>

        <button
          onClick={handleButtonClick}
          className="w-full cursor-pointer bg-bluebutton text-white rounded-full py-2"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}