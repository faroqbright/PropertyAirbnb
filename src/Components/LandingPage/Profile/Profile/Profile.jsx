"use client";
import { CameraIcon, Plus, Star, X } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { db } from "@/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { setUserInfo } from "@/features/auth/authSlice";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
const auth = getAuth();

const defaultHobbies = ["Gym", "Running"];
const defaultPreferences = [
  "Allergic to pets",
  "Vegetarian",
  "Smoker",
  "In house",
];

export default function Bookings() {
  const [status, setStatus] = useState("Info");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedOtherImage, setOtherUploadedImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  console.log(userInfo);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.FullName || "");
      setEmail(userInfo.email || "");
      setNumber(userInfo.number || "");
      setSelectedHobbies(userInfo.hobbies || []);
      setSelectedPreferences(userInfo.preferences || []);
    }
  }, [userInfo]);

  const handleToggle = (newStatus) => {
    setStatus(newStatus);
  };
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  const handleOtherImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOtherUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleOtherRemoveImage = () => {
    setOtherUploadedImage(null);
  };

  const router = useRouter();

  const handleNagigate = () => {
    router.push("/Auth/ChangePassword");
  };

  const handleVerifyEmail = async () => {
    setVerifyingEmail(true);
    try {
      if (!userInfo || !userInfo.uid) {
        toast.error("User information not found. Please login again.");
        return;
      }

      const userDocRef = doc(db, "users", userInfo.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        toast.error("User document not found.");
        return;
      }

      const userData = userDoc.data();

      if (userData.email !== email) {
        // Email has been changed, proceed with verification and login
        try {
          // No actual email sending here.  Just simulate the process.
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay

          // After "verification", update the user document and Redux store
          await updateDoc(userDocRef, { email });

          const updatedUserInfo = { ...userInfo, email };
          dispatch(setUserInfo(updatedUserInfo));

          // Simulate re-login with new email (in a real app, you would use Firebase Auth)
          try {
            await signInWithEmailAndPassword(auth, email, "tempPassword"); // Replace "tempPassword" with a temporary password or method to handle password change.
            toast.success(
              "Email updated and user logged in with the new email!"
            );
          } catch (loginError) {
            console.error("Re-login error:", loginError);
            toast.error(
              "Error during re-login. Please login manually with the new email."
            );
          }
        } catch (verificationError) {
          console.error("Email verification error:", verificationError);
          toast.error("Email verification failed. Please try again.");
        }
      } else {
        toast.info("Email address is the same. No verification needed.");
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleSaveChanges = async () => {
    setLoadingSave(true);

    try {
      if (!userInfo || !userInfo.uid) {
        toast.error("User information not found. Please login again.");
        return;
      }

      const updatedUserInfo = {
        ...userInfo,
        FullName: name,
        email: email,
        number: number,
      };

      dispatch(setUserInfo(updatedUserInfo));

      const userDocRef = doc(db, "users", userInfo.uid);

      const updatedData = {};
      if (status === "Info") {
        updatedData.FullName = name;
        updatedData.email = email;
        updatedData.number = number;
      } else if (status === "Lifestyle") {
        updatedData.hobbies = selectedHobbies;
        updatedData.preferences = selectedPreferences;

        if (loadingSave) { items
          updatedData.hobbies = [];
          updatedData.preferences = [];
          updatedUserInfo.hobbies = [];
          updatedUserInfo.preferences = [];
          setSelectedHobbies([]);
          setSelectedPreferences([]);
          toast.info("Selected hobbies and preferences cleared.");
        } else {
          updatedData.hobbies = selectedHobbies;
          updatedData.preferences = selectedPreferences;
          updatedUserInfo.hobbies = selectedHobbies;
          updatedUserInfo.preferences = selectedPreferences;
        }
      }

      await updateDoc(userDocRef, updatedData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleHobbyToggle = (hobby) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter((h) => h !== hobby));
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
  };

  const handlePreferenceToggle = (preference) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(
        selectedPreferences.filter((p) => p !== preference)
      );
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  return (
    <>
      <div className="flex justify-end space-x-2 mb-5 lg:-mt-20">
        <button
          className={`px-4 w-32 py-2.5 text-sm font-medium rounded-full ${
            status === "Info"
              ? "bg-purplebutton text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => handleToggle("Info")}
        >
          Info
        </button>
        <button
          className={`px-4 w-32 py-2.5 text-sm font-medium rounded-full ${
            status === "Lifestyle"
              ? "bg-purplebutton text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => handleToggle("Lifestyle")}
        >
          Lifestyle
        </button>
      </div>
      {status === "Lifestyle" ? (
        <div className="w-full bg-white rounded-xl border-[1.5px] border-gray-200 px-6 pt-2 pb-5 sm:pb-10 sm:pt-5">
          <div className="flex flex-wrap px-4 mt-6 w-full justify-between gap-4">
            <div className="w-full sm:w-[48%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-bluebutton rounded-full inline-block mr-2 mb-0.5"></span>
                Hobbies
              </h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {defaultHobbies.map((hobby) => (
                  <button
                    key={hobby}
                    className={`text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 transition-all duration-200 focus:border-none focus:bg-bluebutton focus:text-white
                      ${
                        selectedHobbies.includes(hobby)
                          ? "bg-bluebutton text-white border-none"
                          : ""
                      }`}
                    onClick={() => handleHobbyToggle(hobby)}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full sm:w-[48%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-bluebutton rounded-full inline-block mr-2 mb-0.5"></span>
                Preferences
              </h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {defaultPreferences.map((preference) => (
                  <button
                    key={preference}
                    className={`text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 transition-all duration-200 ${
                      selectedPreferences.includes(preference)
                        ? "bg-bluebutton text-white border-none"
                        : ""
                    }`}
                    onClick={() => handlePreferenceToggle(preference)}
                  >
                    {preference}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-around my-10 px-4 w-full gap-4">
            <div className="w-full sm:w-[30%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-bluebutton rounded-full inline-block mr-2 mb-0.5"></span>
                Dietary Preference
              </h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {defaultPreferences.slice(1, 2).map((preference) => (
                  <button
                    key={preference}
                    className={`text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 mt-3 transition-all duration-200 focus:bg-bluebutton focus:text-white focus:border-none
                      ${""}`}
                  >
                    {preference}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full sm:w-[30%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-bluebutton rounded-full inline-block mr-2 mb-0.5"></span>
                Smoking Habit
              </h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {defaultPreferences.slice(2, 3).map((preference) => (
                  <button
                    key={preference}
                    className={`text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 mt-3 transition-all duration-200  focus:bg-bluebutton focus:text-white focus:border-none
                      ${""}`}
                  >
                    {preference}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full sm:w-[30%]">
              <h2 className="text-[15px] font-semibold flex items-center">
                <span className="w-2 h-2 bg-bluebutton rounded-full inline-block mr-2 mb-0.5"></span>
                Drinking Habit
              </h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {defaultPreferences.slice(3, 4).map((preference) => (
                  <button
                    key={preference}
                    className={`text-[15px] text-gray-500 rounded-full border-[1.5px] border-gray-200 px-5 py-1 mt-3 transition-all duration-200 focus:border-none focus:bg-bluebutton focus:text-white 
                      ${""}`}
                  >
                    {preference}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:mt-16 mt-10 w-full px-4">
            <button
              className="text-[14px] text-white bg-bluebutton rounded-full px-20 py-2.5 transition-all duration-200"
              onClick={handleSaveChanges}
              disabled={loadingSave}
            >
              {loadingSave ? "Saving..." : "Edit"}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-[1px] rounded-2xl p-8 md:p-6 lg:p-8">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                    <CameraIcon className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-semibold">5.0</span>
                </div>
              </div>
              <button
                className="text-white bg-bluebutton py-2 px-4 rounded-full"
                onClick={handleNagigate}
              >
                Change Password
              </button>
            </div>

            <div className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    className="border p-2 rounded-full w-full"
                    placeholder="Write here"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {/* <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    className="border p-2 rounded-full w-full"
                    placeholder="Write here"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div> */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    className="border p-2 rounded-full w-full"
                    placeholder="Write here"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    className="text-white bg-bluebutton py-2 px-4 rounded-full mt-2"
                    onClick={handleVerifyEmail}
                    disabled={verifyingEmail}
                  >
                    {verifyingEmail ? "Verifying..." : "Verify Email"}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Number</label>
                <input
                  className="border p-2 rounded-full w-full"
                  placeholder="Write here"
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <label className="border-[1px] w-[200px] rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer">
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium">Upload CNIC</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {uploadedImage && (
                <div className="relative h-[120px] w-[200px] rounded-lg overflow-hidden">
                  <Image
                    src={uploadedImage}
                    alt="CNIC Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <label className="border-[1px] w-[200px] rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer">
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium">Upload Other Doc</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleOtherImageUpload}
                />
              </label>
              {uploadedOtherImage && (
                <div className="relative h-[120px] w-[200px] rounded-lg overflow-hidden">
                  <Image
                    src={uploadedOtherImage}
                    alt="CNIC Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={handleOtherRemoveImage}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-center ">
              <button
                className="bg-bluebutton text-white hover:bluebutton py-2 px-8 rounded-full"
                onClick={handleSaveChanges}
                disabled={loadingSave}
              >
                {loadingSave ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
