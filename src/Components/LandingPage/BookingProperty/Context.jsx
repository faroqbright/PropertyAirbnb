import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Star, Check } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { db } from "../../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { differenceInDays } from "date-fns";

export default function Context() {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");
  const [selectedServices, setSelectedServices] = useState([]);
  const [buttonText, setButtonText] = useState("Reserve");
  const [fromProfile, setFromProfile] = useState(false);
  const [property, setProperty] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [user, setuser] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [description, setdescription] = useState(null);
  const [name, setname] = useState(null);
  const [pricePerMonth, setPricePerMonth] = useState(null);
  const [location, setlocation] = useState(null);
  const [daysSelected, setDaysSelected] = useState(0);
  const userType = useSelector((state) => state.auth.userInfo?.userType);

  const updateDaysSelected = () => {
    const storedStartDate = localStorage.getItem("startDate");
    const storedEndDate = localStorage.getItem("endDate");

    if (storedStartDate && storedEndDate) {
      const startDate = new Date(storedStartDate);
      const endDate = new Date(storedEndDate);
      const days = differenceInDays(endDate, startDate) + 1;
      setDaysSelected(days);
    }
  };

  useEffect(() => {
    updateDaysSelected(); // Initial call

    // Listen for storage changes in other tabs
    const handleStorageChange = (event) => {
      if (event.key === "startDate" || event.key === "endDate") {
        updateDaysSelected();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Detect changes within the same tab
  useEffect(() => {
    const interval = setInterval(() => {
      updateDaysSelected();
    }, 500); // Check every 500ms

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!propertyId) {
      toast.error("Error Fetching the Property");
      return;
    }
    const fetchProperty = async () => {
      try {
        const propertyRef = doc(db, "properties", propertyId);
        const propertySnap = await getDoc(propertyRef);

        if (propertySnap.exists()) {
          const propertyData = { id: propertySnap.id, ...propertySnap.data() };
          setProperty(propertyData);
          setRooms(
            propertyData.rooms.map((room, index) => ({
              ...room,
              id: `room-${index + 1}`,
              name: `Room ${index + 1}`,
            }))
          );
          setServices(
            propertyData.additionalCosts.map((service, index) => ({
              ...service,
              id: `service-${index + 1}`,
              name: service.name,
              price: service.cost,
            }))
          );
          setname(propertyData?.name || null);
          setdescription(propertyData?.description || null);
          setPricePerMonth(propertyData?.pricePerMonth || null);
          setlocation(propertyData?.location || null);
          setuser(propertyData?.userId || null);
        } else {
          console.error("Property not found!");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    };

    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!user) {
        toast.error("No user ID found.");
        return;
      }

      const fetchUserDetails = async () => {
        try {
          const userRef = doc(db, "users", user);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserDetails(userSnap.data());
          } else {
            console.error("User  not found!");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [user]);

  useEffect(() => {
    if (localStorage.getItem("fromProfile")) {
      setButtonText("Message");
      setFromProfile(true);
    }

    const handleRouteChange = () => {
      localStorage.removeItem("fromProfile");
    };

    window.addEventListener("beforeunload", handleRouteChange);
    router.events?.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
      router.events?.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  const calculateProportion = () => {
    if (daysSelected <= 0) return 1; // Default to full month if no dates are selected

    const daysInMonth = 30; // Assuming a month has 30 days for calculation
    const proportion = daysSelected / daysInMonth;

    return proportion; // Always return the calculated proportion
  };

  const calculateAdjustedPrice = (basePrice) => {
    const proportion = calculateProportion();
    const adjustedPrice = (basePrice * proportion).toFixed(2); // Round to 2 decimal places
    return adjustedPrice;
  };

  const handleButtonClick = () => {
    if (!userType) {
      toast.error("Please login first.");
      router.push("/Auth/Login");
      return;
    }

    if (selectedRooms.length === 0 && selectedServices.length === 0) {
      toast.error("Please select at least one room.");
      return;
    }

    const startDate = localStorage.getItem("startDate");
    const endDate = localStorage.getItem("endDate");

    if (!startDate || !endDate) {
      toast.error("Please select a start and end date.");
      return;
    }

    const storedRooms = localStorage.getItem("selectedRooms");
    const storedServices = localStorage.getItem("selectedServices");

    if (storedRooms) {
      localStorage.removeItem("selectedRooms");
    }
    if (storedServices) {
      localStorage.removeItem("selectedServices");
    }

    const selectedRoomsDetails = rooms.filter((room) =>
      selectedRooms.includes(room.id)
    );
    const selectedServicesDetails = services.filter((service) =>
      selectedServices.includes(service.id)
    );

    const total = calculateTotal();

    console.log(selectedRoomsDetails);

    localStorage.setItem("selectedRooms", JSON.stringify(selectedRoomsDetails));
    localStorage.setItem(
      "selectedServices",
      JSON.stringify(selectedServicesDetails)
    );

    const propertyDetails = {
      name: name,
      location: location,
      description: description,
      price: pricePerMonth,
    };
    localStorage.setItem("propertyDetails", JSON.stringify(propertyDetails));
    localStorage.setItem("selectedProperty", JSON.stringify(property));

    router.push("/Landing/Properties/PropertiesDetail/Payment");
  };

  const calculateTotal = () => {
    const proportion = calculateProportion();

    const roomsTotal = rooms
      .filter((room) => selectedRooms.includes(room.id))
      .reduce((sum, room) => sum + Number(room.price) * proportion, 0);

    const servicesTotal = services
      .filter((service) => selectedServices.includes(service.id))
      .reduce((sum, service) => sum + Number(service.price) * proportion, 0);

    return (roomsTotal + servicesTotal).toFixed(2); // Round to 2 decimal places
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-10 lg:pr-20 lg:pl-32 min-[450px]:px-8 px-4 sm:px-28 pb-10 md:pb-0 lg:mx-0">
      <div className="lg:w-[60%] w-full px-3">
        <h1 className="font-bold text-black text-[24px] sm:text-[26px]">
          {location}
        </h1>
        <div className="mt-2">
          <p className="font-medium text-gray-600 text-[16px] sm:text-[18px]">
            {name}
          </p>
        </div>
        <div className="mt-8">
          <p className="text-gray-600 sm:text-[14px] text-[13px]">
            {description}
          </p>
        </div>

        <div className="mt-5 flex justify-start gap-2 border-gray-400 border-b pb-10">
          <button className="flex items-center space-x-1 hover:underline text-black font-semibold">
            <span>Show more</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="lg:w-[40%] w-full bg-[#B19BD9] text-white rounded-2xl p-6 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-5 border-gray-300">
          <div className="text-2xl font-medium">
            ${calculateAdjustedPrice(pricePerMonth)}{" "}
            <span className="text-lg text-gray-200 font-normal">
              {daysSelected && daysSelected !== 0
                ? `/ ${daysSelected} Day${daysSelected !== 1 ? "s" : ""}`
                : "/ 30 Days"}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
            <span>5.0</span>
            <span className="text-purple-200">· 7 reviews</span>
          </div>
        </div>

        <div className="space-y-3 pt-5">
          {rooms.map((room) => (
            <label
              key={room.id}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRooms.includes(room.id)}
                    onChange={(e) => {
                      setSelectedRooms(
                        e.target.checked
                          ? [...selectedRooms, room.id]
                          : selectedRooms.filter((id) => id !== room.id)
                      );
                    }}
                    className="hidden"
                  />
                  <span
                    className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all duration-200 ease-in-out ${
                      selectedRooms.includes(room.id)
                        ? "bg-white text-[#3CD9C8]"
                        : "bg-[#B19BD9]"
                    }`}
                  >
                    {selectedRooms.includes(room.id) && (
                      <Check className="w-5 h-5" />
                    )}
                  </span>
                </label>
                <span className="text-[15px] font-medium">{room.name}</span>
              </div>
              <span className="text-[15px] font-medium">
                ${calculateAdjustedPrice(room.price)}
              </span>
            </label>
          ))}
        </div>

        <div className="space-y-2 rounded-lg bg-purple-300 px-4 py-3 my-5">
          {services.map((service) => (
            <label
              key={service.id}
              className="relative flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedServices.includes(service.id)}
                onChange={(e) => {
                  setSelectedServices(
                    e.target.checked
                      ? [...selectedServices, service.id]
                      : selectedServices.filter((id) => id !== service.id)
                  );
                }}
                className="hidden"
              />
              <span
                className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all duration-200 ease-in-out ${
                  selectedServices.includes(service.id)
                    ? "bg-white text-[#3CD9C8]"
                    : "bg-[#B19BD9]"
                }`}
              >
                {selectedServices.includes(service.id) && (
                  <Check className="w-5 h-5" />
                )}
              </span>
              <div className="flex items-center justify-between ml-3 w-full">
                <span className="text-[15px] font-medium">{service.name}</span>
                <span className="text-[15px] font-medium">
                  ${calculateAdjustedPrice(service.price)}
                </span>
              </div>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 mb-5 border-t border-gray-300">
          <span className="font-medium text-[16px]">Total</span>
          <span className="text-xl font-bold">${calculateTotal()}</span>
        </div>

        {userType !== "LandLord" && (
          <button
            onClick={handleButtonClick}
            className="w-full cursor-pointer bg-bluebutton text-white rounded-full py-2"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}