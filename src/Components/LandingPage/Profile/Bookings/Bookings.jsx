"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export default function Bookings() {
  const [status, setStatus] = useState("ongoing");
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [isAdmin, setIsAdmin] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [propertyId, setPropertyId] = useState(null);
  const [userIds, setUserIds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (userInfo?.role === "LandLord") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsCollection = collection(db, "bookings");
        const q = query(bookingsCollection); 
  
        const snapshot = await getDocs(q);
        let bookingsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        console.log("All Bookings Fetched:", bookingsList);
  
        if (propertyId && userInfo?.uid) {
          const parsedPropertyId = typeof propertyId === 'string' ? JSON.parse(propertyId)?.id : propertyId?.id;
          console.log("Parsed Property ID:", parsedPropertyId);
          bookingsList = bookingsList.filter(
            (booking) =>
              booking.propertyId === parsedPropertyId &&
              booking.userId === userInfo.uid
          );
        }
  
        console.log("Filtered Bookings:", bookingsList);
  
        setBookings(bookingsList);
  
        const userIds = new Set(bookingsList.map((booking) => booking.userId));
        setUserIds(Array.from(userIds));
  
        if (bookingsList.length > 0) {
          const firstBooking = bookingsList[0];
          console.log("First Booking Property ID:", firstBooking.propertyId);
          setPropertyId(firstBooking.propertyId);
        }
  
        console.log("All User IDs from Properties:", Array.from(userIds));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
  
    fetchBookings();
  }, [userInfo, propertyId]);

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

  const filteredBookings = bookings.filter(
    (booking) => booking.status === status
  );

  const navigate = (booking) => {
    if (isAdmin && booking.status === "ongoing") {
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
        {filteredBookings.length === 0 ? (
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
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              onClick={(e) => {
                e.preventDefault();
                navigate(booking);
              }}
              className="flex flex-col md:flex-row items-start md:items-center md:justify-between border-b-[1.5px] last:border-b-0 py-4"
            >
              <div className="flex flex-col md:flex-row items-start gap-4 w-full">
                {isAdmin ? (
                  <Image
                    src="/assets/admin.jpeg"
                    alt="Admin picture"
                    width={150}
                    height={50}
                    className="rounded-2xl w-full md:h-[105px] h-[200px] object-cover"
                  />
                ) : (
                  <Image
                    src={booking.image || "/assets/Container1.png"}
                    alt={booking.propertyName}
                    width={150}
                    height={50}
                    className="rounded-2xl w-full md:h-[105px] h-[250px] object-cover"
                  />
                )}
                <div className="flex flex-col gap-2 w-full">
                  <h3 className="text-lg font-semibold">
                    {isAdmin ? booking.adminName : booking.propertyName}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {isAdmin
                      ? booking.rooms
                      : `${booking.selectedRooms.length} rooms for ${booking.selectedMonths} months`}
                  </p>
                  <span className="text-gray-600 font-normal text-sm">
                    {isAdmin ? booking.period : booking.propertyLocation}
                  </span>
                  <div className="border-b-[1px] md:hidden border-gray-300 w-full"></div>
                  <span className="text-lg md:hidden font-semibold">
                    ${booking.totalAmount}
                  </span>
                </div>
                <div className="flex items-center -mr-28 my-auto space-x-2">
                  <div className="md:border-l-[1px] hidden md:block border-t-[1px] border-gray-300 h-6"></div>
                  <span className="text-lg hidden md:block font-semibold">
                    ${booking.totalAmount}
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
                      booking.btntext === "Requested"
                        ? "bg-purplebutton text-white"
                        : "bg-bluebutton text-white"
                    }`}
                    onClick={() =>
                      handleButtonClick(booking.btntext || "Message")
                    }
                  >
                    {booking.btntext || "Message"}
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
