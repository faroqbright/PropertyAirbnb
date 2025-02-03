"use client";

import { useState } from "react";
import { Search, Paperclip, Mic, Send, MoreVertical, Menu } from "lucide-react";
import Image from "next/image";

export default function Inbox() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      userId: 1,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled.",
      sender: "Hassan Khalid",
      time: "12:00 AM",
      isSentByUser: false,
    },
    {
      id: 2,
      userId: 1,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      sender: "Hassan Khalid",
      time: "12:05 AM",
      isSentByUser: false,
    },
    {
      id: 3,
      userId: 1,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      sender: "You",
      time: "12:10 AM",
      isSentByUser: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const users = [
    {
      id: 1,
      image: "/assets/user1.png",
      name: "Hassan Raheem",
      description: "Lorem ipsum has been....",
      time: "12:00 AM",
      online: true,
      messagesNo: 2,
    },
    {
      id: 2,
      image: "/assets/user2.png",
      name: "Hassan Raheem",
      description: "Lorem ipsum has been....",
      time: "12:00 AM",
      online: true,
      messagesNo: 2,
    },
    {
      id: 3,
      image: "/assets/user3.png",
      name: "Hassan Raheem",
      description: "Lorem ipsum has been....",
      time: "12:00 AM",
      online: true,
      messagesNo: 2,
    },
    {
      id: 4,
      image: "/assets/user4.png",
      name: "Hassan Raheem",
      description: "Lorem ipsum has been....",
      time: "12:00 AM",
      online: true,
      messagesNo: 2,
    },
    {
      id: 5,
      image: "/assets/user5.png",
      name: "Hassan Raheem",
      description: "Lorem ipsum has been....",
      time: "12:00 AM",
      online: true,
      messagesNo: 2,
    },
    {
      id: 6,
      image: "/assets/user6.png",
      name: "Hassan Raheem",
      description: "Lorem ipsum has been....",
      time: "12:00 AM",
      online: true,
      messagesNo: 2,
    },
    {
      id: 7,
      image: "/assets/user1.png",
      name: "Hassan Raheem",
      description: "Lorem ipsum has been....",
      time: "12:00 AM",
      online: true,
      messagesNo: 2,
    },
    {
      id: 8,
      image: "/assets/user2.png",
      name: "Hassan Raheem",
      description: "Lorem ipsum has been....",
      time: "12:00 AM",
      online: true,
      messagesNo: 2,
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        userId: 1,
        text: newMessage,
        sender: "You",
        time: new Date().toLocaleTimeString(),
        isSentByUser: true,
      };

      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[561px] bg-white border-[2px] rounded-2xl -mt-5 mb-20">
      <div className="w-full md:w-80 md:border-r flex flex-col ">
        <div className="p-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 rounded-full text-[#3CD9C8]" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-full placeholder:text-black text-black"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-start p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="relative">
                <Image
                  src={user.image}
                  alt="User Image"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-black">{user.name}</h3>
                  <span className="text-xs text-black ">{user.time}</span>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-500 truncate">
                    {user.description}
                  </p>
                  <span className="bg-[#B19BD9] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {user.messagesNo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-3 lg:px-6 rounded-tr-xl py-4 border-b bg-gray-200">
          <div className="flex items-center">
            <div className="lg:hidden block">
              <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="w-6 h-6 mr-3 text-black" />
              </button>
            </div>
            <div className="relative">
              <Image
                src="/assets/user7.png"
                alt="Active user"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="ml-3">
              <h2 className="font-semibold text-black">Hassan Khalid</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <button className="bg-[#3CD9C8] rounded-full w-[135px] h-10">
              View Property
            </button>
            <button className="p-2 text-[#B19BD9] hover:bg-gray-100 rounded-full">
              <MoreVertical className="w-6 h-6 text-[#B19BD9]" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end mb-4 ${
                message.isSentByUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  message.isSentByUser
                    ? "bg-slate-200 text-black"
                    : "bg-[#B19BD9] text-white"
                } rounded-t-2xl ${
                  message.isSentByUser ? "rounded-bl-2xl" : "rounded-br-2xl"
                } p-4`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {message.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            <input
              type="text"
              placeholder="Aa"
              className="flex-1 mx-4 bg-[#F5F5F5] text-black focus:outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Mic className="w-5 h-5 text-gray-500" />
              </button>
              <button
                className="p-2 bg-teal-400 hover:bg-teal-500 rounded-full"
                onClick={handleSendMessage}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
