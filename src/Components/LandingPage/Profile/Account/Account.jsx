"use client";
import { Layers } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Account = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const userInfo = useSelector((state) => state?.auth?.userInfo?.uid)
  const router = useRouter();
  console.log(userInfo);
  

  const handleClick = () => {
    router.push("/Landing/Profile/Payment");
  };

  // ✅ Function to format date (from "YYYY-MM-DD" to "DD-Month-YYYY")
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const [year, month, day] = dateString.split("-");
    return `${day}-${months[parseInt(month, 10) - 1]}-${year}`;
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
if(userInfo){
  fetchAllAccounts();
}  
}, [userInfo]);

  return (
    <div className="w-full bg-white rounded-xl border-[1.5px] min-h-screen border-gray-200 px-6 pt-4 pb-4 mb-4">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div>
            <p className="text-slate-400">Total Balance:</p>
            <h1 className="text-textclr text-xl font-semibold">
              ${totalAmount.toFixed(2)}
            </h1>
          </div>
          <div className="bg-purplebutton px-2 py-2 rounded-full text-white">
            <Layers className="text-lg" />
          </div>
        </div>

        <button
          className="px-10 bg-bluebutton py-2 rounded-3xl text-white"
          onClick={handleClick}
        >
          Withdraw
        </button>
      </div>

      <div className="max-h-80">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-textclr px-4 py-2 text-left">Transaction ID</th>
                <th className="text-textclr px-4 py-2 text-left">Date</th>
                <th className="text-textclr px-4 py-2 text-left">Bank Type</th>
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
                    <td className="text-gray-500 px-4 py-2">{transaction.transactionId}</td>
                    <td className="text-gray-500 px-4 py-2">{transaction.date}</td>
                    <td className="text-gray-500 px-4 py-2">{transaction.bankType}</td>
                    <td className="text-gray-500 px-4 py-2">{transaction.type}</td>
                    <td className="text-gray-500 px-4 py-2">${transaction.amount.toFixed(2)}</td>
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
    </div>
  );
};

export default Account;
