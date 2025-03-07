"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

const adminBookings = [
  {
    id: 1,
    adminName: "Hasaan Saleem",
    rooms: "3 rooms",
    period: "Feb 19, 2022 - Feb 26, 2022",
    price: "$120",
    status: "ongoing",
  },
  {
    id: 2,
    adminName: "Ali Raza",
    rooms: "2 rooms",
    period: "Mar 01, 2022 - Mar 10, 2022",
    price: "$200",
    status: "ongoing",
  },
  {
    id: 3,
    adminName: "Sara Khan",
    rooms: "4 rooms",
    period: "Apr 15, 2022 - Apr 22, 2022",
    price: "$300",
    status: "ongoing",
  },
  {
    id: 4,
    adminName: "Zara Ahmed",
    rooms: "5 rooms",
    period: "Jan 10, 2022 - Jan 17, 2022",
    price: "$500",
    status: "previous",
  },
  {
    id: 5,
    adminName: "Usman Ali",
    rooms: "1 room",
    period: "Dec 01, 2021 - Dec 07, 2021",
    price: "$150",
    status: "previous",
  },
  {
    id: 6,
    adminName: "Ayaz Khan",
    rooms: "3 rooms",
    period: "Nov 20, 2021 - Nov 27, 2021",
    price: "$250",
    status: "previous",
  },
];

const userBookings = [
  {
    id: 1,
    image: "/assets/Container1.png",
    title: "Entire loft in Florence, Italy",
    details: "5 rooms for 4 Months",
    price: "$100",
    status: "ongoing",
    btntext: "Message",
  },
  {
    id: 2,
    image: "/assets/Container3.png",
    title: "Entire loft in Florence, Italy",
    details: "2 rooms for 4 Months",
    price: "$120",
    status: "ongoing",
    btntext: "Message",
  },
  {
    id: 3,
    image: "/assets/Container2.png",
    title: "Entire loft in Florence, Italy",
    details: "1 room for 4 Months",
    price: "$150",
    status: "ongoing",
    btntext: "Message",
  },
  {
    id: 4,
    image: "/assets/Container4.png",
    title: "Entire loft in Florence, Italy",
    details: "5 rooms for 2 Months",
    price: "$220",
    status: "previous",
    btntext: "Write Review",
  },
  {
    id: 5,
    image: "/assets/Container5.png",
    title: "Entire loft in Florence, Italy",
    details: "1 room for 2 Months",
    price: "$250",
    status: "previous",
    btntext: "Write Review",
  },
  {
    id: 6,
    image: "/assets/Container6.png",
    title: "Entire loft in Florence, Italy",
    details: "3 rooms for 4 Months",
    price: "$160",
    status: "previous",
    btntext: "Write Review",
  },
];

export default function Bookings() {
  const [status, setStatus] = useState("ongoing");
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [isAdmin, setIsAdmin] = useState(true);
  const router = useRouter();
  const handleToggle = (newStatus) => {
    setStatus(newStatus);
  };

  useEffect(() => {
    if (userInfo?.role === "LandLord") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [userInfo]);

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

  const filteredBookings = isAdmin
    ? adminBookings.filter((booking) => booking.status === status)
    : userBookings.filter((booking) => booking.status === status);

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

      <div className={`w-full ${userInfo.email ? "bg-[#f8f8f8]" : "bg-white"} rounded-xl border-[1.5px] border-gray-200 px-6 pt-1 pb-4`}>
        {userInfo.email ? (
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
                    src={booking.image}
                    alt={booking.title}
                    width={150}
                    height={50}
                    className="rounded-2xl w-full md:h-[105px] h-[250px] object-cover"
                  />
                )}
                <div className="flex flex-col gap-2 w-full">
                  <h3 className="text-lg font-semibold">
                    {isAdmin ? booking.adminName : booking.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {isAdmin ? booking.rooms : booking.details}
                  </p>
                  <span className="text-gray-600 font-normal text-sm">
                    {isAdmin ? booking.period : ""}
                  </span>
                  <div className="border-b-[1px] md:hidden border-gray-300 w-full"></div>
                  <span className="text-lg md:hidden font-semibold">
                    {booking.price}
                  </span>
                </div>
                <div className="flex items-center -mr-28 my-auto space-x-2">
                  <div className="md:border-l-[1px] hidden md:block border-t-[1px] border-gray-300 h-6"></div>
                  <span className="text-lg hidden md:block font-semibold">
                    {booking.price}
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
                    onClick={() => handleButtonClick(booking.btntext)}
                  >
                    {booking.btntext}
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
