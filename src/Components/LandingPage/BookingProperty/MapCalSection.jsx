"use client";
import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import CustomMarkerImg from "../../../../public/assets/Icon Button.png";
import "leaflet/dist/leaflet.css";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  ShieldCheck,
  Star,
} from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleMonthChange = (month) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      months.indexOf(month),
      1
    );
    setCurrentMonth(newDate);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const weekStart = startOfWeek(monthStart);
  const weekEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const AddZoomControl = () => {
    const map = useMap();

    useEffect(() => {
      if (!map || typeof window === "undefined") return;

      const zoomInButton = L.DomUtil.create("button", "leaflet-bar");
      const zoomOutButton = L.DomUtil.create("button", "leaflet-bar");

      zoomOutButton.innerHTML = `
        <div class="flex items-center justify-center rounded-full w-8 h-8 bg-white hover:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-black" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <g id="Interface / Magnifying_Glass_Minus">
              <path id="Vector" d="M7 10H13M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>
        </div>`;
      zoomOutButton.onclick = () => map.zoomOut();

      zoomInButton.innerHTML = `
      <div class="flex items-center justify-center rounded-full w-8 h-8 bg-white hover:bg-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="text-black" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <g id="Interface / Magnifying_Glass_Plus">
            <path id="Vector" d="M7 10H10M10 10H13M10 10V7M10 10V13M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </svg>
      </div>`;
      zoomInButton.onclick = () => map.zoomIn();

      const zoomControl = L.control({ position: "bottomright" });
      zoomControl.onAdd = () => {
        const container = L.DomUtil.create("div", "leaflet-zoom");
        container.appendChild(zoomOutButton);
        container.appendChild(zoomInButton);
        return container;
      };
      zoomControl.addTo(map);

      return () => {
        map.removeControl(zoomControl);
      };
    }, [map]);

    return null;
  };

  const customIcon = L.icon({
    iconUrl: "/assets/Icon Button.png",
    iconSize: [33, 35],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });

  return (
    <div className="bg-white px-2.5 flex flex-col items-center lg:mb-4 lg:ml-16 lg:mr-4 sm:mx-20 lg:-mt-40">
      <div className="flex flex-col lg:flex-row items-center lg:items-start p-4 lg:py-6 lg:pl-16 gap-8 lg:gap-24 w-full max-w-screen-2xl mx-auto">
        <div className="w-full lg:w-[50%] md:space-x-4 lg:space-x-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 mx-auto lg:mr-10 order-2 mt-10 lg:mt-60">
          <div className="2xl:max-w-xl xl:max-w-md max-w-sm p-8 bg-[#F5F5F5] rounded-2xl shadow-sm mx-auto">
            <h2 className="text-2xl font-semibold mb-14">Client Review</h2>
            <div className="flex items-center space-x-4">
              <Image
                src="/assets/Small.png"
                alt="Shayna"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h3 className="text-base font-semibold">Shayna</h3>
                <p className="text-sm text-gray-500">December 2021</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-3">
              Wonderful neighborhood, easy access to restaurants and the subway,
              cozy studio apartment with a super comfortable bed. Great host,
              super helpful and responsive. Cool murphy bed...
            </p>
            <button className="text-sm font-medium text-black mt-4 underline flex items-center">
              Show more <ChevronRight size={16} className="mt-[3px] ml-0.5" />
            </button>
          </div>
          <div className="2xl:max-w-xl xl:max-w-md max-w-sm p-8 mt-14 md:mt-0 lg:mt-14 bg-[#F5F5F5] rounded-2xl shadow-sm mx-auto">
            <h2 className="text-2xl font-semibold mb-14">Your Review</h2>
            <div className="flex items-center space-x-4">
              <Image
                src="/assets/Small.png"
                alt="Shayna"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h3 className="text-base font-semibold">Shayna</h3>
                <p className="text-sm text-gray-500">December 2021</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-3">
              Wonderful neighborhood, easy access to restaurants and the subway,
              cozy studio apartment with a super comfortable bed. Great host,
              super helpful and responsive. Cool murphy bed...
            </p>
            <button className="text-sm font-medium text-black mt-4 underline flex items-center">
              Show more <ChevronRight size={16} className="mt-[3px] ml-0.5" />
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[70%] order-1 rounded-xl overflow-hidden relative">
          <MapContainer
            center={[34.18223, -118.13191]}
            zoom={10}
            className="h-[400px] w-full relative z-0"
            style={{ zIndex: 0 }}
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[34.18223, -118.13191]} icon={customIcon}>
              <Popup>
                <div className="rounded-lg flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Exact location provided after booking
                  </span>
                </div>
              </Popup>
            </Marker>
            <AddZoomControl />
          </MapContainer>
          <div className="absolute top-2 right-2 bg-white pt-1 pb-2 px-2 rounded-md shadow-lg text-left z-50 border border-gray-200">
            <button
              onClick={toggleFullScreen}
              className="mt-1 hover:underline text-xs text-gray-500 flex items-center space-x-2"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-start space-x-4 py-6 border-b">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14">
              <Image
                src="/assets/Small.png"
                alt="Host Profile"
                width={56}
                height={56}
                className="rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="sm:text-[20px] text-[16px] font-semibold sm:mr-4">
                  Hosted by Ghazal
                </h2>
                <div className="sm:flex hidden items-center sm:text-[13px] text-[11px] text-gray-500">
                  <Star className="sm:w-4 sm:h-4 w-3 h-3 text-purple-500 mr-1 mb-0.5" />
                  12 Reviews
                </div>
                <div className="sm:flex hidden items-center sm:text-[13px] text-[11px] text-gray-500">
                  <ShieldCheck className="sm:w-4 sm:h-4 w-3 h-3 text-purple-500 mr-1" />
                  Identity verified
                </div>
              </div>
              <div className="flex items-center space-x-2 my-1.5">
                <div className="sm:hidden flex items-center sm:text-[13px] text-[11px] text-gray-500">
                  <Star className="sm:w-4 sm:h-4 w-3 h-3 text-purple-500 mr-1 mb-0.5" />
                  12 Reviews
                </div>
                <div className="sm:hidden flex items-center sm:text-[13px] text-[11px] text-gray-500">
                  <ShieldCheck className="sm:w-4 sm:h-4 w-3 h-3 text-purple-500 mr-1" />
                  Identity verified
                </div>
              </div>
              <p className="text-sm text-gray-400 font-medium">
                Joined May 2021
              </p>
              <div className="flex -ml-8 sm:-ml-0 space-x-4 text-xs sm:text-sm text-gray-500 mt-3 mb-4">
                <span>Response rate: 100%</span>
                <span>Response time: within an hour</span>
              </div>
              <div className="flex space-x-2 mt-2 -ml-12 sm:-ml-0">
                <button className="px-8 py-1.5 border rounded-full text-gray-500">
                  Gym
                </button>
                <button className="px-6 py-1.5 border rounded-full text-gray-500">
                  Running
                </button>
              </div>
            </div>
          </div>
          <div className="my-8">
            <div className="flex items-left space-x-2">
              <h2 className="text-[20px] font-semibold mr-4">
                2 months in New York
              </h2>
            </div>
            <p className="text-sm text-gray-400 font-medium">
              Feb 19, 2022 - Feb 26, 2022
            </p>
            <div className="max-w-2xl mx-auto bg-[#F9F9F9] rounded-lg shadow-md ml-2 mt-6 flex">
              <div className="w-1/4 mr-4 hidden sm:block bg-white rounded-lg shadow-lg">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => handleMonthChange(month)}
                    className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-md ${
                      format(currentMonth, "MMMM") === month
                        ? "bg-bluebutton text-white"
                        : "text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
              <div className="sm:w-3/4 w-full p-10 sm:p-0 md:px-6 px-3 sm:pt-16">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">
                    {format(currentMonth, "MMMM yyyy")}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePrevMonth}
                      className="text-bluebutton"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="text-bluebutton"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-sm font-medium text-gray-500 text-center"
                      >
                        {day}
                      </div>
                    )
                  )}
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`text-center hover:bg-bluebutton rounded-full hover:text-white cursor-pointer py-3 text-sm ${
                        isSameMonth(day, currentMonth)
                          ? "text-black"
                          : "text-gray-300"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-400 font-medium mt-4 underline cursor-pointer">
                  Clear dates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
          <div className="relative w-full h-full">
            <MapContainer
              center={[34.18223, -118.13191]}
              zoom={12}
              className="w-full h-full"
              style={{ zIndex: 1 }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[34.18223, -118.13191]} icon={customIcon}>
                <Popup>
                  <div className="rounded-lg flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Exact location provided after booking
                    </span>
                  </div>
                </Popup>
              </Marker>
              <AddZoomControl />
            </MapContainer>

            <button
              onClick={toggleFullScreen}
              className="absolute top-4 right-4 bg-white py-2 px-4 rounded-full text-gray-800 font-semibold shadow-md hover:bg-gray-100"
              style={{ zIndex: 1000 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
