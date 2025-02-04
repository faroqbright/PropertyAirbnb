"use client";
import { useState } from "react";
import { Inbox, Calendar, User } from "lucide-react";
import Bookings from "../Bookings/Bookings";
import Profile from "../Profile/Profile";
import InboxP from "../Inbox/Inbox";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Bookings");

  return (
    <div
      className={`w-full min-h-screen flex flex-col ${
        activeTab === "Bookings"
          ? "pb-[1350px] sm:pb-[1280px]"
          : activeTab === "Profile"
          ? "!pb-[550px] sm:!pb-[450px] lg:!pb-[400px]"
          : "!pb-[400px] md:!pb-[0px] lg:!pb-[400px]"
      } md:pb-0 md:mb-20 lg:mb-0 p-2 mt-4 lg:p-0 lg:mt-10`}
    >
      <div className="lg:hidden w-full bg-purplebutton p-4 rounded-xl flex justify-center min-[810]:space-x-20 lg:space-x-0 lg:justify-between items-center">
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
          className={`flex items-center gap-1 px-3 md:gap-2 md:px-4 py-2 lg:pl-6 text-white rounded-full cursor-pointer ${
            activeTab === "Profile" ? "bg-bluebutton" : ""
          }`}
          onClick={() => setActiveTab("Profile")}
        >
          <User size={18} />{" "}
          <span className="text-sm sm:text-base">Profile</span>
        </div>
      </div>

      <div className="flex w-full h-[290px] flex-col lg:flex-row sm:p-5 lg:px-20 lg:py-10">
        <div
          className={`w-full lg:w-[25%] rounded-xl bg-purplebutton px-6 py-5 hidden lg:block`}
        >
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
              activeTab === "Profile" ? "bg-bluebutton" : ""
            }`}
            onClick={() => setActiveTab("Profile")}
          >
            <User size={20} /> <span>Profile</span>
          </div>
        </div>

        <div className="w-full lg:w-[75%] p-6 text-black">
          {activeTab === "Bookings" && <Bookings />}
          {activeTab === "Profile" && <Profile />}
          {activeTab === "Inbox" && <InboxP />}
        </div>
      </div>
    </div>
  );
}
