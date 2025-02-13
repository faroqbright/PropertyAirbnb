"use client";
import { useState } from "react";
import {
  CreditCard,
  Banknote,
  Info,
  Calendar,
  Nfc,
  ArrowRight,
  ChevronDown,
  CircleCheck,
  Check,
} from "lucide-react";

export default function PaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  const handlePayNow = () => {
    setPaymentSubmitted(true);
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

          <div className="bg-purplebutton text-white p-6 rounded-2xl w-full lg:w-[600px] h-[400px] flex flex-col justify-between">
            <div>
              <h2 className="text-[20px] font-semibold mb-5 border-b border-white/30 pb-3">
                Booking Summary
              </h2>
              <div className="flex justify-between text-[17px] font-medium">
                <p>Entire loft in Florence, Italy</p>
                <span className="text-2xl mb-1 -mt-1">$99</span>
              </div>
              <p className="text-[13px] mt-2 opacity-80 pb-1">
                Beautiful Eiffel Tower View Studio & Private Balcony
              </p>
              <div className="mt-4 text-[13px] space-y-2 border-t border-white/30 pt-6">
                <p className="flex justify-between">
                  <span>$79 × 7 months</span> <span>$555</span>
                </p>
                <p className="flex justify-between">
                  <span>Cleaning fee</span> <span>$62</span>
                </p>
                <p className="flex justify-between">
                  <span>Service fee</span> <span>$83</span>
                </p>
              </div>
            </div>
            <div className="flex justify-center mb-4">
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
