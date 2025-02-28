"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "@/firebase/firebaseConfig";
import { serverTimestamp } from "firebase/firestore";


export default function WriteReview() {
  const router = useRouter();
  const dispatch = useDispatch();

  const selector = useSelector((state) => state);
  const userType = selector?.auth?.userInfo?.userType;
  const userId = selector?.auth?.userInfo?.uid;
  const userName = selector?.auth?.userInfo?.FullName;
  const category = "rating";

  const [ratings, setRatings] = useState({
    Description: "",
  });

  const handleStarClick = (category, index) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [category]: index + 1,
    }));
  };

  const handleChange = (e) => {
    setRatings((prev) => ({
      ...prev,
      Description: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("User not logged in!");
      return;
    }
  
    try {
      const reviewRef = doc(db, "LandlordReviews", userId); // Store reviews with userId as the document ID
  
      await setDoc(reviewRef, {
        userId,
        userName,
        userType,
        ratings,
        createdAt: serverTimestamp(), // Firestore timestamp for consistent date retrieval
      });
  
      toast.success("Review submitted successfully!");
  
      // Navigate to Properties Detail Page
      localStorage.setItem("fromProfile", "true");
      router.push("/Landing/Properties/PropertiesDetail");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-16 mb-10">
      <div className="flex flex-col justify-center items-center w-full max-w-[600px] space-y-6 p-4 sm:px-8 sm:py-12 bg-white border-[1.5px] rounded-2xl shadow-sm">
        <h1 className="font-semibold text-black text-2xl sm:text-2xl mb-6 text-center">
          Write review for user
        </h1>
        <div className="flex space-x-1 mb-3">
          {Array.from({ length: 5 }).map((_, starIndex) => (
            <Star
              key={starIndex}
              size={30}
              onClick={() => handleStarClick(category, starIndex)} // Use category instead of title
              className={
                starIndex < (ratings[category] || 0) // Check if rating exists, default to 0
                  ? "fill-[#FF9E35] text-[#FF9E35] cursor-pointer"
                  : "fill-[#D4CDC5] text-[#D4CDC5] cursor-pointer"
              }
            />
          ))}
        </div>
        ;
        <div className="w-full">
          <label
            htmlFor="description"
            className="text-black text-lg sm:text-[17px] font-medium block mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Write here..."
            className="w-full sm:w-[537px] h-[122px] p-4 border rounded-3xl resize-none "
            value={ratings.Description}
            onChange={handleChange}
          ></textarea>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full max-w-[215px] h-[53px] bg-bluebutton text-white text-base sm:text-lg font-medium py-3 rounded-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
