"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { IoClose } from "react-icons/io5";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const UpdateCenterOnMove = ({ setPropertyData }) => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      setPropertyData({
        latitude: center.lat,
        longitude: center.lng,
      });
    },
  });

  useEffect(() => {
    const center = map.getCenter();
    setPropertyData({
      latitude: center.lat,
      longitude: center.lng,
    });
  }, [map, setPropertyData]);

  return null;
};

const CenterMarkerIcon = () => (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -100%)",
      zIndex: 1000,
      pointerEvents: "none",
    }}
  >
    <img
      src={customIcon.options.iconUrl}
      alt="Center Marker"
      style={{
        width: customIcon.options.iconSize[0],
        height: customIcon.options.iconSize[1],
      }}
    />
  </div>
);

const MapModal = ({ isOpen, onClose }) => {
  const [propertyData, setPropertyData] = useState({
    longitude: "",
    latitude: "",
  });
  const [userLocation, setUserLocation] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null); // ✅ new state
  const mapRef = useRef();

  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setPropertyData({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, [isOpen]);

  const handleSave = () => {
    setSavedLocation({
      latitude: propertyData.latitude,
      longitude: propertyData.longitude,
    });

  };

  if (!isOpen || !userLocation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Select From Map</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 relative">
          <MapContainer
            center={userLocation}
            zoom={13}
            className="h-[400px] w-full rounded-xl"
            style={{ zIndex: 0 }}
            zoomControl={false}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <UpdateCenterOnMove setPropertyData={setPropertyData} />
          </MapContainer>

          <CenterMarkerIcon />

          <div className="mt-4 space-y-2">
            <p>Latitude: {propertyData.latitude}</p>
            <p>Longitude: {propertyData.longitude}</p>

            <button
              onClick={handleSave}
              className="mt-2 px-4 py-2 bg-bluebutton rounded-full text-white flex justify-center transition"
            >
              Save Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
