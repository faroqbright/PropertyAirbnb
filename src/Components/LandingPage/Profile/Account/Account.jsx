"use client";

import { Layers, Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Account = () => {
  const [transactions, setTransactions] = useState([]);
  const [rejectedBookings, setRejectedBookings] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [activeTab, setActiveTab] = useState("transactions");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(11);
  const [walletTotal, setWalletTotal] = useState(0);
  const [lastProcessedBookingId, setLastProcessedBookingId] = useState(null);
  const userInfo = useSelector((state) => state?.auth?.userInfo?.uid);
  const userId = useSelector((state) => state.auth.userInfo?.uid);
  const router = useRouter();

  const handleClick = () => {
    router.push("/Landing/Profile/Payment");
  };

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

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(doc(db, "WalletSum", userId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const balance =
          data.remainingBalance > 0
            ? data.remainingBalance
            : data.rejectedBookingsTotal || 0;
        const lastId = data.lastProcessedBookingId || null;

        setWalletTotal(balance);
        setLastProcessedBookingId(lastId);
        localStorage.setItem("walletBalance", balance.toString());
      } else {
        const localBalance =
          parseFloat(localStorage.getItem("walletBalance")) || 0;
        setWalletTotal(localBalance);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const updateWalletSum = async (newTotal, lastBookingId = null) => {
    try {
      if (!userInfo) return;

      const walletSumRef = doc(db, "WalletSum", userInfo);
      const walletData = {
        rejectedBookingsTotal: newTotal,
        lastProcessedBookingId: lastBookingId,
        lastUpdated: new Date(),
      };

      const walletSnap = await getDoc(walletSumRef);
      if (walletSnap.exists() && walletSnap.data().remainingBalance > 0) {
        walletData.remainingBalance = newTotal;
      }

      await setDoc(walletSumRef, walletData, { merge: true });
      localStorage.setItem("walletBalance", newTotal.toString());
    } catch (error) {
      console.error("Error updating WalletSum:", error);
      toast.error("Error updating wallet total.");
    }
  };

  const fetchAllAccounts = async () => {
    try {
      const accountsCollection = collection(db, "accounts");
      const accountsSnapshot = await getDocs(accountsCollection);
      const accountsList = accountsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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
      setTotalAmount(allTransactions.reduce((sum, txn) => sum + txn.amount, 0));
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Error fetching accounts.");
    }
  };

  const fetchRejectedBookings = async () => {
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

      setRejectedBookings(userRejectedBookings);

      const walletSumRef = doc(db, "WalletSum", userInfo);
      const walletSnap = await getDoc(walletSumRef);
      if (walletSnap.exists() && walletSnap.data().remainingBalance > 0) {
        return; 
      }

      let newBookings = userRejectedBookings;
      if (lastProcessedBookingId) {
        const lastProcessedIndex = userRejectedBookings.findIndex(
          (booking) => booking.id === lastProcessedBookingId
        );
        if (lastProcessedIndex !== -1) {
          newBookings = userRejectedBookings.slice(0, lastProcessedIndex);
        }
      }

      if (newBookings.length > 0) {
        const newAmount = newBookings.reduce(
          (sum, booking) => sum + (Number(booking.platformFee) || 0),
          0
        );

        const updatedTotal = walletTotal + newAmount;
        const newestBookingId = userRejectedBookings[0]?.id;

        setWalletTotal(updatedTotal);
        await updateWalletSum(updatedTotal, newestBookingId);
      }
    } catch (error) {
      console.error("Error fetching rejected bookings:", error);
      toast.error("Error fetching rejected bookings.");
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchAllAccounts();
      fetchRejectedBookings();
    }
  }, [userInfo, lastProcessedBookingId]);

  const currentItems =
    activeTab === "transactions"
      ? transactions.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : rejectedBookings.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  const totalPages = Math.ceil(
    (activeTab === "transactions"
      ? transactions.length
      : rejectedBookings.length) / itemsPerPage
  );

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const displayTotal = activeTab === "transactions" ? totalAmount : walletTotal;

  return (
    <>
      <div className="w-full bg-white rounded-xl border-[1.5px] h-[600px] border-gray-200 px-6 pt-4 pb-4 mb-4 overflow-hidden">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div>
              <p className="text-slate-400">
                {activeTab === "transactions"
                  ? "Total Transactions:"
                  : "Total Wallet Value:"}
              </p>
              <h1 className="text-textclr text-xl font-semibold">
                ${displayTotal.toFixed(2)}
              </h1>
            </div>
            <div className="bg-purplebutton px-2 py-2 rounded-full text-white">
              <Layers className="text-lg" />
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <button
              className={`px-10 py-2 rounded-3xl text-black ${
                activeTab === "transactions"
                  ? "bg-purplebutton text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => {
                setActiveTab("transactions");
                setCurrentPage(1);
              }}
            >
              Transactions
            </button>

            <button
              className={`px-10 py-2 rounded-3xl text-black ${
                activeTab === "wallet"
                  ? "bg-purplebutton text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => {
                setActiveTab("wallet");
                setCurrentPage(1);
              }}
            >
              Wallet
            </button>
          </div>
        </div>

        {activeTab === "transactions" && (
          <div className="max-h-80">
            <div className="overflow-x-auto max-w-full">
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
                  {currentItems.length > 0 ? (
                    currentItems.map((transaction, index) => (
                      <tr key={`${transaction.transactionId}-${index}`}>
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
                      <td
                        colSpan="5"
                        className="text-center py-4 text-gray-500"
                      >
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
            <div className="overflow-x-auto max-w-full">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-textclr px-4 py-2 text-left w-1/5">
                      Property ID
                    </th>
                    <th className="text-textclr px-4 py-2 text-left w-1/5">
                      Property Name
                    </th>
                    <th className="text-textclr px-4 py-2 text-left w-1/5">
                      Location
                    </th>
                    <th className="text-textclr px-4 py-2 text-left w-1/5">
                      Date
                    </th>
                    <th className="text-textclr px-4 py-2 text-left w-1/5 rounded-tr-2xl rounded-br-2xl">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((booking, index) => (
                      <tr key={`${booking.id}-${index}`}>
                        <td className="text-gray-500 px-4 py-2 truncate max-w-[200px]">
                          {booking.id}
                        </td>
                        <td className="text-gray-500 px-4 py-2 truncate max-w-[200px]">
                          {booking.propertyName || "N/A"}
                        </td>
                        <td className="text-gray-500 px-4 py-2 truncate max-w-[200px]">
                          {booking.propertyLocation || "N/A"}
                        </td>
                        <td className="text-gray-500 px-4 py-2 truncate max-w-[200px]">
                          {formatTimestamp(booking.timestamp)}
                        </td>
                        <td className="text-gray-500 px-4 py-2">
                          ${booking.platformFee || "0.00"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-4 text-gray-500"
                      >
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

      {(transactions.length > itemsPerPage ||
        rejectedBookings.length > itemsPerPage) && (
        <div className="flex items-center justify-end space-x-1 sm:space-x-2 mt-4 mb-4">
          <button
            className={`p-2 rounded-full border border-gray-300 ${
              currentPage === 1 ? "bg-gray-100" : "bg-white hover:bg-gray-100"
            }`}
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            className={`p-2 rounded-full border border-gray-300 ${
              currentPage === 1 ? "bg-gray-100" : "bg-white hover:bg-gray-100"
            }`}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-full ${
                currentPage === page
                  ? "bg-purplebutton text-white"
                  : "border border-gray-300 bg-white hover:bg-gray-100"
              }`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={`p-2 rounded-full border border-gray-300 ${
              currentPage === totalPages
                ? "bg-gray-100"
                : "bg-white hover:bg-gray-100"
            }`}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={18} />
          </button>
          <button
            className={`p-2 rounded-full border border-gray-300 ${
              currentPage === totalPages
                ? "bg-gray-100"
                : "bg-white hover:bg-gray-100"
            }`}
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      )}
    </>
  );
};

export default Account;
