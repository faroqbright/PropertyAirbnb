"use client";

import React, { useState } from "react";
import { Phone, Mail, Send } from "lucide-react";
import { db } from "../../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Header() {
  const [formData, setFormData] = useState({
    name: "",
    jobPosition: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const requiredFields = {
      name: "Name",
      jobPosition: "Job Position",
      email: "Email",
      phone: "Phone",
      message: "Message",
    };

    const emptyField = Object.entries(requiredFields).find(
      ([key]) => !formData[key]?.trim()
    );

    if (emptyField) {
      toast.error(`${emptyField[1]} is required!`);
      return;
    }

    
    try {
      await addDoc(collection(db, "contacts"), formData);
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        jobPosition: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Firestore Error:", error.code, error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen mt-14 mb-6 lg:px-10 mx-2">
      <div className="flex items-center justify-center mx-auto">
        <p className="lg:text-[34px] text-center text-[26px] font-bold text-gray-800">
          Get in Touch, Let’s Build{" "}
          <span className="md:hidden">Something Amazing Together</span>
        </p>
      </div>
      <div className="flex items-center justify-center mx-auto mb-10">
        <p className="lg:text-[34px] text-center hidden md:block text-[26px] font-bold text-gray-800">
          Something Amazing Together
        </p>
      </div>

      <div className="flex flex-wrap justify-between lg:p-4 p-0 mb-14 lg:mx-14 mx-2 space-y-4 sm:space-y-0">
        <div className="w-full mx-auto sm:w-[70%] lg:w-[40%] flex flex-col bg-[#AF99D6] p-10 text-white rounded-2xl">
          <h1 className="text-[28px] lg:text-[32px] font-bold">Contact Us</h1>
          <p className="mt-2 text-[13px] lg:text-[14px] text-gray-100">
            Let’s make AI the cornerstone of your sustainable journey. Reach out
            for a free AI-driven consultation.
          </p>
          <div className="mt-12 space-y-6">
            <p className="font-medium text-[14px] lg:text-[15px] flex items-center">
              <div className="lg:w-8 lg:h-8 w-6 h-6 mr-2 rounded-full border-[1.5px] border-white flex items-center justify-center p-1.5">
                <Phone className="w-full h-full" />
              </div>
              +1 (123) 456-7890
            </p>
            <p className="font-medium text-[14px] lg:text-[15px] flex items-center">
              <div className="lg:w-8 lg:h-8 w-6 h-6 mr-2 rounded-full border-[1.5px] border-white flex items-center justify-center p-1.5">
                <Mail className="w-full h-full" />
              </div>
              contact@coLive.com
            </p>
            <p className="font-medium text-[14px] lg:text-[15px] flex items-center">
              <div className="lg:w-8 lg:h-8 w-6 h-6 mr-2 rounded-full border-[1.5px] border-white flex items-center justify-center p-1.5">
                <Send className="w-full h-full" />
              </div>
              c/o eNavis AG, Germany
            </p>
          </div>
        </div>

        <div className="w-full mx-auto sm:w-[60%] flex flex-col bg-white lg:px-16 py-6">
          <form
            className="space-y-4 flex-grow lg:-mb-5 lg:-mt-3 mt-5"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <label className="block">
                <span className="font-medium text-[15px] ml-1">Your Name*</span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Ex. Saul Ramirez"
                  className="w-full px-3 py-2 mt-1 pl-4 border-[1.5px] border-[#D2D2D2] rounded-full"
                />
              </label>
              <label className="block">
                <span className="font-medium text-[15px] ml-1">
                  Job Position*
                </span>
                <input
                  type="text"
                  name="jobPosition"
                  value={formData.jobPosition}
                  onChange={handleChange}
                  placeholder="Ex. Chief Technology Officer"
                  className="w-full px-3 py-2 mt-1 pl-4 border-[1.5px] border-[#D2D2D2] rounded-full"
                />
              </label>
              <label className="block">
                <span className="font-medium text-[15px] ml-1">
                  Email Address*
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@example.com"
                  className="w-full px-3 py-2 mt-1 pl-4 border-[1.5px] border-[#D2D2D2] rounded-full"
                />
              </label>
              <label className="block">
                <span className="font-medium text-[15px] ml-1">
                  Phone Number*
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ex. +44XXXXXXXXXX"
                  className="w-full px-3 py-2 mt-1 pl-4 border-[1.5px] border-[#D2D2D2] rounded-full"
                />
              </label>
            </div>
            <label className="block">
              <span className="font-medium text-[15px] ml-1">
                Your Message*
              </span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message..."
                className="w-full px-3 py-2 mt-1 pl-4 border-[1.5px] border-[#D2D2D2] rounded-xl h-24"
              ></textarea>
            </label>
            <button
              type="submit"
              className="w-full bg-[#3BD5C5] text-white px-3 py-2.5 rounded-full hover:bg-[#32b5ae]"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
