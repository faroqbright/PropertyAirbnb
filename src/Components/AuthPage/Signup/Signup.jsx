"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Facebook } from "lucide-react";

const Signup = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("LandLord");

  const handleLoginClick = () => {
    router.push("/Auth/Login"); // Navigates to Login page
  };

  // const handleSignUpClick = () => {
  //   router.push('/Auth/Personal'); // Navigates to Personal page
  // };

  const [step, setstep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOwnerDoc, setSelectedOwnerDoc] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Create a temporary URL for preview
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null); // Remove the preview
  };

  const handleselectedOwnerDoc = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedOwnerDoc(URL.createObjectURL(file)); // Create a temporary URL for preview
    }
  };

  const handleRemoveOwnerDoc = () => {
    setSelectedOwnerDoc(null); // Remove the preview
  };

  const handleSignUpClick = () => {
    if (activeTab === "LandLord") {
      // localStorage.setItem('userType', 'LandLord');
      router.push("/Landing/Home");
    } else if (activeTab === "Tenant") {
      console.log("clickeddddd");

      router.push("/Auth/Personal");
    } else {
      // localStorage.setItem('userType', 'Tenant');
      router.push("/Auth/Personal");
    }
  };

  // const handleSignUpClick = () => {
  //   if (step === 1) {
  //     router.push('/Landing/Home');
  //   } else if (step === 2) {
  //     router.push('/Auth/Personal');
  //   }
  // };

  return (
    <div className="flex items-center justify-center w-full mb-10 mt-10">
      <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 lg:px-14 px-5 flex flex-col py-20">
        <div className="flex bg-gray-200 rounded-full w-60 lg:w-72 m-auto lg:flex-row">
          {/* LandLord Button */}
          <button
            onClick={() => {
              setActiveTab("LandLord");
              setstep(1);
            }}
            className={`flex-1 py-2 text-sm font-medium transition ${
              activeTab === "LandLord"
                ? "bg-[#B19BD9] text-white rounded-full"
                : "text-gray-600"
            }`}
          >
            LandLord
          </button>

          {/* Tenant Button */}
          <button
            onClick={() => {
              setActiveTab("Tenant");
              setstep(2);
            }}
            className={`flex-1 py-2 text-sm font-medium transition ${
              activeTab === "Tenant"
                ? "bg-[#B19BD9] text-white rounded-full"
                : "text-gray-600"
            }`}
          >
            Tenant
          </button>
        </div>

        <div className="mt-10 text-center text-textclr font-semibold text-xl">
          <h1>Register Here!</h1>
        </div>

        <div className="mt-10">
          <div>
            <label className="text-textclr" name="fullname">
              Full Name (ID Name)
            </label>
            <br />
            <input
              type="text"
              name="fullname"
              placeholder="Write Here"
              className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
            />
          </div>

          <div className="mt-5">
            <label className="text-textclr" name="email">
              Email
            </label>
            <br />
            <input
              type="text"
              name="email"
              placeholder="Write Here"
              className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
            />
          </div>

          <div className="mt-5">
            <label className="text-textclr" name="number">
              Number
            </label>
            <br />
            <input
              type="text"
              name="number"
              placeholder="Write Here"
              className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
            />
          </div>

          <div className="mt-5">
            <label className="text-textclr" name="password">
              Password
            </label>
            <br />
            <input
              type="password"
              name="password"
              placeholder="xxxx xxxx xxxx xxxx"
              className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
            />
          </div>

          <div className="mt-5">
            <label className="text-textclr" name="password">
              Confirm Password
            </label>
            <br />
            <input
              type="password"
              name="password"
              placeholder="xxxx xxxx xxxx xxxx"
              className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
            />
          </div>

          {step === 1 ? (
            <>
              <div className="flex lg:flex-row flex-col gap-3 mt-5">
                <label className="flex flex-col items-center justify-center border-[1.5px] rounded-xl cursor-pointer">
                  <p className="pt-5 px-10 text-textclr">+</p>
                  <p className="pb-8 px-10 text-textclr">Upload CNIC</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>

                {/* Image Preview */}
                {selectedImage && (
                  <div className="relative items-center">
                    <img
                      src={selectedImage}
                      alt="CNIC Preview"
                      className="h-28 rounded-xl sm:min-w-full object-cover md:w-full"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-[-15px] lg:right-[-10px] bg-slate-500 text-white rounded-full px-2.5 sm:right-[-10px]"
                    >
                      <p className="mb-1">x</p>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : step === 2 ? (
            <>
              {" "}
              <div className="flex lg:flex-row flex-col gap-5 mt-5">
                {/* Upload CNIC Section */}
                {!selectedImage ? (
                  <label className="flex flex-col items-center justify-center border-[1.5px] rounded-xl cursor-pointer w-48 h-40">
                    <p className="text-textclr text-2xl">+</p>
                    <p className="text-textclr">Upload CNIC</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                ) : (
                  <div className="relative w-48 h-40 border-[1.5px] rounded-xl overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="CNIC Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-[-10px] right-[-10px] bg-slate-500 text-white rounded-full px-2"
                    >
                      x
                    </button>
                  </div>
                )}

                {!selectedOwnerDoc ? (
                  <label className="flex flex-col items-center justify-center border-[1.5px] rounded-xl cursor-pointer w-56 h-40">
                    <p className=" text-textclr text-2xl">+</p>
                    <p className="text-textclr">Upload Owner Docs</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleselectedOwnerDoc}
                    />
                  </label>
                ) : (
                  <div className="relative w-56 h-40 border-[1.5px] rounded-xl overflow-hidden">
                    <img
                      src={selectedOwnerDoc}
                      alt="Owner Doc Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={handleRemoveOwnerDoc}
                      className="absolute top-[-5px] right-[-2px] bg-slate-500 text-white rounded-full px-2"
                    >
                      x
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : null}

          {/* Terms and Conditions with Radio Button */}
          <div className="mt-5 flex">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 text-purple-400 border-gray-300 rounded focus:ring-purple-400"
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

          <div className="mt-5">
            <button
              className="w-full text-center mt-5 border-[1.5px] py-2 text-white bg-bluebutton rounded-full"
              onClick={handleSignUpClick}
            >
              SignUp
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-between mt-10 gap-4">
            <button className="flex justify-center items-center text-center gap-2 border-[1.5px] rounded-full mt-5 lg:mt-0 py-2 px-5 text-gray-500">
              <Facebook className="text-white bg-blue-600 rounded-full p-1" />
              Connect with Facebook
            </button>
            <button className="flex justify-center items-center gap-2 border-[1.5px] rounded-full mt-5 lg:mt-0 py-2 px-5 text-gray-500">
              <FcGoogle className="text-lg" /> Connect with Google
            </button>
          </div>

          <div className="flex mt-10 justify-center">
            <p className="text-purplebutton">Already have an account?</p>
            <button
              className="text-purplebutton ml-1 underline"
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

export default Signup;
