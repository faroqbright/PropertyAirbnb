"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  addDoc,
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import {
  CreditCard,
  Banknote,
  Info,
  Calendar,
  Nfc,
  ArrowRight,
  Check,
  Wallet2Icon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";
import { IoCard } from "react-icons/io5";

export default function PaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const router = useRouter();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState(null);
  const [price, setPrice] = useState(null);
  const [location, setLocation] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [propertyId, setPropertyId] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState(null);
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [loading, setLoading] = useState(false);
  const [platformFee, setPlatformFee] = useState(0);
  const [rejectedBookings, setRejectedBookings] = useState([]);
  const [walletTotal, setWalletTotal] = useState(0);
  const [rejectedBookingsTotal, setRejectedBookingsTotal] = useState(0);
  const userInfo = useSelector((state) => state?.auth?.userInfo?.uid);
  const [isBalanceUpdated, setIsBalanceUpdated] = useState(false);

  useEffect(() => {
    const storedPlatformFee =
      parseFloat(localStorage.getItem("platformFee")) || 0;
    setPlatformFee(storedPlatformFee);
  }, []);

  const userId = useSelector((state) => state.auth.userInfo?.uid);
  const userPersonalInfo = useSelector(
    (state) => state?.auth?.userInfo?.personalInfo
  );
  const Email = useSelector((state) => state.auth.userInfo?.email);
  const LegalName = useSelector((state) => state.auth.userInfo?.LegalName);
  const FullName = useSelector((state) => state.auth.userInfo?.FullName);

  const startDate = localStorage.getItem("startDate");
  const endDate = localStorage.getItem("endDate");

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  startDateObj.setHours(0, 0, 0, 0);
  endDateObj.setHours(0, 0, 0, 0);

  const differenceInTime = endDateObj - startDateObj;
  const daysDifference = differenceInTime / (1000 * 60 * 60 * 24);
  const daysDifferenceTwo = daysDifference + 1;

  const fetchWalletBalance = useCallback(async () => {
    try {
      if (!userId) return;

      const walletSumRef = doc(db, "WalletSum", userId);
      const docSnap = await getDoc(walletSumRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const balance =
          data.remainingBalance > 0
            ? data.remainingBalance
            : data.rejectedBookingsTotal || 0;

        setWalletTotal(balance);
        localStorage.setItem("walletBalance", balance.toString());
      } else {
        const localBalance =
          parseFloat(localStorage.getItem("walletBalance")) || 0;
        setWalletTotal(localBalance);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  }, [userId]);

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("selectedRooms")) || [];
    const storedServices =
      JSON.parse(localStorage.getItem("selectedServices")) || [];
    const storedProperty = JSON.parse(localStorage.getItem("selectedProperty"));
    const storedMonths =
      JSON.parse(localStorage.getItem("selectedMonths")) || 1;
    const storedPropertyId = localStorage.getItem("selectedProperty");

    if (storedProperty) {
      setPrice(
        Number(
          ((storedProperty.pricePerMonth / 30) * daysDifferenceTwo).toFixed(2)
        )
      );
      setName(storedProperty.name);
      setLocation(storedProperty.location);
    }

    setSelectedRooms(storedRooms);
    setSelectedServices(storedServices);
    setSelectedMonths(storedMonths);
    setPropertyId(JSON.parse(storedPropertyId));

    const total = calculateTotal(storedRooms, storedServices);
    setTotalAmount(total);
  }, []);

  const calculateTotal = (rooms, services) => {
    const roomsTotal = rooms.reduce(
      (sum, room) =>
        sum + Number(((room.price / 30) * daysDifferenceTwo).toFixed(2)),
      0
    );
    const servicesTotal = services.reduce(
      (sum, service) =>
        sum + Number(((service.price / 30) * daysDifferenceTwo).toFixed(2)),
      0
    );
    return roomsTotal + servicesTotal;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedValue);
  };

  const handleExpirationChange = (date) => {
    setExpiration(date);
  };

  const handleCVCChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    setCvc(value);
  };

  const handlePayNow = async () => {
    if (paymentMethod === "wallet") {
      try {
        if (!userInfo) {
          toast.error("Authentication error. Please login again.");
          return;
        }

        if (platformFee <= 0) {
          toast.error("Invalid payment amount");
          return;
        }

        if (!propertyId?.id) {
          toast.error("Property information missing");
          return;
        }

        setLoading(true);

        const walletSumRef = doc(db, "WalletSum", userInfo);
        const walletSnap = await getDoc(walletSumRef);

        if (!walletSnap.exists()) {
          toast.error("Wallet account not found");
          return;
        }

        const walletData = walletSnap.data();
        const currentBalance =
          walletData.remainingBalance > 0
            ? walletData.remainingBalance
            : walletData.rejectedBookingsTotal || 0;

        if (currentBalance < platformFee) {
          toast.error("Insufficient wallet balance");
          return;
        }

        const newBalance = currentBalance - platformFee;

        await setDoc(
          walletSumRef,
          {
            rejectedBookingsTotal: newBalance,
            remainingBalance: newBalance,
            lastUpdated: new Date(),
          },
          { merge: true }
        );

        const bookingDetails = {
          propertyId,
          userId,
          userPersonalInfo,
          propertyName: name,
          propertyLocation: location,
          selectedRooms: selectedRooms.map((room) => ({
            ...room,
            price: ((room.price / 30) * daysDifferenceTwo).toFixed(2),
          })),
          selectedServices: selectedServices.map((service) => ({
            ...service,
            price: (
              (parseFloat(service.cost) / 30) *
              daysDifferenceTwo
            ).toFixed(2),
            cost: ((parseFloat(service.cost) / 30) * daysDifferenceTwo).toFixed(
              2
            ),
          })),
          totalAmount: (totalAmount * selectedMonths).toFixed(2),
          platformFee: platformFee.toFixed(2),
          selectedMonths,
          paymentMethod: "wallet",
          walletDeduction: platformFee.toFixed(2),
          remainingMoney: newBalance.toFixed(2),
          remainingBalance: newBalance.toFixed(2),
          timestamp: new Date(),
          status: "completed",
          LegalName: LegalName || FullName,
          propertyPrice: price,
          numberOfDays: daysDifferenceTwo,
          startDate,
          endDate,
        };

        await addDoc(collection(db, "bookings"), bookingDetails);
        setPaymentSubmitted(true);

        localStorage.removeItem("startDate");
        localStorage.removeItem("endDate");

        toast.success("Payment processed successfully!");
        setTimeout(() => router.push("/Landing/Home"), 3000);
      } catch (error) {
        console.error("Payment failed:", error);
        toast.error(`Payment failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      if (!cardNumber || !expiration || !cvc || !nameOnCard) {
        toast.error("Please fill in all the required fields.");
        return;
      }
      if (cardNumber < 16) {
        toast.error("Please enter correct card number.");
        return;
      }

      setLoading(true);

      const updatedSelectedRooms = selectedRooms.map((room) => ({
        ...room,
        price: ((room.price / 30) * daysDifferenceTwo).toFixed(2),
      }));

      const updatedSelectedServices = selectedServices.map((service) => ({
        ...service,
        price: ((parseFloat(service.cost) / 30) * daysDifferenceTwo).toFixed(2),
        cost: ((parseFloat(service.cost) / 30) * daysDifferenceTwo).toFixed(2),
      }));

      const getUserIP = async () => {
        try {
          const response = await fetch("https://api.ipify.org?format=json");
          const data = await response.json();
          return data.ip;
        } catch (error) {
          console.error("Failed to fetch IP address", error);
          return null;
        }
      };

      const getCountryName = async (ip) => {
        try {
          const response = await fetch(`https://ipapi.co/${ip}/json/`);
          const data = await response.json();
          return data.country_code.toLowerCase();
        } catch (error) {
          console.error("Failed to fetch country name", error);
          return null;
        }
      };

      const generateUUID = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 19) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(19);
        });
      };

      try {
        const ip = await getUserIP();
        if (!ip) {
          toast.error("Failed to fetch IP address.");
          return;
        }

        const countryName = await getCountryName(ip);
        if (!countryName) {
          toast.error("Failed to fetch country information.");
          return;
        }

        const muid = generateUUID();
        const sid = generateUUID();
        const guid = generateUUID();

        const expMonth = String(expiration.getMonth() + 1).padStart(2, "0");
        const expYear = String(expiration.getFullYear()).slice(-2);

        const paymentPayload = new URLSearchParams({
          type: "card",
          "card[number]": cardNumber.replace(/\s+/g, ""),
          "card[cvc]": cvc,
          "card[exp_month]": expMonth,
          "card[exp_year]": expYear,
          "billing_details[name]": nameOnCard,
          "billing_details[email]": Email || "example@example.com",
          "billing_details[address][country]": countryName,
          muid: muid,
          sid: sid,
          guid: guid,
          payment_user_agent:
            "stripe.js/c93000e12a; stripe-js-v3/c93000e12a; checkout",
        });

        const response = await axios.post(
          "https://api.stripe.com/v1/payment_methods",
          paymentPayload,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (!response.data.id) {
          toast.error("Failed to create payment method.");
          return;
        }

        const paymentMethodId = response.data.id;

        const paymentIntentResponse = await axios.post(
          "https://api.stripe.com/v1/payment_intents",
          new URLSearchParams({
            amount: platformFee * 100,
            currency: "usd",
            payment_method: paymentMethodId,
            confirm: "true",
            return_url:
              "http://localhost:3000/Landing/Properties/PropertiesDetail/Payment",
          }),
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (paymentIntentResponse.data.status === "succeeded") {
          const transactionId = paymentIntentResponse.data.id;
          const currentDate = new Date().toISOString().split("T")[0];
          const bookingDetails = {
            propertyId,
            userId,
            userPersonalInfo,
            propertyName: name,
            propertyLocation: location,
            selectedRooms: updatedSelectedRooms,
            selectedServices: updatedSelectedServices,
            totalAmount: (totalAmount * selectedMonths).toFixed(2),
            platformFee: platformFee.toFixed(2),
            selectedMonths,
            paymentMethod,
            timestamp: new Date(),
            status: "pending",
            LegalName: LegalName || FullName,
            propertyPrice: price,
            numberOfDays: daysDifferenceTwo,
            startDate,
            endDate,
          };
          try {
            await addDoc(collection(db, "bookings"), bookingDetails);
            const transactionDetails = {
              transactionId,
              date: currentDate,
              bankType: "Stripe",
              type: paymentMethod,
              amount: (totalAmount * selectedMonths).toFixed(2),
              propertyId: propertyId.id,
              userId: userId,
              platformFee: platformFee.toFixed(2),
            };

            await addDoc(collection(db, "accounts"), transactionDetails);
            setPaymentSubmitted(true);
            localStorage.removeItem("startDate");
            localStorage.removeItem("endDate");
            setTimeout(() => {
              router.push("/Landing/Home");
            }, 3000);
          } catch (e) {
            console.error("Error saving booking: ", e);
          }
        }
      } catch (error) {
        console.error("Payment failed:", error);
        toast.error("Payment failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchRejectedBookings = useCallback(async () => {
    try {
      const rejectedBookingsCollection = query(
        collection(db, "rejectedBookings"),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(rejectedBookingsCollection);
      const allRejectedBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const userRejectedBookings = allRejectedBookings.filter(
        (booking) => booking.userId === userInfo
      );

      const calculatedTotal = userRejectedBookings.reduce(
        (sum, booking) => sum + (Number(booking.platformFee) || 0),
        0
      );

      setRejectedBookings(userRejectedBookings);
      setRejectedBookingsTotal(calculatedTotal);

      const walletSumRef = doc(db, "WalletSum", userInfo);
      const walletSnap = await getDoc(walletSumRef);

      if (walletSnap.exists() && walletSnap.data().remainingBalance > 0) {
        return;
      }

      const currentBalance = walletSnap.exists()
        ? walletSnap.data().rejectedBookingsTotal || 0
        : 0;

      if (calculatedTotal !== currentBalance) {
        await setDoc(
          walletSumRef,
          {
            rejectedBookingsTotal: calculatedTotal,
            lastUpdated: new Date(),
          },
          { merge: true }
        );
        setWalletTotal(calculatedTotal);
        localStorage.setItem("walletBalance", calculatedTotal.toString());
      }
    } catch (error) {
      console.error("Error fetching rejected bookings:", error);
      toast.error("Error fetching rejected bookings.");
    }
  }, [userInfo]);

  useEffect(() => {
    if (userId) {
      fetchWalletBalance();
    }
  }, [userId, fetchWalletBalance]);

  useEffect(() => {
    if (userInfo) {
      fetchRejectedBookings();
    }
  }, [userInfo]);

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
                className={`flex items-center justify-center gap-2 w-full md:w-[33%] px-4 py-2 md:px-3 text-nowrap md:py-1.5 rounded-full border ${
                  paymentMethod === "wallet"
                    ? "bg-bluebutton text-white"
                    : "bg-white text-gray-500"
                }`}
                onClick={() => setPaymentMethod("wallet")}
              >
                <Wallet2Icon size={18} /> Wallet
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethod === "wallet" ? (
                <div className="text-center p-4">
                  <Wallet2Icon
                    size={48}
                    className="mx-auto text-purplebutton mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Wallet Balance</h3>
                  <p className="text-2xl font-bold">
                    ${walletTotal.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    {walletTotal >= platformFee
                      ? "Sufficient balance available"
                      : "Insufficient balance for this transaction"}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[13px] mb-2 ml-1 font-medium">
                      Name on Card
                    </label>
                    <input
                      className="w-full px-2 py-1.5 border rounded-full pl-6"
                      placeholder="Name"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
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
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                      />
                      <IoCard
                        className="absolute right-3 top-2.5 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-4xl mx-auto">
                    <div className="w-full md:w-1/2">
                      <label className="block text-sm text-[13px] mb-2 ml-1 font-medium">
                        Expiration Date
                      </label>
                      <div className="flex justify-between items-center border border-gray-300 rounded-3xl p-2 pl-3 text-sm w-full">
                        <DatePicker
                          selected={expiration}
                          onChange={handleExpirationChange}
                          dateFormat="MM/yy"
                          placeholderText="MM/YY"
                          showMonthYearPicker
                          minDate={new Date()}
                          className="w-full outline-none bg-white text-gray-700"
                          calendarClassName="custom-calendar-size"
                        />
                        <Calendar size={18} className="right-3 text-gray-400" />
                      </div>
                    </div>
                    <div className="w-full md:w-1/2">
                      <label className="text-sm text-[13px] mb-2 ml-1 font-medium flex items-center gap-1">
                        CVV
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-2 text-[15px] py-1.5 border rounded-full text-gray-500 pl-6 pr-10"
                          placeholder="xxx"
                          value={cvc}
                          onChange={handleCVCChange}
                        />
                        <div className="absolute right-3 top-2.5 text-gray-400">
                          <Info size={17} />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
                  ${(totalAmount * selectedMonths).toFixed(2)}
                </span>
              </div>
              <p className="text-[13px] mt-2 opacity-80 pb-1">{name}</p>
              <div className="mt-4 text-[13px] space-y-2 border-t border-white/30 pt-6">
                <span>
                  ${price} / {daysDifferenceTwo} days{" "}
                  {selectedMonths > 1 ? "s" : " "}
                </span>
                {selectedRooms.map((room) => (
                  <p key={room.id} className="flex justify-between">
                    <span>{room.name}</span>{" "}
                    <span>
                      ${((room.price / 30) * daysDifferenceTwo).toFixed(2)}
                    </span>
                  </p>
                ))}
                {selectedServices.map((service) => (
                  <p key={service.id} className="flex justify-between">
                    <span>{service.name}</span>{" "}
                    <span>
                      ${((service.price / 30) * daysDifferenceTwo).toFixed(2)}
                    </span>
                  </p>
                ))}
                <p className="flex justify-between border-t border-white/30 pt-2">
                  <span>Platform Fee</span>
                  <span>${platformFee.toFixed(2)}</span>
                </p>
              </div>
            </div>
            <div className="flex justify-center ">
              <button
                onClick={handlePayNow}
                className="w-44 bg-bluebutton text-white py-2 rounded-full flex items-center justify-center gap-2"
                disabled={
                  loading ||
                  (paymentMethod === "wallet" && walletTotal < platformFee)
                }
              >
                {loading
                  ? "Processing..."
                  : paymentMethod === "wallet"
                  ? "Pay with Wallet"
                  : "Pay Now"}
                <ArrowRight className="ml-2" size={18} />
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
