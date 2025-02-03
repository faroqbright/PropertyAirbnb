"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";

const bookings = [
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
    status: "previous",
    btntext: "Write Review",
  },
  {
    id: 3,
    image: "/assets/Container2.png",
    title: "Entire loft in Florence, Italy",
    details: "1 rooms for 4 Months",
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
    status: "ongoing",
    btntext: "Requested",
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
  const router = useRouter();

  const handleToggle = (newStatus) => {
    setStatus(newStatus);
  };

  const handleButtonClick = (btntext) => {
    if (btntext === "Message") {
      localStorage.setItem("fromProfile", "true");
      router.push("/Landing/Properties/PropertiesDetail");
    } else if (btntext === "Write Review") {
      router.push("/Landing/Reviews");
    }
  };

  const filteredBookings = bookings.filter(
    (booking) => booking.status === status
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

      <div className="w-full bg-white rounded-xl border-[1.5px] border-gray-200 px-6 pt-1 pb-4">
        {filteredBookings.length === 0 ? (
          <p className="text-center text-gray-500">
            No bookings available for this status.
          </p>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col md:flex-row items-start md:items-center md:justify-between border-b-[1.5px] last:border-b-0 py-4"
            >
              <div className="flex flex-col md:flex-row items-start gap-4 w-full">
                <Image
                  src={booking.image}
                  alt={booking.title}
                  width={150}
                  height={50}
                  className="rounded-2xl w-full md:h-[105px] h-[250px] object-cover"
                />
                <div className="flex flex-col gap-2 w-full">
                  <h3 className="text-lg font-semibold">{booking.title}</h3>
                  <p className="text-gray-500 text-sm">{booking.details}</p>
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
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
