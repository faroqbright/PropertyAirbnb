"use client";
import { CameraIcon, Star, Pencil } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { storage, db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { deletePersonalInfo, setUserInfo } from "@/features/auth/authSlice";
import { toast } from "react-toastify";
import { auth } from "@/firebase/firebaseConfig";
import { sendSignInLinkToEmail } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Bookings() {
  const [status, setStatus] = useState("Info");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [userType, setUserType] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedOtherImage, setOtherUploadedImage] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [selectedTabs, setSelectedTabs] = useState([]);
  console.log(userInfo);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.FullName || userInfo.displayName || "");
      setEmail(userInfo.email || "");
      setNumber(userInfo.number || "");
      setProfileImage(userInfo?.personalInfo?.image || null);
      setUserType(userInfo?.userType);
      setUploadedImage(userInfo?.cnicUrl || "");
      setOtherUploadedImage(userInfo?.ownerDocUrl || "");
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.personalInfo) {
      console.log(
        "Current personalInfo keys:",
        Object.keys(userInfo.personalInfo)
      );
    }
  }, [userInfo]);

  const handleToggle = (newStatus) => {
    setStatus(newStatus);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const storageRef = ref(storage, `users/profile/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading file:", error);
          toast.error("Failed to upload profile image.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setProfileImage(downloadURL);

          const userDocRef = doc(db, "users", userInfo.uid);
          await updateDoc(userDocRef, { "personalInfo.image": downloadURL });
          dispatch(
            setUserInfo({
              ...userInfo,
              personalInfo: { ...userInfo.personalInfo, image: downloadURL },
            })
          );
        }
      );
    }
  };

  const handleNagigate = () => {
    router.push("/Auth/ChangePassword");
  };

  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true,
  };

  const handleSaveChanges = async () => {
    try {
      if (!userInfo || !userInfo.uid || !auth.currentUser) {
        toast.error("User  information not found. Please login again.");
        return;
      }

      const userDocRef = doc(db, "users", userInfo.uid);
      const updatedData = { FullName: name, number: number };

      if (email !== userInfo.email) {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        localStorage.setItem("newEmail", email);
        toast.info("Verification email sent! Please check your inbox.");
        setLoadingSave(false);
        return;
      }

      await updateDoc(userDocRef, updatedData);
      dispatch(setUserInfo({ ...userInfo, FullName: name, number: number }));

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSelect = (key) => {
    setSelectedTabs((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleSaveLifestyle = async () => {
    if (!selectedTabs.length) {
      toast.error("Please select items to remove");
      return;
    }

    setLoadingSave(true);

    try {
      await deleteTabsFromFirebase(userInfo.uid, selectedTabs);
      dispatch(deletePersonalInfo(selectedTabs));
      setSelectedTabs([]);
      toast.success("Successfully Delete ");
    } catch (error) {
      toast.error("Update failed. Please try again.");
    } finally {
      setLoadingSave(false);
    }
  };

  const deleteTabsFromFirebase = async (userId, selectedTabs) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;

      const userData = userSnap.data();
      if (!userData.personalInfo) return;

      const updatedPersonalInfo = { ...userData.personalInfo };

      Object.keys(updatedPersonalInfo).forEach((key) => {
        const value = updatedPersonalInfo[key];

        if (Array.isArray(value)) {
          updatedPersonalInfo[key] = value.filter(
            (item) => !selectedTabs.includes(item)
          );
        } else if (selectedTabs.includes(value)) {
          delete updatedPersonalInfo[key];
        }
      });

      await updateDoc(userRef, { personalInfo: updatedPersonalInfo });
    } catch (error) {
      console.error("Firestore delete error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryList = data
          .filter((c) => c.idd?.root && c.idd?.suffixes)
          .map((c) => ({
            code: c.cca2,
            dialCode: `${c.idd.root}${c.idd.suffixes[0] || ""}`.replace(
              "+",
              ""
            ),
            flag: c.flags?.png,
          }));
        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setNumber(country.dialCode);
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (number.length > 0) {
      const matchedCountry = countries.find((c) =>
        number.startsWith(c.dialCode)
      );
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
      }
    }
  }, [number, countries]);

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
        {userType !== "LandLord" && userInfo?.personalInfo && (
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
        )}
      </div>

      {status === "Lifestyle" && userInfo?.personalInfo ? (
        <div className="w-full bg-white rounded-xl border-[1.5px] border-gray-200 px-6 pt-2 pb-5 sm:pb-10 sm:pt-5">
          <div className="flex flex-wrap px-4 mt-6 w-full justify-between gap-4">
            {Object.entries(userInfo?.personalInfo)
              .filter(([key]) => key !== "image")
              .map(([key, value]) => {
                const unselectableKeys = ["birth", "gender", "sexOrientation"];
                const isUnselectable = unselectableKeys.includes(key);

                const shouldRender = Array.isArray(value)
                  ? value.length > 0
                  : value;

                return (
                  shouldRender && (
                    <div key={key} className="w-full sm:w-[48%]">
                      <h2 className="text-[15px] font-semibold flex items-center capitalize">
                        <span className="w-2 h-2 bg-bluebutton rounded-full inline-block mr-2 mb-0.5"></span>
                        {key.replace(/([A-Z])/g, " $1")}
                      </h2>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {Array.isArray(value) ? (
                          value.map((item, index) => (
                            <div
                              key={index}
                              className={`text-[15px] rounded-full border-[1.5px] px-5 py-1 ${
                                isUnselectable
                                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                  : selectedTabs.includes(item)
                                  ? "bg-purplebutton text-white border-purplebutton cursor-pointer"
                                  : "bg-gray-100 text-gray-500 border-gray-200 cursor-pointer"
                              }`}
                              onClick={
                                !isUnselectable
                                  ? () => handleSelect(item)
                                  : undefined
                              }
                            >
                              {item}
                            </div>
                          ))
                        ) : (
                          <div
                            className={`text-[15px] rounded-full border-[1.5px] px-5 py-1 ${
                              isUnselectable
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : selectedTabs.includes(value)
                                ? "bg-purplebutton text-white border-purplebutton cursor-pointer"
                                : "bg-gray-100 text-gray-500 border-gray-200 cursor-pointer"
                            }`}
                            onClick={
                              !isUnselectable
                                ? () => handleSelect(value)
                                : undefined
                            }
                          >
                            {value}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                );
              })}
          </div>
          <div className="flex justify-center mt-10">
            <button
              className="bg-bluebutton text-white hover:bluebutton py-2 px-8 rounded-full"
              onClick={handleSaveLifestyle}
              disabled={loadingSave}
            >
              {loadingSave ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-[1px] rounded-2xl p-8 md:p-6 lg:p-8">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-full bg-gray-100 flex items-center cursor-pointer justify-center overflow-hidden"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    ) : (
                      <CameraIcon className="w-8 h-8 text-gray-600" />
                    )}
                    <div className="absolute bottom-2 right-4 cursor-pointer bg-purplebutton p-1.5 rounded-full shadow-md border border-gray-300 z-[999] translate-x-1/2 translate-y-1/2">
                      <label className="flex items-center justify-center cursor-pointer">
                        <Pencil
                          size={16}
                          className="text-white cursor-pointer"
                        />
                        <input
                          id="fileInput"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    className="border p-2 rounded-full w-full"
                    placeholder="Write here"
                    type="email"
                    disabled
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 relative ">
                <label className="text-sm font-medium">Number</label>
                <div className="flex items-center border p-2 rounded-full w-full relative">
                  <div
                    className="flex items-center cursor-pointer pr-2"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {selectedCountry && (
                      <>
                        <img
                          src={selectedCountry.flag}
                          alt="Flag"
                          className="w-8 h-6 rounded-sm"
                        />
                      </>
                    )}
                  </div>

                  <input
                    className="flex-1 outline-none ml-2"
                    placeholder="Enter your phone number"
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>

                {dropdownOpen && (
                  <div className="absolute top-14 left-0 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto w-full z-50">
                    {countries.map((country) => (
                      <div
                        key={country.code}
                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleCountrySelect(country)}
                      >
                        <img
                          src={country.flag}
                          alt="Flag"
                          className="w-6 h-4 mr-2"
                        />
                        <span className="text-gray-700">
                          +{country.dialCode}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {uploadedImage || uploadedOtherImage ? (
              <div className="flex flex-row gap-16 ">
                <div className="space-y-2">
                  <label className="text-sm font-medium">CNIC</label>
                  <div className="flex space-x-4">
                    {uploadedImage && (
                      <div className="relative h-[120px] w-[200px] rounded-lg overflow-hidden border-[1px]">
                        <img
                          src={uploadedImage}
                          alt="CNIC"
                          className="object-cover h-full w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {userType !== "LandLord" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Other Document
                    </label>
                    <div className="flex space-x-4">
                      {uploadedOtherImage && (
                        <div className="relative h-[120px] w-[200px] rounded-lg overflow-hidden border-[1px]">
                          <img
                            src={uploadedOtherImage}
                            alt="Other Doc"
                            className="object-cover h-full w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}

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
