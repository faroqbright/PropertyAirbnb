"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Heart,
  Star,
} from "lucide-react";
import { db } from "../../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  query,
  where,
} from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

export default function Card({ filters = {} }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;
  const [properties, setProperties] = useState([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [userType, setUserType] = useState("");
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [favorites, setFavorites] = useState([]); // State for user's favorite properties
  const [reviews, setReviews] = useState({}); // State to hold reviews for each property
  const [avgRatings, setAvgRatings] = useState({});

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const propertiesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(propertiesList);
        setTotalProperties(propertiesList.length);
      } catch (error) {
        console.error("Error fetching properties: ", error);
      }
    };

    fetchProperties();
  }, []);

  // Fetch user's favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (userInfo) {
        const userFavoritesRef = doc(
          db,
          "users",
          userInfo.uid,
          "favorites",
          "favorites"
        );
        const docSnap = await getDoc(userFavoritesRef);
        if (docSnap.exists()) {
          setFavorites(docSnap.data().favorites || []);
        }
      }
    };

    fetchFavorites();
  }, [userInfo]);

  // Set user type
  useEffect(() => {
    if (userInfo) {
      setUserType(userInfo?.userType);
    }
  }, [userInfo]);

  // Filter properties based on filters
  const { location = "", budget = 0, amenities = [], rooms = "" } = filters;

  const filteredProperties = properties.filter((property) => {
    const matchesLocation = location
      ? property.location?.toLowerCase().includes(location.toLowerCase())
      : true;

    const propertyPrice = Number(property.pricePerMonth) || 0;
    const filterBudget = Number(budget) || 0;
    const matchesBudget =
      filterBudget > 0 ? propertyPrice <= filterBudget : true;

    const matchesAmenities =
      amenities.length > 0
        ? amenities.every((amenityId) =>
            property.amenities?.includes(amenityId)
          )
        : true;

    const propertyRooms = Number(property.rooms?.length) || 0;
    const filterRooms = Number(rooms) || 0;
    const matchesRooms = filterRooms > 0 ? propertyRooms === filterRooms : true;

    return matchesLocation && matchesBudget && matchesAmenities && matchesRooms;
  });

  // Fetch reviews and calculate average ratings for filtered properties
  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsData = {};
      const avgRatingsData = {};

      for (const property of filteredProperties) {
        const reviewsQuery = query(
          collection(db, "reviews"),
          where("propertyId", "==", property.id)
        );

        try {
          const querySnapshot = await getDocs(reviewsQuery);
          const reviewsList = [];
          let totalAvgRating = 0;

          querySnapshot.forEach((doc) => {
            const review = { id: doc.id, ...doc.data() };
            reviewsList.push(review);
            totalAvgRating += review.AvgRating || 0;
          });

          const avgRating =
            reviewsList.length > 0
              ? (totalAvgRating / reviewsList.length).toFixed(1)
              : null;

          reviewsData[property.id] = reviewsList;
          avgRatingsData[property.id] = avgRating;
        } catch (error) {
          console.error(
            `Error fetching reviews for property ${property.id}: `,
            error
          );
        }
      }

      setReviews(reviewsData); // Stores all reviews per property
      setAvgRatings(avgRatingsData); // Stores calculated avgRating per property
    };

    if (filteredProperties.length > 0) {
      fetchReviews();
    }
  }, [filteredProperties]);

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Toggle favorite functionality
  const toggleFavorite = async (propertyId) => {
    if (!userInfo) {
      console.log("User not logged in");
      return;
    }

    const propertyRef = doc(db, "properties", propertyId);

    try {
      const propertySnap = await getDoc(propertyRef);
      if (propertySnap.exists()) {
        const favoritedBy = propertySnap.data().favoritedBy || [];
        const isFavorited = favoritedBy.includes(userInfo.uid);

        if (isFavorited) {
          // Remove the user's ID from the favoritedBy array
          await updateDoc(propertyRef, {
            favoritedBy: arrayRemove(userInfo.uid),
          });
        } else {
          // Add the user's ID to the favoritedBy array
          await updateDoc(propertyRef, {
            favoritedBy: arrayUnion(userInfo.uid),
          });
        }

        // Update local state
        setFavorites(
          (prevFavorites) =>
            isFavorited
              ? prevFavorites.filter((id) => id !== propertyId) // Remove from favorites
              : [...prevFavorites, propertyId] // Add to favorites
        );
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 min-[450px]:px-10 sm:px-4 lg:px-10 py-8 mt-5 mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProperties.map((property) => (
          <div
            key={property.id}
            className="relative bg-white rounded-xl overflow-hidden cursor-pointer group border"
            onClick={() => {
              localStorage.removeItem("startDate");
              localStorage.removeItem("endDate");
              setTimeout(() => {
                router.push(
                  `/Landing/Properties/PropertiesDetail?id=${property.id}`
                );
              }, 100);
            }}
          >
            <div className="relative h-[200px] w-full overflow-hidden">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                className="h-full w-full"
              >
                {property.imageUrls.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={property.name}
                      className="h-full w-full object-cover rounded-t-xl"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              {avgRatings[property.id] > 4 && (
                <div className="absolute top-2 left-2 text-black bg-white px-2 py-1 text-sm rounded-2xl font-medium text-[14px] z-50">
                  Guest Favourite
                </div>
              )}
              <Heart
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(property.id);
                }}
                className={`absolute top-2 right-2 h-6 w-6 text-black z-10 ${
                  property.favoritedBy?.includes(userInfo?.uid) ||
                  favorites.includes(property.id)
                    ? "fill-[#FDA4AF] text-[#F86D83]" // Active (Pink)
                    : "fill-transparent/25" // Inactive
                }`}
              />
            </div>

            <div className="py-6 space-y-1 px-4">
              <div className="flex items-center justify-between pr-1">
                <h2 className="text-[16px] font-medium text-[#222222]">
                  {property.location || property.name}
                </h2>
                {avgRatings[property.id] ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-[15px] w-[15px] text-black fill-black" />
                    <span>{avgRatings[property.id]}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Star className="h-[15px] w-[15px]" />
                    <span>No rating</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-[#6A6A6A]">
                {property.rooms?.length || 0} rooms
              </p>
              <p className="text-sm text-[#222222]">
                ${property.pricePerMonth}/month
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-1 sm:space-x-2 pt-10">
        <button
          className="p-2 hidden sm:block rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={18} />
        </button>
        {[...Array(totalPages).keys()].slice(0, 12).map((page) => (
          <button
            key={page + 1}
            className={`w-8 h-8 rounded-full border ${
              currentPage === page + 1
                ? "bg-teal-400 text-white"
                : "border-gray-300 bg-white hover:bg-gray-100"
            }`}
            onClick={() => goToPage(page + 1)}
          >
            {page + 1}
          </button>
        ))}
        {totalPages > 3 && <span className="px-2">...</span>}
        {totalPages > 3 && (
          <button
            className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
            onClick={() => goToPage(totalPages)}
          >
            {totalPages}
          </button>
        )}
        <button
          className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={18} />
        </button>
        <button
          className="p-2 hidden sm:block rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}
