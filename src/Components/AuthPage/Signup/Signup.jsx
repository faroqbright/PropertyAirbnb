"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { storage, db } from "../../../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Facebook } from "lucide-react";

const Signup = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("LandLord");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    Email: "",
    Number: "",
    Password: "",
    ConfirmPassword: "",
    role: "LandLord",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOwnerDoc, setSelectedOwnerDoc] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const uploadImage = async (file, folder) => {
    if (!file) return null;
    const storageRef = ref(storage, `${folder}/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSignUpClick = async () => {
    if (
      !formData.fullName ||
      !formData.Email ||
      !formData.Number ||
      !formData.Password ||
      !formData.ConfirmPassword
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const cnicUrl = await uploadImage(selectedImage, "cnic");
      const ownerDocUrl =
        step === 2 ? await uploadImage(selectedOwnerDoc, "owner_docs") : null;

      await addDoc(collection(db, "users"), {
        fullName: formData.fullName,
        email: formData.Email,
        number: formData.Number,
        userType: activeTab,
        role: formData.role,
        cnicUrl,
        ownerDocUrl,
      });

      toast.success("Signup successful!");
      setFormData({
        fullName: "",
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
      router.push(
        activeTab === "LandLord" ? "/Landing/Home" : "/Auth/Personal"
      );
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center w-full my-10">
      <div className="bg-white rounded-xl border border-gray-200 w-3/4 lg:w-1/2 px-5 lg:px-14 py-20">
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
          {["fullName", "Email", "Number"].map((field, idx) => (
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
            <FileUpload
              label="Upload CNIC"
              file={selectedImage}
              setFile={setSelectedImage}
              handleFileChange={handleFileChange}
            />
            {step === 2 && (
              <FileUpload
                label="Upload Owner Docs"
                file={selectedOwnerDoc}
                setFile={setSelectedOwnerDoc}
                handleFileChange={handleFileChange}
              />
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
              <span className="text-bluebutton underline cursor-pointer">
                User Agreement
              </span>
              ,{" "}
              <span className="text-bluebutton underline cursor-pointer">
                Privacy Policy
              </span>
              , and{" "}
              <span className="text-bluebutton underline cursor-pointer">
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
            <button className="flex justify-center items-center text-center gap-2 border-[1.5px] rounded-full mt-5 lg:mt-0 py-2 px-5 text-gray-500">
              <Facebook className="text-white bg-blue-600 rounded-full p-1" />
              Connect with Facebook
            </button>
            <button className="flex items-center justify-center gap-2 border-[1.5px] rounded-full py-3 px-5 text-gray-500">
              <FcGoogle size={20} />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileUpload = ({ label, file, setFile, handleFileChange }) => (
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
      onChange={(e) => handleFileChange(e, setFile)}
    />
  </label>
);

export default Signup;
