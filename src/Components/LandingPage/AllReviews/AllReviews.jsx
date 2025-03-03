import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/firebaseConfig";
import { useSelector } from "react-redux";
import { collection, query, where, limit, getDocs } from "firebase/firestore";

export default function Reviews() {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);

  // Get userType from Redux state
  const userType = useSelector((state) => state?.auth?.userInfo?.userType);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const collectionName = userType === "Landlord" ? "LandlordReviews" : "reviews";

        let q;
        if (userType === "Tenant") {
          // Explicitly filter for Tenant users
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
        console.error("Error fetching reviews:", error);
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
          <span className="font-semibold">5.0  &bull;  7 reviews</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reviews.map((item, index) => (
            <div key={index} className="p-4 bg-white">
              <div className="flex items-center space-x-4 mb-3">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-black">{item.userName}</h3>
                  <p className="text-gray-500 text-sm">
                    {item.createdAt?.seconds
                      ? new Date(item.createdAt.seconds * 1000).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Unknown date"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-700 text-[15px] sm:text-[16px] md:text-[17px]">
                  {item.description || item.ratings?.Description || "No review text available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
