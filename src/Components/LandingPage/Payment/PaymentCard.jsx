"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import {
  CreditCard,
  Banknote,
  Info,
  Calendar,
  Nfc,
  ArrowRight,
  ChevronDown,
  Check,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function PaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const router = useRouter();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState(null);
  const [price, setPrice] = useState(null);
  const [location, setLocation] = useState(null);
  const [roomPrices, setRoomPrices] = useState({});
  const [servicePrices, setServicePrices] = useState({});
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [propertyId, setPropertyId] = useState(null);
  const userId = useSelector((state) => state.auth.userInfo?.uid);
  const FullName = useSelector((state) => state.auth.userInfo?.FullName);



  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("selectedRooms")) || [];
    const storedServices =
      JSON.parse(localStorage.getItem("selectedServices")) || [];
    const storedProperty = JSON.parse(localStorage.getItem("propertyDetails"));
    const storedMonths =
      JSON.parse(localStorage.getItem("selectedMonths")) || 1;
    const storedPropertyId = localStorage.getItem("selectedProperty");

    if (storedProperty) {
      setName(storedProperty.name);
      setLocation(storedProperty.location);
      setPrice(storedProperty.pricePerMonth);

      const roomPrices = {};
      storedProperty?.rooms?.forEach((room, index) => {
        roomPrices[`room-${index + 1}`] = room.price;
      });
      setRoomPrices(roomPrices);

      const servicePrices = {};
      storedProperty?.additionalCosts?.forEach((service, index) => {
        servicePrices[`service-${index + 1}`] = service.cost;
      });
      setServicePrices(servicePrices);
    }

    setSelectedRooms(storedRooms);
    setSelectedServices(storedServices);
    setSelectedMonths(storedMonths);
    setPropertyId(JSON.parse(storedPropertyId));

    const total = calculateTotal(storedRooms, storedServices);
    setTotalAmount(total);
  }, []);

  const calculateTotal = (rooms, services) => {
    const roomsTotal = rooms.reduce((sum, room) => sum + Number(room.price), 0);
    const servicesTotal = services.reduce(
      (sum, service) => sum + Number(service.price),
      0
    );
    return roomsTotal + servicesTotal;
  };

  const handlePayNow = async () => {
    setPaymentSubmitted(true);

    console.log("property id is", propertyId);
    console.log("user id is", userId);
    const startDate=localStorage.getItem("startDate");
    const endDate=localStorage.getItem("endDate");


    const bookingDetails = {
      propertyId,
      userId,
      propertyName: name,
      propertyLocation: location,
      selectedRooms,
      selectedServices,
      totalAmount: totalAmount * selectedMonths,
      selectedMonths,
      paymentMethod,
      timestamp: new Date(),
      status: "pending",
      FullName: FullName,
      startDate,
      endDate,
    };

    try {
      const docRef = await addDoc(collection(db, "bookings"), bookingDetails);
      console.log("Booking saved with ID: ", docRef.id);
      setPaymentSubmitted(true);
      localStorage.removeItem("startDate");
      localStorage.removeItem("endDate");
    } catch (e) {
      console.error("Error saving booking: ", e);
    }
  };

  return (
    <>
      {!paymentSubmitted ? (
        <div className="flex gap-6 p-6 min-h-screen items-center justify-center flex-col lg:flex-row">
          <div className="bg-white p-10 rounded-2xl w-full h-auto lg:h-[400px] border">
            <h2 className="text-2xl font-semibold mb-8 lg:mb-4">
              Select Payment Method
            </h2>
            <div className="flex flex-wrap justify-center gap-4 md:gap-2 mb-6 text-[13px] mx-auto lg:text-[14px] w-full max-w-4xl">
              <button
                className={`flex items-center justify-center gap-2 w-full md:w-[30%] px-4 md:px-3 text-nowrap md:py-1.5 py-2 rounded-full border ${
                  paymentMethod === "credit-card"
                    ? "bg-bluebutton text-white"
                    : "bg-white text-gray-500"
                }`}
                onClick={() => setPaymentMethod("credit-card")}
              >
                <CreditCard size={18} /> Credit Card
              </button>
              <button
                className={`flex items-center justify-center gap-2 w-full md:w-[33%] px-4 py-2 md:px-3 text-nowrap md:py-1.5 rounded-full border ${
                  paymentMethod === "bank-transfer"
                    ? "bg-bluebutton text-white"
                    : "bg-white text-gray-500"
                }`}
                onClick={() => setPaymentMethod("bank-transfer")}
              >
                <Banknote size={18} /> Bank Transfer
              </button>
              <button
                className={`flex items-center justify-center gap-2 w-full md:w-[30%] px-4 py-2 md:px-3 md:py-1.5 rounded-full border ${
                  paymentMethod === "paypal"
                    ? "bg-bluebutton text-white"
                    : "bg-white text-gray-500"
                }`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <Nfc size={18} /> Paypal
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] mb-2 ml-1 font-medium">
                  Name on Card
                </label>
                <input
                  className="w-full px-2 py-1.5 border rounded-full pl-6"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block text-sm text-[13px] mb-2 ml-1 font-medium">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    className="w-full px-2 py-1.5 border rounded-full pl-6 pr-10"
                    placeholder="xxxx xxxx xxxx xxxx"
                  />
                  <Calendar
                    className="absolute right-3 top-2.5 text-gray-400"
                    size={18}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-4xl mx-auto">
                <div className="w-full md:w-1/3">
                  <label className="block text-sm text-[13px] mb-2 ml-1 font-medium">
                    Month
                  </label>
                  <div className="relative">
                    <div
                      className="w-full px-2 text-[15px] py-1.5 border rounded-full text-gray-500 cursor-pointer flex items-center justify-between"
                      onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                    >
                      Select Month
                      <ChevronDown size={16} />
                    </div>
                    {showMonthDropdown && (
                      <ul className="absolute z-10 w-full border bg-white mt-2 rounded-md">
                        <li className="p-2 hover:bg-gray-200 cursor-pointer">
                          January
                        </li>
                        <li className="p-2 hover:bg-gray-200 cursor-pointer">
                          February
                        </li>
                        <li className="p-2 hover:bg-gray-200 cursor-pointer">
                          March
                        </li>
                        <li className="p-2 hover:bg-gray-200 cursor-pointer">
                          April
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-1/3">
                  <label className="block text-sm text-[13px] mb-2 ml-1 font-medium">
                    Year
                  </label>
                  <div className="relative">
                    <div
                      className="w-full text-[15px] px-2 py-1.5 border rounded-full text-gray-500 cursor-pointer flex items-center justify-between"
                      onClick={() => setShowYearDropdown(!showYearDropdown)}
                    >
                      Select Year
                      <ChevronDown size={16} />
                    </div>
                    {showYearDropdown && (
                      <ul className="absolute z-10 w-full border bg-white mt-2 rounded-md">
                        <li className="p-2 hover:bg-gray-200 cursor-pointer">
                          2023
                        </li>
                        <li className="p-2 hover:bg-gray-200 cursor-pointer">
                          2024
                        </li>
                        <li className="p-2 hover:bg-gray-200 cursor-pointer">
                          2025
                        </li>
                        <li className="p-2 hover:bg-gray-200 cursor-pointer">
                          2026
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-1/3">
                  <label className="text-sm text-[13px] mb-2 ml-1 font-medium flex items-center gap-1">
                    CVV
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-2 text-[15px] py-1.5 border rounded-full text-gray-500 pl-6 pr-10"
                      placeholder="xxx"
                    />
                    <div className="absolute right-3 top-2.5 text-gray-400">
                      <Info size={17} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purplebutton text-white p-6 rounded-2xl w-full lg:w-[600px] h-[500px] flex flex-col justify-between">
            <div>
              <h2 className="text-[20px] font-semibold mb-5 border-b border-white/30 pb-3">
                Booking Summary
              </h2>
              <div className="flex justify-between text-[17px] font-medium">
                <p>{location}</p>
                <span className="text-2xl mb-1 -mt-1">
                  ${totalAmount * selectedMonths}
                </span>
              </div>
              <p className="text-[13px] mt-2 opacity-80 pb-1">{name}</p>
              <div className="mt-4 text-[13px] space-y-2 border-t border-white/30 pt-6">
                <span>
                  ${totalAmount} x {selectedMonths} month{" "}
                  {selectedMonths > 1 ? "s" : " "}
                </span>
                {selectedRooms.map((room) => (
                  <p key={room.id} className="flex justify-between">
                    <span>{room.name}</span> <span>${room.price}</span>
                  </p>
                ))}
                {selectedServices.map((service) => (
                  <p key={service.id} className="flex justify-between">
                    <span>{service.name}</span> <span>${service.price}</span>
                  </p>
                ))}
              </div>
            </div>
            <div className="flex justify-center ">
              <button
                onClick={handlePayNow}
                className="w-44 bg-bluebutton text-white py-2 rounded-full flex items-center justify-center gap-2"
              >
                Pay Now <ArrowRight className="ml-2" size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[100vh] flex justify-center items-center mx-10 sm:mx-0">
          <div className="flex items-center justify-center w-full max-w-md mx-auto sm:p-10 p-6 rounded-3xl bg-[#B19BD9] text-white text-center">
            <div className="flex flex-col items-center justify-center">
              <p className="md:text-[20px] text-[17px] font-medium mb-4">
                Booking has been submitted successfully!
              </p>
              <div className="flex items-center md:mt-5 mt-3 mb-2 justify-center md:w-24 md:h-24 w-20 h-20 rounded-full border-2 border-white p-2">
                <Check size={60} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
