"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../firebase/firebaseConfig";
import { setDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Facebook } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { setUserInfo } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Signup = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("LandLord");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Number: "",
    Password: "",
    ConfirmPassword: "",
    role: "LandLord",
    joinedAt: serverTimestamp(),
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOwnerDoc, setSelectedOwnerDoc] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [defaultCountry, setDefaultCountry] = useState("");
  const [errors, setErrors] = useState({});

  const getUserIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Failed to fetch IP address", error);
      return "Unknown IP";
    }
  };

  const getCountryCode = async (ip) => {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      return data.country_code.toLowerCase();
    } catch (error) {
      console.error("Failed to fetch country code", error);
      return null;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const ip = await getUserIP();
      if (ip) {
        const countryCode = await getCountryCode(ip);
        if (countryCode) {
          setDefaultCountry(countryCode);
        }
      }
    };

    initialize();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      console.error("No file selected.");
      return;
    }

    const fileURL = URL.createObjectURL(file);
    setSelectedImage(file);
    console.log("File URL:", fileURL);
  };

  const uploadImage = async (file, folder) => {
    try {
      if (!file) throw new Error("No file selected for upload.");

      const storage = getStorage();
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `users/${folder}/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSignUpClick = async () => {
    if (
      !formData.FullName ||
      !formData.Email ||
      !formData.Number ||
      !formData.Password ||
      !formData.ConfirmPassword
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (formData.Password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!selectedImage) {
      toast.error("CNIC upload is required.");
      return;
    }

    if (step === 2 && !selectedOwnerDoc) {
      toast.error("Owner document upload is required.");
      return;
    }

    if (!termsAccepted) {
      toast.error("You must accept the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.Email,
        formData.Password
      );
      const user = userCredential.user;

      const cnicUrl = await uploadImage(selectedImage, "cnic");
      const ownerDocUrl =
        step === 2 && selectedOwnerDoc
          ? await uploadImage(selectedOwnerDoc, "OwnerDoc")
          : null;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        FullName: formData.FullName,
        email: formData.Email,
        number: formData.Number,
        userType: activeTab,
        role: formData.role,
        joinedAt: serverTimestamp(),
        cnicUrl,
        ownerDocUrl,
      });

      if (activeTab === "Tenant") {
        localStorage.setItem("userUID", user.uid);
      }

      toast.success("Signup successful!");

      setFormData({
        FullName: "",
        Email: "",
        Number: "",
        Password: "",
        ConfirmPassword: "",
        role: "LandLord",
      });

      setSelectedImage(null);
      setSelectedOwnerDoc(null);
      setTermsAccepted(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setLoading(false);

      await router.push(
        activeTab === "LandLord" ? "/Auth/Login" : "/Auth/Personal"
      );
    } catch (error) {
      console.log(error);

      let errorMessage = error.code
        ? error.code.split("/")[1].replace(/-/g, " ")
        : "Something went wrong";
      errorMessage =
        errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1) + ".";
      toast.error(errorMessage);

      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const existingUser = userSnap.data();
        const userRole = existingUser.role;

        if (userRole !== activeTab) {
          toast.error(`You are not registered as a ${activeTab}.`);
          return;
        }
      } else {
        await setDoc(userRef, {
          uid: user.uid,
          FullName: user.displayName || "",
          email: user.email || "",
          profilePicture: user.photoURL || "",
          userType: activeTab,
          role: activeTab,
          loginMethod: "Facebook",
        });
      }

      toast.success("Logged in successfully with Facebook!");
      router.push("/Landing/Home");
      const serializableUser = JSON.parse(JSON.stringify(user));
      dispatch(setUserInfo(serializableUser));
      document.cookie = `uid=${user.uid}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; Secure; SameSite=Lax`;
    } catch (error) {
      console.error("Facebook Auth Error:", error.code, error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const existingUser = userSnap.data();
        const userRole = existingUser.role;

        if (userRole !== activeTab) {
          toast.error(`You are not registered as a ${activeTab}.`);
          return;
        }
      } else {
        await setDoc(userRef, {
          uid: user.uid,
          FullName: user.displayName || "",
          email: user.email || "",
          profilePicture: user.photoURL || "",
          userType: activeTab,
          role: activeTab,
          loginMethod: "Google",
        });
      }

      toast.success("Logged in successfully with Google!");
      router.push("/Landing/Home");
      const serializableUser = JSON.parse(JSON.stringify(user));
      dispatch(setUserInfo(serializableUser));
      document.cookie = `uid=${user.uid}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; Secure; SameSite=Lax`;
    } catch (error) {
      console.error("Google Auth Error:", error.code, error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleLoginClick = () => {
    router.push("/Auth/Login");
  };

  return (
    <div className="flex items-center justify-center w-full my-10">
      <div className="bg-white rounded-xl border max-w-4xl border-gray-200 w-3/4 lg:w-1/2 px-5 lg:px-14 py-20">
        <div className="flex bg-gray-200 rounded-full w-60 lg:w-72 mx-auto">
          {["LandLord", "Tenant"].map((role) => (
            <button
              key={role}
              onClick={() => {
                setActiveTab(role);
                setStep(role === "LandLord" ? 1 : 2);
                setFormData({ ...formData, role });
              }}
              className={`flex-1 py-2 text-sm font-medium transition ${
                activeTab === role
                  ? "bg-[#B19BD9] text-white rounded-full"
                  : "text-gray-600"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        <h1 className="mt-10 text-center text-xl font-semibold text-gray-700">
          Register Here!
        </h1>
        <div className="mt-10">
          {["FullName", "Email"].map((field, idx) => (
            <div key={idx} className="mt-5">
              <label className="text-gray-700">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                type="text"
                name={field}
                placeholder={`Enter your ${field
                  .replace(/([A-Z])/g, " $1")
                  .trim()}`}
                value={formData[field]}
                onChange={handleChange}
                className="border w-full mt-3 py-2 pl-3 rounded-full"
              />
            </div>
          ))}

          <div className="flex flex-col w-full mt-4">
            <label className="text-gray-700 mb-2">Phone Number</label>
            <div className="w-full flex items-center border border-gray-300 rounded-full">
              <div className="w-full px-3 flex items-center">
                <PhoneInput
                  country={defaultCountry || "us"}
                  enableSearch={true}
                  disableDropdown={false}
                  value={formData.Number}
                  onChange={(num) => {
                    console.log("PhoneInput value:", num);
                    setFormData((prev) => ({ ...prev, Number: num }));
                  }}
                  buttonClass="px-2"
                  inputClass="w-full !border-0 text-gray-900 placeholder-gray-400 focus:outline-none"
                  dropdownClass="max-h-48 bg-black overflow-y-auto bg-white"
                  containerClass="flex items-center"
                  inputProps={{
                    name: "Number",
                    id: "Number",
                    autoComplete: "tel",
                  }}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          {["Password", "ConfirmPassword"].map((field, idx) => (
            <div key={idx} className="mt-5 relative">
              <label className="text-gray-700">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                type={
                  (field === "Password" ? showPassword : showConfirmPassword)
                    ? "text"
                    : "password"
                }
                name={field}
                placeholder={`Enter your ${field
                  .replace(/([A-Z])/g, " $1")
                  .trim()}`}
                value={formData[field]}
                onChange={handleChange}
                className="border w-full mt-3 py-2 pl-3 rounded-full pr-10"
              />
              <button
                type="button"
                className="absolute right-4 top-12 text-gray-500"
                onClick={() =>
                  field === "Password"
                    ? setShowPassword(!showPassword)
                    : setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {field === "Password" ? (
                  showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )
                ) : showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          ))}

          <div className="mt-5 flex flex-col lg:flex-row gap-5">
            <div>
              <FileUpload
                label="Upload CNIC"
                file={selectedImage}
                setFile={setSelectedImage}
              />
              {errors.cnic && (
                <p className="text-red-500 text-sm">{errors.cnic}</p>
              )}
            </div>
            {step === 2 && (
              <div>
                <FileUpload
                  label="Upload Owner Docs"
                  file={selectedOwnerDoc}
                  setFile={setSelectedOwnerDoc}
                  handleFileChange={(file) => setSelectedOwnerDoc(file)}
                />
                {errors.ownerDoc && (
                  <p className="text-red-500 text-sm">{errors.ownerDoc}</p>
                )}
              </div>
            )}
          </div>
          <div className="mt-5 flex">
            <input
              type="checkbox"
              className="h-5 w-5 text-purple-400 border-gray-300 rounded focus:ring-purple-400"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            />
            <p className="ml-3 text-gray-400">
              By clicking Continue, you agree to our{" "}
              <span
                onClick={() => router.push("/Landing/Terms")}
                className="text-bluebutton underline cursor-pointer"
              >
                User Agreement
              </span>
              ,{" "}
              <span
                onClick={() => router.push("/Landing/Privacy")}
                className="text-bluebutton underline cursor-pointer"
              >
                Privacy Policy
              </span>
              , and{" "}
              <span
                onClick={() => router.push("/Landing/Terms")}
                className="text-bluebutton underline cursor-pointer"
              >
                Cookie Policy
              </span>
              .
            </p>
          </div>
          <button
            className={`w-full mt-5 border py-2 text-white bg-bluebutton rounded-full transition-opacity ${
              !termsAccepted ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
            onClick={handleSignUpClick}
            disabled={!termsAccepted || loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <div className="flex flex-col lg:flex-row lg:justify-between mt-10 gap-4">
            <button
              onClick={loginWithGoogle}
              className="flex items-center justify-center gap-2 border-[1.5px] rounded-full py-3 px-5 text-gray-500"
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>
            <button
              onClick={signInWithFacebook}
              className="flex justify-center items-center text-center gap-2 border-[1.5px] rounded-full mt-5 lg:mt-0 py-2 px-5 text-gray-500"
            >
              <Facebook className="text-white bg-blue-600 rounded-full p-1" />
              Connect with Facebook
            </button>
          </div>

          <div className="flex mt-10 justify-center">
            <p className="text-[#B19BD9]">Don't have an account?</p>
            <button
              className="text-[#B19BD9] ml-1 underline"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileUpload = ({ label, file, setFile }) => (
  <label className="flex flex-col items-center justify-center border rounded-xl cursor-pointer w-48 h-40">
    {!file ? (
      <>
        <p className="text-gray-600 text-2xl">+</p>
        <p className="text-gray-600">{label}</p>
      </>
    ) : (
      <div className="relative w-48 h-40">
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="w-full h-full object-cover rounded-xl"
        />
        <button
          onClick={() => setFile(null)}
          className="absolute top-[-10px] pb-1 right-[-10px] bg-slate-500 text-white rounded-full px-2.5"
        >
          x
        </button>
      </div>
    )}
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
          setFile(selectedFile);
        }
      }}
    />
  </label>
);

export default Signup;
