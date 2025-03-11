"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { IoClose } from "react-icons/io5";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const CenterMarker = () => {
  const map = useMap();

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
      }}
    >
      <img
        src={customIcon.options.iconUrl}
        alt="Marker"
        style={{
          width: customIcon.options.iconSize[0],
          height: customIcon.options.iconSize[1],
        }}
      />
    </div>
  );
};

const MapModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Select From Map</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <MapContainer
            center={[34.18223, -118.13191]}
            zoom={10}
            className="h-[400px] w-full relative z-0 rounded-xl"
            style={{ zIndex: 0 }}
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <CenterMarker />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapModal;