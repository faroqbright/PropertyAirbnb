"use client";
import { Check, Star } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function Bookings({ id }) {
  const [checkedItems, setCheckedItems] = useState([true, true, true, true, true]);
  const [booking, setBooking] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedTabs, setSelectedTabs] = useState([]);


  const handleToggle = (index) => {
    setCheckedItems((prevState) => {
      const updatedCheckedItems = [...prevState];
      updatedCheckedItems[index] = !updatedCheckedItems[index];
      return updatedCheckedItems;
    });
  };


  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!id || typeof id !== "string") return; // Ensure id is valid

      try {
        const bookingRef = doc(db, "bookings", id);
        const bookingSnapshot = await getDoc(bookingRef);

        if (bookingSnapshot.exists()) {
          setBooking({ id: bookingSnapshot.id, ...bookingSnapshot.data() });
        } else {
          console.log("No such booking found!");
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const user = useSelector((state) => state.auth.userInfo);
  useEffect(() => {
    setIsAdmin(user?.role === "LandLord");
    setUserInfo(user);
  }, []);

  const totalCost =
    Number(booking?.propertyPrice || 0) + Number(booking?.totalAmount || 0);
  const totalValue = totalCost.toFixed(2);

  const handleButtonClick = async (btntext, bookingId) => {
    const bookingRef = doc(db, "bookings", bookingId);

    if (btntext === "Reject") {
      try {
        await deleteDoc(bookingRef);
        console.log("Booking deleted successfully");
        // Update the booking state to reflect the deletion
        setBooking((prevBooking) => ({ ...prevBooking, status: "deleted" }));
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    } else if (btntext === "Accept") {
      try {
        const bookingSnapshot = await getDoc(bookingRef);
        if (!bookingSnapshot.exists()) {
          console.error("No such document exists!");
          return;
        }
        await updateDoc(bookingRef, {
          status: "ongoing",
          startDate: bookingSnapshot.data().startDate,
          endDate: bookingSnapshot.data().endDate,
        });
        console.log("Booking status updated to ongoing");
        setBooking((prevBooking) => ({ ...prevBooking, status: "ongoing" }));
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    } else if (btntext === "OnGoing") {
      try {
        const bookingSnapshot = await getDoc(bookingRef);
        if (!bookingSnapshot.exists()) {
          console.error("No such document exists!");
          return;
        }
        await updateDoc(bookingRef, {
          status: "completed",
        });
        console.log("Booking status updated to completed");
        
        setBooking((prevBooking) => ({ ...prevBooking, status: "completed" }));
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    } else {
      router.push("/Landing/Profile/Details?id=" + bookingId);
    }
  };

  if (!booking) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="min-h-screen p-4 md:p-10 lg:p-20">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-xl border-[1.5px] border-gray-200 px-6 pt-1 pb-4 mb-1">
        <div className="container p-2 mb-5">
          <div className="w-full h-auto flex flex-col md:flex-row justify-between">
            <div className="left flex gap-5 mb-4 md:mb-0 flex-col md:flex-row">
              {booking?.selectedRooms && booking.selectedRooms.length > 0 && (
                <div className="w-full md:w-52">
                  <Swiper
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    className="h-full w-full"
                  >
                    {booking?.selectedRooms?.map((room, roomIndex) =>
                      room.images?.map((imgUrl, imgIndex) => (
                        <SwiperSlide key={`room-${roomIndex}-img-${imgIndex}`}>
                          <img
                            src={imgUrl}
                            alt={`Room ${roomIndex + 1} Image ${imgIndex + 1}`}
                            className="rounded-2xl h-[200px] md:h-[105px] w-full object-cover"
                          />
                        </SwiperSlide>
                      ))
                    )}
                  </Swiper>
                </div>
              )}
              <div className="container pr-5 py-2">
                <p className="text-textclr font-bold md:w-full text-center md:text-left">
                  {booking.FullName}
                </p>
                <p className="text-textclr text-md md:w-full text-center md:text-left">
                  {booking.propertyName} in {booking.propertyLocation}
                </p>
                <p className="text-textclr text-sm md:w-full text-center md:text-left">
                  {booking.selectedRooms.length} rooms
                </p>
              </div>
            </div>

            <div className="price w-full md:w-40 flex items-center justify-center md:justify-end pl-5">
              <div className="border-l-2 hidden md:block border-gray-300 h-10 text-center"></div>
              <p className="text-textclr -ml-5 md:-ml-0 md:pl-5">
                ${booking.totalAmount}
              </p>
            </div>
            <div className="right w-full md:w-40 flex items-center justify-center mt-4">
              {isAdmin && booking.status === "completed" ? (
                <button
                  className="px-4 py-2 md:w-44 w-44 text-sm font-medium rounded-full bg-bluebutton text-white"
                  onClick={() => handleButtonClick("Give User Review")}
                >
                  Give User Review
                </button>
              ) : isAdmin && booking.status === "pending" ? (
                <div className="flex flex-col items-center gap-2 px-4 py-2 text-sm font-medium rounded-full">
                  <button
                    className="w-32 px-4 py-2 text-sm font-medium rounded-full bg-bluebutton text-white"
                    onClick={() => handleButtonClick("Accept", booking.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="w-32 px-4 py-2 text-sm font-medium rounded-full bg-black text-white"
                    onClick={() => handleButtonClick("Reject", booking.id)}
                  >
                    Reject
                  </button>
                </div>
              ) : isAdmin && booking.status === "ongoing" ? (
                <button
                  className="px-4 py-2 md:w-44 w-44 text-sm font-medium rounded-full bg-bluebutton text-white"
                  onClick={() => handleButtonClick("OnGoing", booking.id)}
                >
                  OnGoing
                </button>
              ) : (
                <button
                  className={`px-4 py-2 md:w-32 w-52 text-sm font-medium rounded-full ${
                    booking.btntext === "Requested"
                      ? "bg-purplebutton text-white"
                      : "bg-bluebutton text-white"
                  }`}
                  onClick={() =>
                    handleButtonClick(booking.btntext || "Message", booking.id)
                  }
                >
                  {booking.btntext || "Message"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 h-[1px] mb-5"></div>
        <div className="flex flex-col md:flex-row w-full">
          <div className="md:w-[50%] lg:w-[70%] w-full mb-5 md:mb-0">
            <ul>
              {Object.entries(booking?.userPersonalInfo || {})
                .filter(([key]) => !["sexOrientation", "image"].includes(key))
                .map(([key, value]) => {
                  const shouldRender = Array.isArray(value)
                    ? value.length > 0
                    : value;

                  return (
                    shouldRender && (
                      <li key={key} className="mb-5">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-cyan-400 text-xl">•</span>
                            <p className="text-textclr font-medium capitalize">
                              {key.replace(/([A-Z])/g, " $1")}
                            </p>
                          </div>
                          <div className="flex gap-3 ml-5 mt-2 flex-wrap">
                            {Array.isArray(value) ? (
                              value.map((item, index) => (
                                <button
                                  key={index}
                                  className={`border-gray-200 border-[1px] px-5 py-[2px] rounded-3xl text-[15px] ${
                                    selectedTabs.includes(item)
                                      ? "bg-purplebutton text-white border-purplebutton cursor-pointer"
                                      : "bg-gray-100 text-gray-500 border-gray-200 cursor-pointer"
                                  }`}
                                  onClick={() => handleSelect(item)}
                                >
                                  {item}
                                </button>
                              ))
                            ) : (
                              <button
                                className={`border-gray-200 border-[1px] px-5 py-[2px] rounded-3xl text-[15px] ${
                                  selectedTabs.includes(value)
                                    ? "bg-purplebutton text-white border-purplebutton cursor-pointer"
                                    : "bg-gray-100 text-gray-500 border-gray-200 cursor-pointer"
                                }`}
                                onClick={() => handleSelect(value)}
                              >
                                {value}
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  );
                })}
            </ul>
          </div>
          <div className="md:w-[60%] lg:w-[50%] w-full rounded-3xl bg-purplebutton p-5">
            <div className="container px-5">
              <div className="flex justify-between items-center">
                <div className="w-1/2 flex items-center">
                  <p className="pr-1 font-semibold text-lg text-white">
                    ${booking.propertyPrice}
                  </p>
                  <p className="text-md text-white">/ {booking.numberOfDays} days{" "}</p>
                </div>
                <div className="flex gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <p className="text-md text-white">5.0</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-white">•</span>
                    <p className="underline text-md text-white">7 reviews</p>
                  </div>
                </div>
              </div>

              <div className="h-[1px] w-full bg-purple-300 my-5"></div>

              <ul>
                {[
                  ...(booking?.selectedRooms || []),
                  ...(booking?.selectedServices || []),
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 mb-2">
                    <div className="flex justify-between w-full items-center">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={checkedItems[index]}
                            onChange={() => handleToggle(index)}
                          />
                          <div
                            className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
                              checkedItems[index] ? "bg-white" : "border-white"
                            }`}
                          >
                            {checkedItems[index] && (
                              <Check className="text-bluebutton w-4 h-4" />
                            )}
                          </div>
                        </label>
                        <label
                          htmlFor="plan"
                          className="cursor-pointer text-white"
                        >
                          {item.name}
                        </label>
                      </div>
                      <div>
                        <p className="text-white">${item.price}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="h-[1px] w-full bg-purple-300 my-5"></div>
              <div className="flex justify-between">
                <p className="text-white">Total</p>
                <h2 className="font-bold text-xl items-center text-white">
                  ${totalValue}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
