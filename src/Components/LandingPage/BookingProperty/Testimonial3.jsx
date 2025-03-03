"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Star, User } from "lucide-react"; // ✅ Import User icon
import { useRouter } from "next/navigation";
import { db } from "@/firebase/firebaseConfig";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { useSelector } from "react-redux";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { useSelector } from "react-redux";

export default function Reviews() {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const selector = useSelector((state) => state);
  const userType = selector?.auth?.userInfo?.userType;
  const [step, setStep] = useState(null);

  useEffect(() => {
    if (userType) {
      setStep(userType === "Landlord" ? 0 : 1);
    }
  }, [userType]);
  const selector = useSelector((state) => state);
  const userType = selector?.auth?.userInfo?.userType;
  const [step, setStep] = useState(null);

  useEffect(() => {
    if (userType) {
      setStep(userType === "Landlord" ? 0 : 1);
    }
  }, [userType]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const collectionName =
          userType === "Landlord" ? "LandlordReviews" : "reviews";

        const q = query(
          collection(db, collectionName),
          limit(6) // ✅ Removed where() to avoid filtering issues
        );


        const querySnapshot = await getDocs(q);
        const fetchedReviews = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (userType) fetchReviews();
  }, [userType]);

  return (
    <div className="max-w-7xl mx-auto p-9">
      <h1 className="text-[28px] font-bold text-center text-black mb-6">
        What {userType === "Landlord" ? "Landlords" : "Tenants"} say about this
        place
      </h1>

      <div className="md:pl-24">
        <div className="flex items-start space-x-2 mb-8 pl-7">
          <Star fill="#FFBF2B" className="w-5 h-5 text-[#FFBF2B]" />
          <span className="font-semibold">
            5.0 &bull; {reviews.length} reviews
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reviews.map((item) => (
            <div key={item.id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center space-x-4 mb-3">
                {userType === "Landlord" ? (
                  <User className="w-14 h-14 text-gray-600 bg-gray-200 rounded-full p-2" />
                ) : (
                  <Image
                    src={item?.userImage || "/default-profile.png"}
                    alt={item.userName}
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-black">{item.userName}</h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(
                      item.createdAt?.seconds * 1000
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-700 text-[15px] sm:text-[16px] md:text-[17px]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => router.push("/Landing/AllReviews")}
          className="bg-bluebutton text-white px-7 h-10 rounded-full mb-10"
        >
          See more
        </button>
      </div>
    </div>
  );
}