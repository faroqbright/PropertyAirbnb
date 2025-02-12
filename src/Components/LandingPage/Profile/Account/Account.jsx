import { Layers } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

const Account = () => {
  const data = [
    {
      transactionId: 237439974,
      date: "23 March 2024",
      from: "Allied Bank",
      type: "income",
      amount: "$28000",
    },
    {
      transactionId: 237439975,
      date: "23 March 2024",
      from: "Allied Bank",
      type: "income",
      amount: "$32000",
    },
    {
      transactionId: 237439976,
      date: "23 March 2024",
      from: "Allied Bank",
      type: "income",
      amount: "$24000",
    },
  ];

  const router = useRouter();

  const handleClick = () => {
    router.push("/Landing/Profile/Payment");
  };

  return (
    <div className="w-full bg-white rounded-xl border-[1.5px] min-h-screen border-gray-200 px-6 pt-4 pb-4 mb-4">
      <div className="mb-8 flex justify-between items-center ">
        <div className="flex gap-4 items-center">
          <div>
            <p className="text-slate-400">Balance:</p>
            <h1 className="text-textclr text-xl font-semibold">$3000.00</h1>
          </div>
          <div className="bg-purplebutton px-2 py-2 rounded-full text-white">
            <Layers className=" text-lg" />
          </div>
        </div>

        <div>
          <button
            className="px-10 bg-bluebutton py-2 rounded-3xl text-white"
            onClick={handleClick}
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="max-h-80">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-textclr px-4 py-2 text-left rounded-tl-2xl rounded-bl-2xl">
                  Transaction ID
                </th>
                <th className="text-textclr px-4 py-2 text-left">Date</th>
                <th className="text-textclr px-4 py-2 text-left">From</th>
                <th className="text-textclr px-4 py-2 text-left">Type</th>
                <th className="text-textclr px-4 py-2 text-left rounded-tr-2xl rounded-br-2xl">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.transactionId}>
                  <td className="text-gray-500 px-4 py-2">
                    {user.transactionId}
                  </td>
                  <td className="text-gray-500 px-4 py-2">{user.date}</td>
                  <td className="text-gray-500 px-4 py-2">{user.from}</td>
                  <td className="text-gray-500 px-4 py-2">{user.type}</td>
                  <td className="text-gray-500 px-4 py-2">{user.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Account;
