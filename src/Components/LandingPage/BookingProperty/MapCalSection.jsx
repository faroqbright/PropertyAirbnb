"use client";
import React, { useState, useEffect } from "react";
import { Circle } from "react-leaflet";
import {
  format,
  addMonths,
  subMonths,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  ShieldCheck,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "../../../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function Header() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fromProfile, setFromProfile] = useState(false);
  const router = useRouter();

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

  const [property, setProperty] = useState(null);
  const [user, setuser] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectionMade, setSelectionMade] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [review, setReview] = useState([]);
  console.log("userInfo", userInfo);

  // Initialize startDate and endDate from localStorage
  useEffect(() => {
    const storedStartDate = localStorage.getItem("startDate");
    const storedEndDate = localStorage.getItem("endDate");

    if (storedStartDate && storedEndDate) {
      // Parse dates and set time to midnight to avoid timezone issues
      const start = new Date(storedStartDate + "T00:00:00");
      const end = new Date(storedEndDate + "T00:00:00");

      setStartDate(start);
      setEndDate(end);
    }
  }, []);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        if (!userInfo?.uid || !userInfo?.userType || !propertyId) return;

        // Determine correct Firestore collection
        const collectionName =
          userInfo.userType === "LandLord" ? "LandlordReviews" : "reviews";
        const reviewsCollection = collection(db, collectionName);
        const snapshot = await getDocs(reviewsCollection);

        const reviewsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(`Fetched Reviews from ${collectionName}:`, reviewsList);

        // Match propertyId and userId
        const matchedReview = reviewsList.find(
          (r) => r.propertyId === propertyId && r.userId === userInfo.uid
        );

        console.log("Matched Review:", matchedReview);
        setReview(matchedReview || null);
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
  }, [userInfo, propertyId]);

  const handleDateClick = async (day) => {
    // Normalize the day to midnight to avoid timezone issues
    const normalizedDay = new Date(day);
    normalizedDay.setHours(0, 0, 0, 0);

    // First check if we're selecting start or end date
    if (!startDate || (startDate && endDate)) {
      setStartDate(normalizedDay);
      setEndDate(null);
      setSelectionMade(true);
      localStorage.setItem("startDate", format(normalizedDay, "yyyy-MM-dd"));
      return;
    }

    // Now we're selecting the end date
    const newEndDate = normalizedDay > startDate ? normalizedDay : startDate;
    const newStartDate = normalizedDay > startDate ? startDate : normalizedDay;

    // Check for date conflicts with existing bookings
    const hasConflict = filteredBookings.some((booking) => {
      if (!booking.startDate || !booking.endDate) return false;

      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);

      // Check if the new range overlaps with any existing booking
      return (
        (newStartDate <= bookingEnd && newEndDate >= bookingStart) ||
        (bookingStart <= newEndDate && bookingEnd >= newStartDate)
      );
    });

    if (hasConflict) {
      toast.error(
        "These dates are already booked. Please select different dates."
      );
      return;
    }

    // No conflict - proceed with date selection
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setSelectionMade(false);
    localStorage.setItem("startDate", format(newStartDate, "yyyy-MM-dd"));
    localStorage.setItem("endDate", format(newEndDate, "yyyy-MM-dd"));
    await saveDatesToFirebase();
  };

  const saveDatesToFirebase = async () => {
    if (!propertyId || !startDate || !endDate) {
      return;
    }

    try {
      const propertyRef = doc(db, "properties", propertyId);

      await updateDoc(propertyRef, {
        selectedDates: {
          startDate: format(startDate, "yyyy-MM-dd"), // Store as YYYY-MM-DD
          endDate: format(endDate, "yyyy-MM-dd"), // Store as YYYY-MM-DD
        },
      });

      toast.success("Dates saved successfully!");
    } catch (error) {
      console.error("Error saving dates to Firebase:", error);
      toast.error("Failed to save dates.");
    }
  };

  const formatDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "Select dates";

    const days = differenceInDays(endDate, startDate) + 1;
    const months = differenceInMonths(endDate, startDate);
    const years = differenceInYears(endDate, startDate);

    if (years > 0) {
      const remainingMonths = differenceInMonths(
        endDate,
        addYears(startDate, years)
      );
      const remainingDays = differenceInDays(
        endDate,
        addMonths(addYears(startDate, years), remainingMonths)
      );
      return `${years} ${years === 1 ? "year" : "years"}${
        remainingMonths > 0
          ? `, ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`
          : ""
      }${
        remainingDays > 0
          ? `, and ${remainingDays} ${remainingDays === 1 ? "day" : "days"}`
          : ""
      }`;
    } else if (months > 0) {
      const remainingDays = differenceInDays(
        endDate,
        addMonths(startDate, months)
      );
      return `${months} ${months === 1 ? "month" : "months"}${
        remainingDays > 0
          ? ` and ${remainingDays} ${remainingDays === 1 ? "day" : "days"}`
          : ""
      }`;
    } else {
      return `${days} ${days === 1 ? "day" : "days"}`;
    }
  };

  const durationText =
    startDate && endDate ? formatDuration(startDate, endDate) : "Select dates";

  const isDateInRange = (day) => {
    if (!startDate || !endDate) return false;
    return day >= startDate && day <= endDate;
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectionMade(false);

    // Clear startDate and endDate from localStorage
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
  };

  useEffect(() => {
    if (!propertyId) {
      toast.error("Error Fetching the Property");
      return;
    }
    const fetchProperty = async () => {
      try {
        const propertyRef = doc(db, "properties", propertyId);
        const propertySnap = await getDoc(propertyRef);

        if (propertySnap.exists()) {
          const propertyData = { id: propertySnap.id, ...propertySnap.data() };
          setProperty(propertyData);
          setuser(propertyData?.userId || null);
        } else {
          toast.error("Property not found!");
        }
      } catch (error) {
        toast.error("Error fetching property:", error);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const [bookings, setbookings] = useState([]);
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const bookingRef = collection(db, "bookings"); // Reference to bookings collection
        const querySnapshot = await getDocs(bookingRef);

        console.log("QuerySnapshot:", querySnapshot);

        if (!querySnapshot.empty) {
          const allBookings = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setbookings(allBookings);
          console.log("Fetched bookings:", allBookings);
        } else {
          console.error("No bookings found");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchAllBookings();
  }, []);
  // Run only when propertyId changes

  console.log("Bokkings are:", bookings);

  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    if (bookings?.length > 0) {
      const filtered = bookings.filter(
        (booking) => booking?.propertyId?.id === propertyId
      );
      setFilteredBookings(filtered);
    }
  }, [bookings, propertyId]);

  console.log("Filtered bookings are:", filteredBookings);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!user) {
        toast.error("No user ID found.");
        return;
      }

      const fetchUserDetails = async () => {
        try {
          const userRef = doc(db, "users", user);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserDetails(userSnap.data());
          } else {
            console.error("User not found!");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    }, 2000); // Delay the effect by 5 seconds

    return () => clearTimeout(timeoutId);
  }, [user]);

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

  useEffect(() => {
    if (localStorage.getItem("fromProfile")) {
      setFromProfile(true);
    }

    const handleRouteChange = () => {
      localStorage.removeItem("fromProfile");
    };

    window.addEventListener("beforeunload", handleRouteChange);
    router.events?.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
      router.events?.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  const convertTimestampToMonthYear = (timestamp) => {
    if (!timestamp?.seconds) return "Invalid Date";

    const date = new Date(timestamp.seconds * 1000);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-white px-2.5 flex flex-col items-center lg:mb-4 lg:ml-16 lg:mr-4 sm:mx-20"
    id="calendar-section">
      <div className="flex flex-col lg:flex-row items-center lg:items-start p-4 lg:py-6 lg:pl-16 gap-8 lg:gap-24 w-full max-w-screen-2xl mx-auto">
        <div className="w-full lg:w-[50%] md:space-x-4 lg:space-x-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 mx-auto lg:mr-10 order-2 mt-10 lg:mt-60">
          {fromProfile === true ? (
            <>
              {review ? (
                <div className="w-[400px] p-8 mt-14 md:mt-0 lg:mt-14 bg-[#F5F5F5] rounded-2xl shadow-sm mx-auto">
                  <h2 className="text-2xl font-semibold mb-14">Your Review</h2>
                  <div className="flex items-center space-x-4">
                    <img
                      src={review.userImage || "/assets/Small.png"}
                      alt="Shayna"
                      width={48}
                      height={48}
                      className="w-14 h-14 rounded-full"
                    />
                    <div>
                      <h3 className="text-base font-semibold">
                        {review.userName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {review.createdAt?.seconds
                          ? new Date(
                              review.createdAt.seconds * 1000
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })
                          : "Unknown Date"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-3">
                    {review.description} {review.ratings?.Description}
                  </p>
                  <button className="text-sm font-medium text-black mt-4 underline flex items-center">
                    Show more{" "}
                    <ChevronRight size={16} className="mt-[3px] ml-0.5" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No review found for this property.
                </p>
              )}
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="w-full lg:w-[70%] order-1 rounded-xl overflow-hidden relative">
          <div className="mb-20">
            <div className="flex items-left space-x-2">
              <h2 className="text-[20px] font-semibold mr-4">
                {durationText} in {property?.location}
              </h2>
            </div>
            <p className="text-sm text-gray-400 font-medium">
              {startDate && endDate
                ? `${format(startDate, "MMM d, yyyy")} - ${format(
                    endDate,
                    "MMM d, yyyy"
                  )}`
                : "Select dates"}
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
                      } ${
                        day.getTime() === startDate?.getTime() ||
                        day.getTime() === endDate?.getTime()
                          ? "bg-bluebutton text-white"
                          : isDateInRange(day)
                          ? "bg-bluebutton text-white"
                          : ""
                      }`}
                      onClick={() => handleDateClick(day)}
                    >
                      {format(day, "d")}
                    </div>
                  ))}
                </div>
                <p
                  className="text-center text-sm text-gray-400 font-medium mt-4 underline cursor-pointer pb-10"
                  onClick={clearDates}
                >
                  Clear dates
                </p>
              </div>
            </div>
          </div>
          {property?.latitude && property?.longitude ? (
            <MapContainer
              center={[property.latitude, property.longitude]}
              zoom={10}
              className="h-[400px] w-full relative z-0 rounded-xl"
              style={{ zIndex: 0 }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Circle
                center={[property.latitude, property.longitude]}
                radius={3500} // 500 meters radius
                color="#B19BD9" // Purple color
                fillColor="#B19BD9"
                fillOpacity={0.4}
              >
                <Popup>
                  <div className="rounded-lg flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Approximate location (within 500m radius)
                    </span>
                  </div>
                </Popup>
              </Circle>
              <AddZoomControl />
            </MapContainer>
          ) : (
            <div className="h-[400px] w-full flex items-center justify-center text-gray-500">
              Loading map...
            </div>
          )}

          <div className="absolute bottom-[550px] right-2 bg-white pt-1 pb-2 px-2 rounded-md shadow-lg text-left z-50 border border-gray-200">
            <button
              onClick={toggleFullScreen}
              className="mt-1 hover:underline text-xs text-gray-500 flex items-center space-x-2"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-start space-x-4 py-6 border-b">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14">
              <img
                src={userDetails?.personalInfo?.image || "/default-profile.png"}
                alt="Host Profile"
                width={56}
                height={56}
                className="w-14 h-14 object-cover rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="sm:text-[20px] text-[16px] font-semibold sm:mr-4">
                  Hosted by {userDetails?.FullName}
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
                Joined{" "}
                {userDetails?.joinedAt
                  ? convertTimestampToMonthYear(userDetails.joinedAt)
                  : "Unknown"}
              </p>

              <div className="flex -ml-8 sm:-ml-0 space-x-4 text-xs sm:text-sm text-gray-500 mt-3 mb-4">
                <span>Response rate: 100%</span>
                <span>Response time: within an hour</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
          <div className="relative w-full h-full">
            {property?.latitude && property?.longitude ? (
              <MapContainer
                center={[property.latitude, property.longitude]}
                zoom={10}
                className="h-full w-full relative z-0 rounded-xl"
                style={{ zIndex: 0 }}
                zoomControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Circle
                  center={[property.latitude, property.longitude]}
                  radius={3500} // 500 meters radius
                  color="#B19BD9" // Purple color
                  fillColor="#B19BD9"
                  fillOpacity={0.4}
                >
                  <Popup>
                    <div className="rounded-lg flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Approximate location (within 500m radius)
                      </span>
                    </div>
                  </Popup>
                </Circle>
                <AddZoomControl />
              </MapContainer>
            ) : (
              <div className="h-[400px] w-full flex items-center justify-center text-gray-500">
                Loading map...
              </div>
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
