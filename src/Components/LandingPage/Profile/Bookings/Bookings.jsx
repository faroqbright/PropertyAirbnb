"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { collection, query, getDocs, updateDoc, doc } from "firebase/firestore"; 
import { db } from "@/firebase/firebaseConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Image from "next/image";

export default function Bookings() {
  const [status, setStatus] = useState("ongoing");
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 3;

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
    setCurrentPage(1);
  };

  const handleButtonClick = async (btntext, bookingId) => {
    if (btntext === "Message") {
      localStorage.setItem("fromProfile", "true");
      router.push("/Landing/Properties/PropertiesDetail");
    } else if (btntext === "Write Review") {
      router.push("/Landing/Reviews");
    } else if (isAdmin && btntext === "Give User Review") {
      router.push("/Landing/Profile/Details/Reviews");
    } else if (btntext === "Reject") {
      try {
        await deleteDoc(doc(db, "bookings", bookingId));
        setBookings(bookings.filter((booking) => booking.id !== bookingId));
        console.log("Booking deleted successfully");
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    } else if (btntext === "Accept") {
      try {
        await updateDoc(doc(db, "bookings", bookingId), {
          status: "ongoing",
        });

        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "ongoing" }
              : booking
          )
        );

        console.log("Booking status updated to ongoing");
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    } else if (btntext === "OnGoing") {
      try {
        await updateDoc(doc(db, "bookings", bookingId), {
          status: "completed",
        });

        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "completed" }
              : booking
          )
        );

        console.log("Booking status updated to completed");
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingStatus = booking.status.toLowerCase();
    if (status === "ongoing") {
      return bookingStatus === "pending" || bookingStatus === "ongoing";
    } else if (status === "previous") {
      return bookingStatus === "completed";
    }
    return false;
  });

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

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
          paginatedBookings.map((bookings) => (
            <div
              key={bookings.id}
              className="flex flex-col md:flex-row items-start md:items-center md:justify-between border-b-[1.5px] last:border-b-0 py-4"
            >
              <div className="flex flex-col md:flex-row items-start gap-4 w-full">
                {bookings?.selectedRooms &&
                  bookings.selectedRooms.length > 0 && (
                    <div className="w-52">
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

                <div
                  onClick={() =>
                    router.push(`/Landing/Profile/Details?id=${bookings.id}`)
                  }
                  className="flex flex-col gap-2 w-full cursor-pointer"
                >
                  <h3 className="text-lg font-semibold ">
                    {isAdmin ? bookings.FullName : bookings.FullName}
                  </h3>

                  <p className="text-gray-500 text-sm ">
                    {bookings?.selectedRooms?.length || 0} rooms
                  </p>

                  <span className="text-gray-600 font-normal text-sm ">
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
                ) : isAdmin && bookings.status === "pending" ? (
                  <div className="flex flex-col items-center gap-2 px-4 py-2 text-sm font-medium rounded-full">
                    <button
                      className="w-32 px-4 py-2 text-sm font-medium rounded-full bg-bluebutton text-white"
                      onClick={() => handleButtonClick("Accept", bookings.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="w-32 px-4 py-2 text-sm font-medium rounded-full bg-black text-white"
                      onClick={() => handleButtonClick("Reject", bookings.id)}
                    >
                      Reject
                    </button>
                  </div>
                ) : isAdmin && bookings.status === "ongoing" ? (
                  <button
                    className="px-4 py-2 md:w-44 w-44 text-sm font-medium rounded-full bg-bluebutton text-white"
                    onClick={() => handleButtonClick("OnGoing", bookings.id)}
                  >
                    OnGoing
                  </button>
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
      {filteredBookings.length > bookingsPerPage && (
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
          {[...Array(totalPages).keys()]
            .slice(
              Math.max(0, currentPage - 3),
              Math.min(totalPages, currentPage + 2)
            )
            .map((page) => (
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
      )}
    </>
  );
}
