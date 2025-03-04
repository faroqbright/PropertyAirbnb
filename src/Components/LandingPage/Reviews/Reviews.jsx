"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../../firebase/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // Import serverTimestamp
import { toast } from "react-toastify";

export default function WriteReview() {
  const reviewTitles = ["Organization", "Communication", "Honesty"];
  const [user, setuser] = useState([]);
  const router = useRouter();
  const selector = useSelector((state) => state);

  const userType = selector?.auth?.userInfo?.userType;
  const userId = selector?.auth?.userInfo?.uid;
  const userName = selector?.auth?.userInfo?.FullName;
  const userImage =
    selector?.auth?.userInfo?.personalInfo?.image || "/default-profile.png";

  if (userType === "LandLord") {
    router.push("/Landing/Profile/Details/Reviews");
  } else {
    const [ratings, setRatings] = useState({
      Organization: 0,
      Communication: 0,
      Honesty: 0,
      Description: "",
    });

    const handleStarClick = (category, index) => {
      setRatings((prevRatings) => ({
        ...prevRatings,
        [category]: index + 1, // Set clicked star rating
      }));
    };

    // Handle Submit Review
    const handleSubmit = async () => {
      if (!userId) {
        toast.error("User not logged in!");
        return;
      }

      try {
        const reviewRef = doc(db, "reviews", userId); // Store reviews with userId as the document ID

        await setDoc(reviewRef, {
          userId,
          userName,
          userType,
          userImage,
          organization: ratings.Organization,
          communication: ratings.Communication,
          honesty: ratings.Honesty,
          description: ratings.Description,
          createdAt: serverTimestamp(), // Store timestamp
        });

        toast.success("Review submitted successfully!");
        router.push("/Landing/Properties/PropertiesDetail");
      } catch (error) {
        console.error("Error submitting review:", error);
        toast.error("Failed to submit review. Please try again.");
      }
    };
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-16 mb-10">
      <div className="flex flex-col justify-center items-center w-full max-w-[600px] space-y-6 p-4 sm:px-8 sm:py-12 bg-white border-[1.5px] rounded-2xl shadow-sm">
        <h1 className="font-semibold text-black text-xl sm:text-2xl mb-6 text-center">
          Write review for coLiver
        </h1>

        {reviewTitles.map((title) => (
          <div key={title} className="w-full flex flex-col items-center">
            <span className="text-black text-base font-medium sm:text-lg text-[#000000BD] mb-3">
              {title}
            </span>
            <div className="flex space-x-1 mb-3">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star
                  key={starIndex}
                  size={30}
                  onClick={() => handleStarClick(title, starIndex)}
                  className={
                    starIndex < ratings[title]
                      ? "fill-[#FF9E35] text-[#FF9E35] cursor-pointer"
                      : "fill-[#D4CDC5] text-[#D4CDC5] cursor-pointer"
                  }
                />
              ))}
            </div>
          </div>
        ))}

        <div className="w-full">
          <label
            htmlFor="description"
            className="text-black text-base sm:text-[17px] font-medium block mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Write here..."
            className="w-full sm:w-[537px] h-[96px] p-4 border rounded-3xl resize-none overflow-auto scrollbar-hide"
            value={ratings.Description}
            onChange={(e) =>
              setRatings((prevRatings) => ({
                ...prevRatings,
                Description: e.target.value,
              }))
            }
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
