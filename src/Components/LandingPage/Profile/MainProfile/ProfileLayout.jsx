"use client";
import { useEffect, useState } from "react";
import { Inbox, Calendar, User, House, CreditCard } from "lucide-react";
import Bookings from "../Bookings/Bookings";
import Profile from "../Profile/Profile";
import InboxP from "../Inbox/Inbox";
import Properties from "../Properties/Properties";
import Account from "../Account/Account";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [role, setRole] = useState(true);
  useEffect(() => {
    if (userInfo?.role === "LandLord") {
      setRole(true);
    } else {
      setRole(false);
    }
  }, [userInfo]);
  const [activeTab, setActiveTab] = useState("Inbox");
  const [newRoomOpen, setNewRoomOpen] = useState(false);

  const tabs = [
    { name: "Inbox", icon: <Inbox size={18} />, component: <InboxP /> },
    { name: "Bookings", icon: <Calendar size={18} />, component: <Bookings /> },
    { name: "Profile", icon: <User size={18} />, component: <Profile /> },
  ];

  if (role === true) {
    tabs.push(
      {
        name: "Properties",
        icon: <House size={18} />,
        component: (
          <Properties
            newRoomOpen={newRoomOpen}
            setNewRoomOpen={setNewRoomOpen}
          />
        ),
      },
      {
        name: "Account",
        icon: <CreditCard size={18} />,
        component: <Account />,
      }
    );
  }

  return (
    <div
      className={`w-full min-h-screen flex flex-col ${
        newRoomOpen
          ? "lg:!pb-[450px] md:!pb-[700px] !pb-[800px]"
          : "!pb-[350px] md:!pb-[0px] lg:!pb-[240px]"
      } md:pb-0 md:mb-20 lg:mb-20 p-2 mt-4 lg:p-0 lg:mt-10`}
    >
      <div className="lg:hidden w-full bg-purplebutton overflow-y-auto scrollbar-hide p-4 rounded-xl flex justify-center space-x-4 items-center">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            className={`flex items-center gap-1 px-3 md:px-4 py-2 text-white rounded-full cursor-pointer ${
              activeTab === tab.name ? "bg-bluebutton" : ""
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.icon} <span className="text-sm sm:text-base">{tab.name}</span>
          </div>
        ))}
      </div>

      <div className="flex w-full h-[380px] flex-col lg:flex-row sm:p-5 lg:px-20 lg:py-10">
        <div
          className={`w-full lg:w-[25%] rounded-xl bg-purplebutton px-6 py-5 hidden lg:block 
    ${tabs.length === 3 ? "h-[185px]" : "h-[280px]"}`}
        >
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={`flex items-center gap-2 p-3 pl-6 text-white rounded-full cursor-pointer ${
                activeTab === tab.name ? "bg-bluebutton" : ""
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.icon} <span>{tab.name}</span>
            </div>
          ))}
        </div>

        {/* Content Display */}
        <div className="w-full lg:w-[75%] py-4 px-2 text-black">
          {tabs.find((tab) => tab.name === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}
