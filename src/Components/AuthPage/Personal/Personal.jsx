"use client";
import React, { useState, useEffect, useRef } from "react";
import { Camera, Check, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

const Personal = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [sexOrientation, setSexOrientation] = useState("");
  const [activeButtons, setActiveButtons] = useState([]);
  const [activePetButtons, setActivePetButtons] = useState([]);
  const [activeSmokeButtons, setActiveSmokeButtons] = useState([]);
  const [activeDrinkButtons, setActiveDrinkButtons] = useState([]);
  const [activeDietButtons, setActiveDietButtons] = useState([]);
  const [userUID, setUserUID] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const storedUID = localStorage.getItem("userUID");
    if (storedUID) {
      setUserUID(storedUID);
    }
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleNext = async () => {
    let isValid = true;
    if (step === 1) {
      if (!birth || !gender || !sexOrientation) {
        isValid = false;
        toast.error("Please fill in all personal information fields.");
      } else {
        setUserData((prevData) => ({
          ...prevData,
          birth,
          gender,
          sexOrientation,
        }));
      }
    } else if (step === 2) {
      if (activeButtons.length === 0) {
        isValid = false;
        toast.error("Please select at least one hobby.");
      } else {
        setUserData((prevData) => ({
          ...prevData,
          hobbies: activeButtons.map((index) => namesArray[index]),
        }));
      }
    } else if (step === 3) {
      if (activePetButtons.length === 0) {
        isValid = false;
        toast.error("Please select at least one option for pet preference.");
      } else {
        setUserData((prevData) => ({
          ...prevData,
          petFriendly: activePetButtons.map(
            (index) => ["Cat", "Dog", "Allergic to Pets"][index]
          ),
        }));
      }
    } else if (step === 4) {
      if (activeDrinkButtons.length === 0) {
        isValid = false;
        toast.error("Please select at least one option for drinking habits.");
      } else {
        setUserData((prevData) => ({
          ...prevData,
          drinkingHabits: activeDrinkButtons.map(
            (index) => ["Outside", "InHouse"][index]
          ),
        }));
      }
    } else if (step === 5) {
      if (activeSmokeButtons.length === 0) {
        isValid = false;
        toast.error("Please select at least one option for smoking habits.");
      } else {
        setUserData((prevData) => ({
          ...prevData,
          smokingHabits: activeSmokeButtons.map(
            (index) => ["Outside", "InHouse"][index]
          ),
        }));
      }
    } else if (step === 6) {
      if (activeDietButtons.length === 0) {
        isValid = false;
        toast.error(
          "Please select at least one option for dietary preferences."
        );
      } else {
        setUserData((prevData) => ({
          ...prevData,
          dietaryPreferences: activeDietButtons.map(
            (index) => ["Vegan", "Vegetarian", "Omnivore"][index]
          ),
        }));
      }
    }

    if (isValid) {
      if (step === 6) {
        if (!userUID) {
          toast.error("User not found. Please sign up first.");
          return;
        }
        try {
          const userRef = doc(db, "users", userUID);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            await setDoc(userRef, { personalInfo: userData }, { merge: true });
            toast.success("Personal data updated successfully!");
            setStep(step + 1);
            localStorage.removeItem('userUID');
          } else {
            toast.error("User not found in database. Please sign up first.");
          }
        } catch (error) {
          console.error("Error updating Firestore document: ", error);
          toast.error("Failed to update personal data. Please try again.");
        }
      } else {
        setStep(step + 1);
      }
    }
  };

  const namesArray = [
    "Gym",
    "Running",
    "Moving",
    "Moving",
    "Running",
    "Moving",
    "Gym",
    "Martail",
  ];

  const handleClick = (index) => {
    if (activeButtons.includes(index)) {
      setActiveButtons(activeButtons.filter((i) => i !== index));
    } else {
      setActiveButtons([...activeButtons, index]);
    }
  };

  const handleToggleButton = (index) => {
    if (activePetButtons.includes(index)) {
      setActivePetButtons(activePetButtons.filter((i) => i !== index));
    } else {
      setActivePetButtons([...activePetButtons, index]);
    }
  };

  const handleToggleDrinkButton = (index) => {
    if (activeDrinkButtons.includes(index)) {
      setActiveDrinkButtons(activeDrinkButtons.filter((i) => i !== index));
    } else {
      setActiveDrinkButtons([...activeDrinkButtons, index]);
    }
  };

  const handleToggleSmokeButton = (index) => {
    if (activeSmokeButtons.includes(index)) {
      setActiveSmokeButtons(activeSmokeButtons.filter((i) => i !== index));
    } else {
      setActiveSmokeButtons([...activeSmokeButtons, index]);
    }
  };

  const handleToggleDietButton = (index) => {
    if (activeDietButtons.includes(index)) {
      setActiveDietButtons(activeDietButtons.filter((i) => i !== index));
    } else {
      setActiveDietButtons([...activeDietButtons, index]);
    }
  };

  return (
    <div className="flex items-center justify-center w-full mb-10 mt-10">
      {step === 1 ? (
        <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 py-14 lg:px-14 px-5 flex flex-col">
          <div className="flex bg-gray-200 rounded-full w-60 lg:w-72 m-auto lg:flex-row"></div>

          <div className="mt-10 text-center text-textclr text-2xl font-semibold">
            <h1>Personal Information!</h1>
          </div>

          <div className="flex items-center justify-center h-full mt-10 text-textclr">
            <Camera
              className="p-7 bg-gray-300 rounded-full text-textclr"
              size={90}
            />
          </div>

          <div className="mt-10">
            <div className="mt-5 relative">
              <label className="text-textclr" htmlFor="birth">
                Birth
              </label>
              <br />
              <div
                className="relative w-full border-[1.5px] mt-3 pl-3 pr-5 rounded-full cursor-pointer"
                onClick={() => inputRef.current?.showPicker()}
              >
                <input
                  type="date"
                  id="birth"
                  name="birth"
                  ref={inputRef}
                  className="w-full py-2 cursor-pointer bg-transparent focus:outline-none"
                  value={birth}
                  onChange={(e) => setBirth(e.target.value)}
                  max={getTodayDate()}
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="text-textclr" name="number">
                Gender
              </label>
              <br />
              <input
                type="text"
                name="number"
                placeholder="Enter Gender"
                className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>

            <div className="mt-5">
              <label className="text-textclr" name="password">
                Sex Orientation
              </label>
              <br />
              <input
                type="text"
                name="password"
                placeholder="Enter Sex"
                className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
                value={sexOrientation}
                onChange={(e) => setSexOrientation(e.target.value)}
              />
            </div>

            <div className="mt-5">
              <button
                className="w-full text-center mt-5 border-[1.5px] py-2 text-white bg-bluebutton rounded-full"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : step === 2 ? (
        <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 py-14 lg:px-14 px-5 flex flex-col">
          <h1 className="text-textclr font-semibold text-2xl mb-3 text-center my-10">
            Hobbies
          </h1>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-5 my-4 px-5 mb-9 mt-10">
            {namesArray.map((name, index) => (
              <button
                key={index}
                className={`border rounded-full py-2 px-5 w-full my-2 text-center ${
                  activeButtons.includes(index)
                    ? "bg-[#B19BD9] text-white"
                    : "text-[#737373]"
                }`}
                onClick={() => handleClick(index)}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <button
              className="w-full text-center mt-5 border-[1.5px] py-2 text-white bg-bluebutton rounded-full "
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      ) : step === 3 ? (
        <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 py-14 lg:px-14 px-5 flex flex-col">
          <div className="mb-14 mt-10">
            <h1 className="text-center text-textclr font-bold text-xl">
              Pet Friendly
            </h1>
          </div>
          <div className="space-y-4 mb-10">
            {["Cat", "Dog", "Allergic to Pets"].map((label, index) => (
              <button
                key={index}
                onClick={() => handleToggleButton(index)}
                className={`w-full flex items-center justify-between rounded-full border-[1.5px] px-4 py-2 ${
                  activePetButtons.includes(index)
                    ? "bg-purplebutton text-white"
                    : "border-gray-200 text-[#737373]"
                }`}
              >
                <span>{label}</span>
                <span className="ml-2 active:mb-0">
                  {activePetButtons.includes(index) ? (
                    <Check />
                  ) : (
                    <Plus size={16} className="mb-0.5" />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 mb-10">
            <button
              className="w-full text-center mt-5 border-[1.5px] py-2 text-white bg-bluebutton rounded-full"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      ) : step === 4 ? (
        <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 py-14 lg:px-14 px-5 flex flex-col">
          <div className="mb-14 mt-10">
            <h1 className="text-center text-textclr font-bold text-xl">
              Drinking Habits
            </h1>
          </div>
          <div className="space-y-4 mb-10">
            {["Outside", "InHouse"].map((label, index) => (
              <button
                key={index}
                onClick={() => handleToggleDrinkButton(index)}
                className={`w-full flex items-center justify-between rounded-full border-[1.5px] px-4 py-2 ${
                  activeDrinkButtons.includes(index)
                    ? "bg-purplebutton text-white"
                    : "border-gray-200 text-[#737373]"
                }`}
              >
                <span>{label}</span>
                <span className="ml-2">
                  {activeDrinkButtons.includes(index) ? (
                    <Check />
                  ) : (
                    <Plus size={16} className="mb-0.5" />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 mb-10">
            <button
              className="w-full text-center mt-5 border-[1.5px] py-2 text-white bg-bluebutton rounded-full"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      ) : step === 5 ? (
        <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 py-14 lg:px-14 px-5 flex flex-col">
          <div className="mb-14 mt-10">
            <h1 className="text-center text-textclr font-bold text-xl">
              Smoking Habits
            </h1>
          </div>
          <div className="space-y-4 mb-10">
            {["Outside", "InHouse"].map((label, index) => (
              <button
                key={index}
                onClick={() => handleToggleSmokeButton(index)}
                className={`w-full flex items-center justify-between rounded-full border-[1.5px] px-4 py-2 ${
                  activeSmokeButtons.includes(index)
                    ? "bg-purplebutton text-white"
                    : "border-gray-200 text-[#737373]"
                }`}
              >
                <span>{label}</span>
                <span className="ml-2">
                  {activeSmokeButtons.includes(index) ? (
                    <Check />
                  ) : (
                    <Plus size={16} className="mb-0.5" />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 mb-10">
            <button
              className="w-full text-center mt-5 border-[1.5px] py-2 text-white bg-bluebutton rounded-full"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      ) : step === 6 ? (
        <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 py-14 lg:px-14 px-5 flex flex-col">
          <div className="mb-14 mt-10">
            <h1 className="text-center text-textclr font-bold text-xl">
              Dietry Prefrences
            </h1>
          </div>
          <div className="space-y-4 mb-10">
            {["Vegan", "Vegetarian", "Omnivore"].map((label, index) => (
              <button
                key={index}
                onClick={() => handleToggleDietButton(index)}
                className={`w-full flex items-center justify-between rounded-full border-[1.5px] px-4 py-2 ${
                  activeDietButtons.includes(index)
                    ? "bg-purplebutton text-white"
                    : "border-gray-200 text-[#737373]"
                }`}
              >
                <span>{label}</span>
                <span className="ml-2">
                  {activeDietButtons.includes(index) ? (
                    <Check />
                  ) : (
                    <Plus size={16} className="mb-0.5" />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 mb-10">
            <button
              className="w-full text-center mt-5 border-[1.5px] py-2 text-white bg-bluebutton rounded-full"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      ) : step === 7 ? (
        <div className="w-full max-w-lg bg-purplebutton rounded-3xl shadow-lg mx-auto p-8">
          <div className="text-center text-white">
            <p className="text-lg font-medium">
              Your account registration request has been sent to the admin. Your
              account will be created once approved.
            </p>

            <div className="flex justify-center items-center mt-8">
              <div className="p-4 rounded-full border-[1.5px]">
                <Check size={50} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Personal;
