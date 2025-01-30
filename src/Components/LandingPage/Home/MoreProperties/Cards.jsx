"use client";
import React, { useState, useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  ChevronDown,
  Heart,
  Maximize,
  Star,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

export default function Header() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Rating highest to lowest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const totalPages = 10;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const properties = [
    {
      id: 1,
      image: "/assets/Container.png",
      location: "Moss Beach, California",
      rooms: 5,
      price: "$39/month",
      rating: 4.92,
      favorite: false,
    },
    {
      id: 2,
      image: "/assets/Container1.png",
      location: "Moss Beach, California",
      rooms: 5,
      price: "$39/month",
      rating: 4.92,
      favorite: true,
    },
    {
      id: 3,
      image: "/assets/Container1.png",
      location: "Moss Beach, California",
      rooms: 5,
      price: "$39/month",
      rating: 4.92,
      favorite: true,
    },
  ];

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

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

  const options = [
    "Rating highest to lowest",
    "Rating lowest to highest",
    "Price highest to lowest",
    "Price lowest to highest",
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const FloatingTooltip = ({ position, text }) => {
    const map = useMap();
    const [point, setPoint] = useState(map.latLngToContainerPoint(position));

    useEffect(() => {
      const updatePosition = () => {
        setPoint(map.latLngToContainerPoint(position));
      };

      map.on("move", updatePosition);
      map.on("zoom", updatePosition);

      return () => {
        map.off("move", updatePosition);
        map.off("zoom", updatePosition);
      };
    }, [map, position]);

    return (
      <div
        className="absolute bg-white text-black font-medium px-3 py-1 rounded-full border border-gray-300 shadow"
        style={{
          left: `${point.x}px`,
          top: `${point.y}px`,
          transform: "translate(-50%, -100%)",
          position: "absolute",
          zIndex: 1000,
        }}
      >
        {text}
      </div>
    );
  };

  const tooltipData = [
    { position: [34.18223, -118.13191], text: "$200" },
    { position: [34.22223, -118.27191], text: "$220" },
    { position: [34.23223, -118.38191], text: "$275" },
    { position: [34.27223, -118.42191], text: "$310" },
  ];

  return (
    <div className="bg-white py-8 px-2.5 sm:px-5 flex flex-col items-center mb-4">
      <div className="flex flex-col lg:flex-row items-center lg:items-start p-4 lg:py-6 lg:px-20 gap-8 lg:gap-24 w-full max-w-screen-2xl mx-auto">
        <div className="w-full lg:w-[50%] order-1 rounded-lg px-0 py-6 lg:p-0">
          <div className="relative w-[220px] mb-8">
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center w-full bg-gray-100 px-4 py-2 font-medium text-[14px] rounded-full shadow-md text-black"
            >
              <span className="flex-1 text-center">{selected}</span>
              <ChevronDown className="h-4 w-4 text-teal-400" />
            </button>

            {isOpen && (
              <ul className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded-lg overflow-hidden z-50">
                {options.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => selectOption(option)}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <h1 className="text-gray-500 border-b mb-5 border-gray-300 pb-2">
            200+ Search Results
          </h1>
          {properties.map((property) => (
            <div
              key={property.id}
              className="w-full bg-white overflow-hidden mb-6"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative sm:w-1/2">
                  <img
                    src={property.image}
                    alt={property.location}
                    className="rounded-l-xl rounded-r-xl object-cover w-full h-40"
                  />
                </div>
                <div className="p-4 sm:w-1/2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[16px] font-medium text-[#222222]">
                      {property.location}
                    </h2>
                    <div className="flex items-center gap-1 text-sm -mr-3">
                      <Heart
                        className={`h-6 w-6 text-black ${
                          property.favorite
                            ? "fill-[#FDA4AF] !text-[#F86D83]"
                            : "fill-slate-50"
                        }`}
                      />
                    </div>
                  </div>
                  <p className="text-[16px] font-medium text-[#222222]">Home</p>
                  <div className="block border-b border-gray-300 w-10 pt-2"></div>

                  <p className="text-[13px] text-[#6A6A6A] pt-2">
                    {property.rooms} rooms
                  </p>
                  <div className="block border-b border-gray-300 w-10 pt-2"></div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-[13px]">
                      <span>{property.rating}</span>
                      <Star className="h-[15px] w-[15px] text-[#F5A10F] fill-[#FAC941]" />
                      (318 reviews)
                    </div>
                    <p className="text-sm text-[#222222] -mr-3">
                      <span className="font-medium text-[16px]">
                        {property.price.split("/")[0]}
                      </span>{" "}
                      <span>/{property.price.split("/")[1]}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center lg:justify-normal space-x-1 sm:space-x-2 pt-10">
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
        <div className="w-full lg:w-[50%] order-2 mt-8 lg:mt-16 rounded-xl overflow-hidden relative">
          {isClient && (
            <MapContainer
              center={[34.18223, -118.13191]}
              zoom={10}
              className="lg:h-[700px] h-[450px] w-full relative z-0"
              style={{ zIndex: 0 }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {tooltipData.map((tooltip, index) => (
                <FloatingTooltip
                  key={index}
                  position={tooltip.position}
                  text={tooltip.text}
                />
              ))}{" "}
              <AddZoomControl />
            </MapContainer>
          )}
          <div className="absolute top-2 right-2 bg-white pt-1 pb-2 px-2 rounded-md shadow-lg text-left z-50 border border-gray-200">
            <button
              onClick={toggleFullScreen}
              className="mt-1 hover:underline text-xs text-gray-500 flex items-center space-x-2"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
          <div className="relative w-full h-full">
            {isClient && (
              <MapContainer
                center={[34.18223, -118.13191]}
                zoom={12}
                className="w-full h-full"
                style={{ zIndex: 1 }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <AddZoomControl />
                {tooltipData.map((tooltip, index) => (
                  <FloatingTooltip
                    key={index}
                    position={tooltip.position}
                    text={tooltip.text}
                  />
                ))}
              </MapContainer>
            )}
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
