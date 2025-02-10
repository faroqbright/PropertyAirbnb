"use client";
import { useState } from "react";
import { Inbox, Calendar, User, House, CreditCard } from "lucide-react";
import Bookings from "../Bookings/Bookings";
import Profile from "../Profile/Profile";
import InboxP from "../Inbox/Inbox";
import Properties from "../Properties/Properties";
import Account from "../Account/Account";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Inbox");
  const [newRoomOpen, setNewRoomOpen] = useState(false);

  return (
    <div
      className={`w-full min-h-screen flex flex-col ${
        newRoomOpen
          ? "lg:!pb-[450px] md:!pb-[700px] !pb-[800px]"
          : activeTab === "Bookings" || activeTab === "Properties"
          ? "pb-[1310px] lg:-mb-8"
          : activeTab === "Profile"
          ? "!pb-[550px] sm:!pb-[450px] lg:!pb-[400px]"
          : "!pb-[350px] md:!pb-[0px] lg:!pb-[240px]"
      } md:pb-0 md:mb-20 lg:mb-20 p-2 mt-4 lg:p-0 lg:mt-10`}
    >
      <div className="lg:hidden w-full bg-purplebutton overflow-y-auto scrollbar-hide p-4 rounded-xl flex justify-center min-[810]:space-x-20 lg:space-x-0 lg:justify-between items-center">
        <div
          className={`flex items-center gap-1 md:gap-2 md:px-4 px-3 py-2 lg:pl-6 text-white rounded-full cursor-pointer ${
            activeTab === "Inbox" ? "bg-bluebutton" : ""
          }`}
          onClick={() => setActiveTab("Inbox")}
        >
          <Inbox size={18} />{" "}
          <span className="text-sm sm:text-base">Inbox</span>
        </div>
        <div
          className={`flex items-center gap-1 py-2 md:gap-2 md:px-4 lg:pl-6 px-3 text-white rounded-full cursor-pointer ${
            activeTab === "Bookings" ? "bg-bluebutton" : ""
          }`}
          onClick={() => setActiveTab("Bookings")}
        >
          <Calendar size={18} />{" "}
          <span className="text-sm sm:text-base">Bookings</span>
        </div>
        <div
          className={`flex items-center gap-1 py-2 md:gap-2 md:px-4 lg:pl-6 px-3 text-white rounded-full cursor-pointer ${
            activeTab === "Properties" ? "bg-bluebutton" : ""
          }`}
          onClick={() => setActiveTab("Properties")}
        >
          <House size={18} />{" "}
          <span className="text-sm sm:text-base">Properties</span>
        </div>
        <div
          className={`flex items-center gap-1 px-3 md:gap-2 md:px-4 py-2 lg:pl-6 text-white rounded-full cursor-pointer ${
            activeTab === "Profile" ? "bg-bluebutton" : ""
          }`}
          onClick={() => setActiveTab("Profile")}
        >
          <User size={18} />{" "}
          <span className="text-sm sm:text-base">Profile</span>
        </div>
        <div
          className={`flex items-center gap-1 px-3 md:gap-2 md:px-4 py-2 lg:pl-6 text-white rounded-full cursor-pointer ${
            activeTab === "Account" ? "bg-bluebutton" : ""
          }`}
          onClick={() => setActiveTab("Account")}
        >
          <CreditCard size={18} />{" "}
          <span className="text-sm sm:text-base">Account</span>
        </div>
      </div>

      <div className="flex w-full h-[380px] flex-col lg:flex-row sm:p-5 lg:px-20 lg:py-10">
        <div className="w-full lg:w-[25%] rounded-xl bg-purplebutton px-6 py-5 hidden lg:block">
          <div
            className={`flex items-center gap-2 p-3 pl-6 text-white rounded-full cursor-pointer ${
              activeTab === "Inbox" ? "bg-bluebutton" : ""
            }`}
            onClick={() => setActiveTab("Inbox")}
          >
            <Inbox size={20} /> <span>Inbox</span>
          </div>
          <div
            className={`flex items-center my-2.5 gap-2 p-3 pl-6 text-white rounded-full cursor-pointer ${
              activeTab === "Bookings" ? "bg-bluebutton" : ""
            }`}
            onClick={() => setActiveTab("Bookings")}
          >
            <Calendar size={20} /> <span>Bookings</span>
          </div>
          <div
            className={`flex items-center gap-2 p-3 pl-6 text-white rounded-full cursor-pointer ${
              activeTab === "Properties" ? "bg-bluebutton" : ""
            }`}
            onClick={() => setActiveTab("Properties")}
          >
            <House size={20} /> <span>Properties</span>
          </div>
          <div
            className={`flex items-center gap-2 p-3 pl-6 text-white rounded-full cursor-pointer ${
              activeTab === "Profile" ? "bg-bluebutton" : ""
            }`}
            onClick={() => setActiveTab("Profile")}
          >
            <User size={20} /> <span>Profile</span>
          </div>
          <div
            className={`flex items-center gap-2 p-3 pl-6 text-white rounded-full cursor-pointer ${
              activeTab === "Account" ? "bg-bluebutton" : ""
            }`}
            onClick={() => setActiveTab("Account")}
          >
            <CreditCard size={20} /> <span>Account</span>
          </div>
        </div>

        <div className="w-full lg:w-[75%] py-4 px-2 text-black">
          {activeTab === "Bookings" && <Bookings />}
          {activeTab === "Profile" && <Profile />}
          {activeTab === "Inbox" && <InboxP />}
          {activeTab === "Properties" && (
            <Properties
              newRoomOpen={newRoomOpen}
              setNewRoomOpen={setNewRoomOpen}
            />
          )}
          {activeTab === "Account" && <Account />}
        </div>
      </div>
    </div>
  );
}
