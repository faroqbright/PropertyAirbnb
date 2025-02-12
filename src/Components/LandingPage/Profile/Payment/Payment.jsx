"use client";
import React, { useState } from "react";
import { ArrowRightLeft, CreditCard, Info } from "lucide-react";
import { FaPaypal } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState("Credit");

  const handleSelect = (method) => {
    setSelectedMethod(method);
  };

  const router = useRouter();

  const handleClick = () => {
    router.push("/Landing/Home");
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-around m-5">
        <div className="bg-white rounded-xl border-[1.5px] border-gray-200 mb-4 py-10 px-8">
          <h1 className="text-textclr">Select Payment Method</h1>

          <div className="flex flex-col lg:flex-row justify-around mb-5">
            <div className="flex flex-col lg:flex-row lg:justify-between gap-5 mt-10">
              {/* Credit Button */}
              <button
                className={`flex items-center justify-center px-10 py-2 rounded-full relative ${
                  selectedMethod === "Credit"
                    ? "bg-bluebutton text-white"
                    : "border border-gray-500 text-gray-500"
                }`}
                onClick={() => handleSelect("Credit")}
              >
                <CreditCard className="mr-2" size={20} /> Credit
              </button>

              {/* Bank Transfer Button */}
              <button
                className={`flex items-center justify-center px-10 py-2 rounded-full relative ${
                  selectedMethod === "BankTransfer"
                    ? "bg-bluebutton text-white"
                    : "border border-gray-500 text-gray-500"
                }`}
                onClick={() => handleSelect("BankTransfer")}
              >
                <ArrowRightLeft className="mr-2" size={20} /> Bank Transfer
              </button>

              {/* Paypal Button */}
              <button
                className={`flex items-center justify-center px-10 py-2 rounded-full relative ${
                  selectedMethod === "Paypal"
                    ? "bg-bluebutton text-white"
                    : "border border-gray-500 text-gray-500"
                }`}
                onClick={() => handleSelect("Paypal")}
              >
                <FaPaypal className="mr-2" size={20} /> Paypal
              </button>
            </div>
          </div>

          <div className="mt-10">
            <label className="text-textclr">Name</label>
            <br />
            <input
              type="text"
              placeholder="Write Here"
              className="border-2 py-2 rounded-full w-full pl-5 mt-3"
            />
          </div>

          <div className="mt-10">
            <label className="text-textclr block mb-2">Name on Card</label>
            <div className="relative">
              <input
                type="text"
                placeholder="xxxx xxxx xxxx xxxx"
                className="border-2 py-2 rounded-full w-full pl-5 pr-12 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <CreditCard
                className="absolute right-4 top-3.5 text-gray-500"
                size={20}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-10">
            <div className="flex-1 min-w-[120px]">
              <label className="text-textclr block mb-2">Month</label>
              <select className="border-2 py-2 rounded-full w-full pl-4">
                <option>Select Month</option>
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="text-textclr block mb-2">Year</label>
              <select className="border-2 py-2 rounded-full w-full pl-4">
                <option>Select Year</option>
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="text-textclr block mb-2">CVV</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="123"
                  className="border-2 py-2 rounded-full w-full pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Info
                  className="absolute right-3 top-3.5 text-gray-500"
                  size={16}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#B19BD9] rounded-2xl h-[450px] p-8 lg:w-96 w-full">
          <h1 className="text-white text-xl font-semibold mb-4">
            Booking Summary
          </h1>
          <div className="bg-white h-[0.5px] mb-12"></div>
          <div className="mb-16">
            <label className="block text-lg font-medium mb-2 text-white">
              Withdraw Amount
            </label>
            <input
              type="text"
              placeholder="Write here"
              className="w-full py-2 text-white px-4 rounded-full bg-[#B19BD9] border-[1.5px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="bg-white h-[0.5px] mb-16"></div>
          <button
            className="w-full py-3 bg-teal-400 text-white font-medium rounded-full flex items-center justify-center mb-5"
            onClick={handleClick}
          >
            Withdraw <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Payment;
