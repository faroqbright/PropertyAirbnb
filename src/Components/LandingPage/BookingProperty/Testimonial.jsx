import React, { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "../../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import {
  Bath,
  BedDouble,
  BicepsFlexed,
  Bolt,
  Cat,
  ChartArea,
  CircleParking,
  Dog,
  Dumbbell,
  Flower2,
  HeartHandshake,
  House,
  Settings,
  Shield,
  WashingMachine,
  WavesLadder,
} from "lucide-react";

export default function Testimonial() {

  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");
  const [property, setProperty] = useState(null);

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
          const propertyData = { id: propertySnap.id, ...propertySnap.data() };
          setProperty(propertyData);
        } else {
          console.error("Property not found!");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const namesArray = [
    "Primary Services",
    "Swimming Pool",
    "Vigilance",
    "Maintenance",
    "House Keeping",
    "Parking",
    "Own Bathroom",
    "Roof Garden",
    "Cat Friendly",
    "Laundry",
    "Common Areas",
    "Gym",
    "Co Working",
    "Dog",
    "LGBT+coLivers",
    "Double Bed",
  ];

  const iconsArray = [
    <Settings size={18} />,
    <WavesLadder size={18} />,
    <Shield size={18} />,
    <Bolt size={18} />,
    <House size={18} />,
    <CircleParking size={18} />,
    <Bath size={18} />,
    <Flower2 size={18} />,
    <Cat size={18} />,
    <WashingMachine size={18} />,
    <ChartArea size={18} />,
    <Dumbbell size={18} />,
    <BicepsFlexed size={18} />,
    <Dog size={18} />,
    <HeartHandshake size={18} />,
    <BedDouble size={18} />,
  ];

  const icons = property?.amenities?.map((amenity) => {
    const index = namesArray.indexOf(amenity);
    return index !== -1 ? { icon: iconsArray[index], text: amenity } : null;
  }).filter(Boolean); // Filter out any null values

  return (
    <div className="bg-[#FAFAFA] p-6 my-12 text-center">
      <span className="flex justify-center text-black font-bold text-[28px] mt-4">
        What this place offers
      </span>

      <div className="flex justify-center items-center my-10">
        <div className="grid min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
          {icons?.map((icon, index) => (
            <div
              key={index}
              className="flex items-center justify-center border-[1px] border-gray-300 p-4 rounded-full px-8 py-2"
            >
              {icon.icon}
              <p className="text-[14px] font-medium text-[#828282] ml-2 text-nowrap">
                {icon.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}