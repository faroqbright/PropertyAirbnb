"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Bookings() {
  const [status, setStatus] = useState("ongoing");
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const router = useRouter();

  console.log("Bookings", bookings);
  console.log("userInfo", userInfo);

  useEffect(() => {
    setIsAdmin(userInfo?.role === "LandLord");
  }, [userInfo]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const propertiesCollection = collection(db, "properties");
        const propertiesSnapshot = await getDocs(propertiesCollection);
        const propertiesList = propertiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Properties Fetched:", propertiesList);

        const bookingsCollection = collection(db, "bookings");
        const q = query(bookingsCollection);
        const snapshot = await getDocs(q);
        let bookingsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("All Bookings Fetched:", bookingsList);

        if (isAdmin) {
          bookingsList = bookingsList.filter((booking) => {
            try {
              console.log("Booking Property ID:", booking.propertyId);

              const propertyIdObj =
                typeof booking.propertyId === "string"
                  ? JSON.parse(booking.propertyId)
                  : booking.propertyId;

              console.log("Parsed Property ID Object:", propertyIdObj);
              console.log("Property User ID:", propertyIdObj.userId);
              console.log("Logged-in User ID:", userInfo?.uid);

              return propertyIdObj.userId === userInfo?.uid;
            } catch (error) {
              console.error("Error parsing propertyId:", error);
              return false;
            }
          });
        }

        console.log("Filtered Bookings:", bookingsList);
        setBookings(bookingsList);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [userInfo, isAdmin]);

  const handleToggle = (newStatus) => {
    setStatus(newStatus);
  };

  const handleButtonClick = (btntext) => {
    if (btntext === "Message") {
      localStorage.setItem("fromProfile", "true");
      router.push("/Landing/Properties/PropertiesDetail");
    } else if (btntext === "Write Review") {
      router.push("/Landing/Reviews");
    } else if (isAdmin && btntext === "Give User Review") {
      router.push("/Landing/Profile/Details/Reviews");
    }
  };

  const navigate = (bookings) => {
    if (isAdmin && bookings.status === "ongoing") {
      router.push("/Landing/Profile/Details");
    }
  };

  return (
    <>
      <div className="flex justify-end space-x-2 mb-5 lg:-mt-20">
        <button
          className={`px-4 w-32 py-2.5 text-sm font-medium rounded-full ${
            status === "ongoing"
              ? "bg-purplebutton text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => handleToggle("ongoing")}
        >
          OnGoing
        </button>
        <button
          className={`px-4 w-32 py-2.5 text-sm font-medium rounded-full ${
            status === "previous"
              ? "bg-purplebutton text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => handleToggle("previous")}
        >
          Previous
        </button>
      </div>

      <div
        className={`w-full ${
          userInfo?.email ? "bg-[#f8f8f8]" : "bg-white"
        } rounded-xl border-[1.5px] border-gray-200 px-6 pt-1 pb-4`}
      >
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 ">
            <Image
              src="/assets/notFound.jpeg"
              alt="No Bookings"
              width={300}
              height={300}
              className="object-contain"
            />
            <p className="mt-4 text-lg font-semibold text-gray-600">
              No Bookings Found
            </p>
          </div>
        ) : (
          bookings.map((bookings) => (
            <div
              key={bookings.id}
              onClick={(e) => {
                e.preventDefault();
                navigate(bookings);
              }}
              className="flex flex-col md:flex-row items-start md:items-center md:justify-between border-b-[1.5px] last:border-b-0 py-4"
            >
              <div className="flex flex-col md:flex-row items-start gap-4 w-full">
                {bookings?.selectedRooms &&
                  bookings.selectedRooms.length > 0 && (
                    <div className="w-72">
                      <Swiper
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        className="h-full w-full"
                      >
                        {bookings.selectedRooms.map((room, roomIndex) =>
                          room.images?.map((imgUrl, imgIndex) => (
                            <SwiperSlide
                              key={`room-${roomIndex}-img-${imgIndex}`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Room ${roomIndex + 1} Image ${
                                  imgIndex + 1
                                }`}
                                className="rounded-2xl h-[200px] md:h-[105px] w-full object-cover"
                              />
                            </SwiperSlide>
                          ))
                        )}
                      </Swiper>
                    </div>
                  )}

                <div className="flex flex-col gap-2 w-full">
                  <h3 className="text-lg font-semibold">
                    {isAdmin ? bookings.FullName : bookings.FullName}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {bookings?.selectedRooms?.length || 0} rooms
                  </p>

                  <span className="text-gray-600 font-normal text-sm">
                    {new Date(bookings?.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(bookings?.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>

                  <div className="border-b-[1px] md:hidden border-gray-300 w-full"></div>

                  <span className="text-lg md:hidden font-semibold">
                    ${bookings?.totalAmount}
                  </span>
                </div>

                <div className="flex items-center -mr-28 my-auto space-x-2">
                  <div className="md:border-l-[1px] hidden md:block border-t-[1px] border-gray-300 h-6"></div>
                  <span className="text-lg hidden md:block font-semibold">
                    ${bookings?.totalAmount}
                  </span>
                </div>
              </div>

              <div className="flex justify-center md:justify-end w-full mt-4 md:mt-0">
                {isAdmin && status === "previous" ? (
                  <button
                    className="px-4 py-2 md:w-44 w-44 text-sm font-medium rounded-full bg-bluebutton text-white"
                    onClick={() => handleButtonClick("Give User Review")}
                  >
                    Give User Review
                  </button>
                ) : isAdmin ? (
                  <div className="flex flex-col items-center gap-2 px-4 py-2 text-sm font-medium rounded-full">
                    <button
                      className="w-32 px-4 py-2 text-sm font-medium rounded-full bg-bluebutton text-white"
                      onClick={() => handleButtonClick("Accept")}
                    >
                      Accept
                    </button>
                    <button
                      className="w-32 px-4 py-2 text-sm font-medium rounded-full bg-black text-white"
                      onClick={() => handleButtonClick("Reject")}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <button
                    className={`px-4 py-2 md:w-32 w-52 text-sm font-medium rounded-full ${
                      bookings.btntext === "Requested"
                        ? "bg-purplebutton text-white"
                        : "bg-bluebutton text-white"
                    }`}
                    onClick={() =>
                      handleButtonClick(bookings.btntext || "Message")
                    }
                  >
                    {bookings.btntext || "Message"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
