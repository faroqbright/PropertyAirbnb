"use client";
import { Layers, Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Account = () => {
  const [transactions, setTransactions] = useState([]);
  const [rejectedBookings, setRejectedBookings] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [rejectedBookingsTotal, setRejectedBookingsTotal] = useState(0); 
  const [activeTab, setActiveTab] = useState("transactions");
  const userInfo = useSelector((state) => state?.auth?.userInfo?.uid);
  const router = useRouter();
  console.log(rejectedBookings);

  const handleClick = () => {
    router.push("/Landing/Profile/Payment");
  };

  // ✅ Function to format date (from "YYYY-MM-DD" to "DD-Month-YYYY")
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
    const [year, month, day] = dateString.split("-");
    return `${day}-${months[parseInt(month, 10) - 1]}-${year}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchAllAccounts = async () => {
    try {
      const accountsCollection = collection(db, "accounts");
      const accountsSnapshot = await getDocs(accountsCollection);
      const accountsList = accountsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("All Accounts:", accountsList);

      const filteredAccounts = accountsList.filter(
        (account) => account.userId === userInfo
      );

      const allTransactions = filteredAccounts.map((account) => ({
        transactionId: account.transactionId || "N/A",
        date: formatDate(account.date) || "N/A",
        bankType: account.bankType || "N/A",
        type: account.type || "N/A",
        amount: Number(account.amount) || 0,
      }));

      setTransactions(allTransactions);

      const total = allTransactions.reduce((sum, txn) => sum + txn.amount, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Error fetching accounts.");
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchAllAccounts();
    }
  }, [userInfo]);

  // Fetch rejected bookings

  const fetchRejectedBookings = async () => {
    try {
      const rejectedBookingsCollection = collection(db, "rejectedBookings");
      const snapshot = await getDocs(rejectedBookingsCollection);
      const allRejectedBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const userRejectedBookings = allRejectedBookings.filter(
        (booking) => booking.userId === userInfo
      );

      setRejectedBookings(userRejectedBookings);
      
      // Calculate total of rejected bookings
      const rejectedTotal = userRejectedBookings.reduce(
        (sum, booking) => sum + (Number(booking.platformFee) || 0),
        0
      );
      setRejectedBookingsTotal(rejectedTotal);
    } catch (error) {
      console.error("Error fetching rejected bookings:", error);
      toast.error("Error fetching rejected bookings.");
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchAllAccounts();
      fetchRejectedBookings(); // Call this to fetch rejected bookings
    }
  }, [userInfo]);

  const displayTotal = activeTab === "transactions" 
  ? totalAmount 
  : rejectedBookingsTotal;

  return (
    <div className="w-full bg-white rounded-xl border-[1.5px] min-h-screen border-gray-200 px-6 pt-4 pb-4 mb-4">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div>
            <p className="text-slate-400">Total Wallet Value:</p>
            <h1 className="text-textclr text-xl font-semibold">
              ${displayTotal.toFixed(2)}
            </h1>
          </div>
          <div className="bg-purplebutton px-2 py-2 rounded-full text-white">
            <Layers className="text-lg" />
          </div>
        </div>

        {/* <button
          className="px-10 bg-bluebutton py-2 rounded-3xl text-white"
          onClick={handleClick}
        >
          Withdraw
        </button> */}

        <div className="flex justify-between gap-2">
          <button
            className={`px-10 py-2 rounded-3xl text-black ${
              activeTab === "transactions"
                ? "bg-purplebutton text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </button>

          <button
            className={`px-10 py-2 rounded-3xl text-black ${
              activeTab === "wallet"
                ? "bg-purplebutton text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab("wallet")}
          >
            Wallet
          </button>
        </div>
      </div>

      {activeTab === "transactions" && (
        <div className="max-h-80">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-textclr px-4 py-2 text-left">
                    Transaction ID
                  </th>
                  <th className="text-textclr px-4 py-2 text-left">Date</th>
                  <th className="text-textclr px-4 py-2 text-left">
                    Bank Type
                  </th>
                  <th className="text-textclr px-4 py-2 text-left">Type</th>
                  <th className="text-textclr px-4 py-2 text-left rounded-tr-2xl rounded-br-2xl">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction.transactionId}>
                      <td className="text-gray-500 px-4 py-2">
                        {transaction.transactionId}
                      </td>
                      <td className="text-gray-500 px-4 py-2">
                        {transaction.date}
                      </td>
                      <td className="text-gray-500 px-4 py-2">
                        {transaction.bankType}
                      </td>
                      <td className="text-gray-500 px-4 py-2">
                        {transaction.type}
                      </td>
                      <td className="text-gray-500 px-4 py-2">
                        ${transaction.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "wallet" && (
        <div className="max-h-80">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-textclr px-4 py-2 text-left">
                    Property ID
                  </th>
                  <th className="text-textclr px-4 py-2 text-left">
                    Property Name
                  </th>
                  <th className="text-textclr px-4 py-2 text-left">Location</th>
                  <th className="text-textclr px-4 py-2 text-left">
                    Date
                  </th>
                  <th className="text-textclr px-4 py-2 text-left rounded-tr-2xl rounded-br-2xl">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {rejectedBookings.length > 0 ? (
                  rejectedBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="text-gray-500 px-4 py-2">{booking.id}</td>
                      <td className="text-gray-500 px-4 py-2">
                        {booking.propertyName || "N/A"}
                      </td>
                      <td className="text-gray-500 px-4 py-2">
                        {booking.propertyLocation || "N/A"}
                      </td>
                      <td className="text-gray-500 px-4 py-2">
                      {formatTimestamp(booking.timestamp)}
                      </td>
                      <td className="text-gray-500 px-4 py-2">
                        ${booking.platformFee || "0.00"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No rejected bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
