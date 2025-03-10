"use client"
import React, { useEffect, useState } from "react";
import { Star, User } from "lucide-react";
import { db } from "@/firebase/firebaseConfig";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  
  const userType = useSelector((state) => state?.auth?.userInfo?.userType);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const collectionName = userType === "LandLord" ? "LandlordReviews" : "reviews";

        let q;
        if (userType === "Tenant") {
          q = query(collection(db, collectionName), where("userType", "==", "Tenant"), limit(6));
        } else {
          q = query(collection(db, collectionName), limit(6));
        }

        const querySnapshot = await getDocs(q);
        const fetchedReviews = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReviews(fetchedReviews);
      } catch (error) {
        toast.error("Error fetching reviews:", error);
      }
    };

    if (userType) {
      fetchReviews();
    }
  }, [userType]);

  return (
    <div className="max-w-7xl mx-auto p-9 my-16">
      <h1 className="text-[28px] font-bold text-center text-black mb-6">
        {userType === "Tenant" ? "What landlords say" : "What tenants say"} about this place
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
                {userType === "LandLord" ? (
                  <User className="w-14 h-14 text-gray-600 bg-gray-200 rounded-full p-2" />
                ) : (
                  <img
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
                  {item?.ratings?.Description} {item?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
