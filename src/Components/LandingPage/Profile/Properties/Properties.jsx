"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import NewRoom from "../Room/NewRoom";
import { useSelector } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const initialProperties = [
  {
    id: 1,
    img: "/assets/propertiesImage.jpeg",
    title: "Entire loft in Florence, Italy",
    rooms: "Room1",
    price: "$120",
    status: "Available",
  },
  {
    id: 2,
    img: "/assets/propertiesImage.jpeg",
    title: "Entire loft in Florence, Italy",
    rooms: "Room2",
    price: "$120",
    status: "Inactive",
  },
  {
    id: 3,
    img: "/assets/propertiesImage.jpeg",
    title: "Entire loft in Florence, Italy",
    rooms: "Room3",
    price: "$120",
    status: "Booked",
  },
];

export default function Properties({ newRoomOpen, setNewRoomOpen }) {
  const [action, setAction] = useState("View");
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [properties, setProperties] = useState(initialProperties);
  const [userType, setUserType] = useState("");
  const propertiesPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const router = useRouter();

  const handleActionChange = (newAction) => {
    setAction(newAction);
    setNewRoomOpen(true);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Available":
        return {
          bgColor: "bg-gray-50",
          textColor: "text-black",
          borderColor: "border-gray-50",
        };
      case "Inactive":
        return {
          bgColor: "bg-white",
          textColor: "text-black",
          borderColor: "border-gray-200",
        };
      case "Booked":
        return {
          bgColor: "bg-white",
          textColor: "text-purplebutton",
          borderColor: "border-purple-300",
        };
      default:
        return {
          bgColor: "bg-gray-50",
          textColor: "text-black",
          borderColor: "border-purple-50",
        };
    }
  };

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

  useEffect(() => {
    if (userInfo) {
      setUserType(userInfo?.userType);
    }
  }, [userInfo]);

  const handleButtonClick = (status) => {
    localStorage.setItem("FromProperties", "true");
    let route;
    switch (status) {
      case "Available":
        route = "/Landing/Properties/PropertiesDetail";
        break;
      case "Inactive":
        route = "/Landing/Properties/PropertiesDetail";
        break;
      case "Booked":
        route = "/Landing/Properties/PropertiesDetail";
        break;
      default:
        route = "/Landing/Properties/PropertiesDetail";
    }
    router.push(route);
  };

  const CustomButton = ({ label, status }) => {
    const { bgColor, textColor, borderColor } = getStatusStyles(status);

    return (
      <button
        className={`text-sm font-medium border-[2px] rounded-full px-4 py-1 w-full md:w-32 ${borderColor} ${bgColor} ${textColor}`}
        onClick={() => handleButtonClick(status)}
      >
        {label}
      </button>
    );
  };

  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const currentProperties = properties.slice(startIndex, endIndex);

  return (
    <>
      {newRoomOpen ? (
        <div className="w-full p-6 -mt-12">
          <NewRoom />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 space-x-0 md:space-x-2 mb-5 lg:-mt-20 ">
            <div className="flex items-center px-5  w-full md:w-[325px] h-[46px] gap-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purplebutton">
              <Search className="h-5 w-5 text-black" />
              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-full focus:outline-none"
              />
            </div>
            <div className="flex space-x-2 w-full md:w-auto mt-2 md:mt-0">
              <button
                className={`px-4 w-full md:w-40 py-2.5 text-sm font-medium rounded-full text-nowrap ${
                  action === "Add New Property"
                    ? "bg-bluebutton text-white"
                    : "bg-bluebutton text-white"
                }`}
                onClick={() => handleActionChange("Add New Room")}
              >
                Add New Property
              </button>
            </div>
          </div>

          <div
            className={`w-full ${
              userInfo.email ? "bg-[#f8f8f8]" : "bg-white"
            } rounded-xl border-[1.5px] border-gray-200 px-4 pt-1 pb-4`}
          >
            {!userInfo.email ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Image
                  src="/assets/notFound.jpeg"
                  alt="No Properties"
                  width={300}
                  height={300}
                  className="object-contain"
                />
                <p className="mt-4 text-lg font-semibold text-gray-600">
                  No Properties Exist
                </p>
              </div>
            ) : (
              <>
                {currentProperties.map((property) => {
                  const price =
                    typeof property.price === "object"
                      ? property.price.amount || "$0"
                      : property.price || "$0";
                  const img =
                    typeof property.img === "object"
                      ? property.img.url || "/assets/default-image.jpeg"
                      : property.img || "/assets/default-image.jpeg";

                  return (
                    <div
                      key={property.id}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 border-b last:border-none"
                    >
                      <div className="w-full md:w-64 h-36 2xl:h-44 mb-4 md:mb-0 overflow-hidden rounded-lg flex-shrink-0">
                        {property?.imageUrls &&
                        Array.isArray(property.imageUrls) ? (
                          <Swiper
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            className="w-full h-full rounded-lg"
                          >
                            {property?.imageUrls?.map((image, index) => (
                              <SwiperSlide key={index}>
                                <img
                                  src={image}
                                  alt={property.name || "Property Image"}
                                  className="w-full h-full object-cover"
                                />
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        ) : (
                          <img
                            src={img}
                            alt={property.name || "Property Image"}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-grow md:ml-4">
                        <div className="flex flex-col gap-2 w-full">
                          <h3 className="text-lg font-semibold breal-words">
                            {property?.name || "No Title"}{" "}
                            {property?.location || "No Location"}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {property.rooms?.length || 0} rooms{" "}
                          </p>
                          <div className="border-b-[1px] md:hidden border-gray-300 w-full mt-2"></div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-center justify-between mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                        <div className="lg:mr-10 mr-2 xl:mr-28 flex justify-center items-center">
                          <div className="flex flex-row md:flex-col gap-2 mr-4">
                            <Edit2 className="w-6 h-6 rounded-full border-green-500 fill-green-500 border-[1px] p-1 text-green-500 cursor-pointer" />
                            <Trash2 className="w-6 h-6 rounded-full border-red-500 fill-red-500 border-[1px] p-1 text-red-500 cursor-pointer" />
                          </div>
                          <div className="md:border-l-[1px] hidden mr-4 md:block border-t-[1px] border-gray-300 h-10"></div>
                          <span className="text-lg hidden md:block font-semibold">
                            <p className="text-sm text-[#222222]">
                              ${property.pricePerMonth}/month
                            </p>
                          </span>
                        </div>
                        <CustomButton
                          label={property.status || "No Status"}
                          status={property.status || "No Status"}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
          <div className="flex items-center justify-end space-x-1 sm:space-x-2 mt-7">
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
            {[...Array(totalPages).keys()].slice(0, 5).map((page) => (
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
            {totalPages > 5 && <span className="px-2">...</span>}
            {totalPages > 5 && (
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
        </>
      )}
    </>
  );
}
