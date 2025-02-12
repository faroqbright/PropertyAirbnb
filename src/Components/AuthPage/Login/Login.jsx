"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Login = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("LandLord");

  const handleForgotPassword = () => {
    router.push("/Auth/Forgot");
  };

  const handleSignUpClick = () => {
    router.push("/Auth/Signup");
  };

  return (
    <div className="flex mx-auto justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl border-[1.5px] border-gray-200 w-full max-w-lg lg:max-w-xl px-10 py-20">
       
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-200 rounded-full w-2/3 max-w-md">
            <button
              onClick={() => setActiveTab("LandLord")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition ${
                activeTab === "LandLord"
                  ? "bg-[#B19BD9] text-white rounded-full"
                  : "text-gray-600"
              }`}
            >
              LandLord
            </button>
            <button
              onClick={() => setActiveTab("Tenant")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition ${
                activeTab === "Tenant"
                  ? "bg-[#B19BD9] text-white rounded-full"
                  : "text-gray-600"
              }`}
            >
              Tenant
            </button>
          </div>
        </div>

        
        <h1 className="text-center text-xl font-semibold text-gray-800 mb-8">
          Welcome Back!
        </h1>

        
        <div className="space-y-6">
          <div>
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              placeholder="Write here"
              className="w-full mt-2 border-[1.5px] border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="xxxx xxxx xxxx xxxx"
              className="w-full mt-2 border-[1.5px] border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex justify-center lg:justify-end">
            <button
              className="text-sm text-[#B19BD9]"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        
        <button className="w-full mt-8 py-3 bg-teal-500 text-white font-medium rounded-full">
          Login
        </button>

       
        <div className="flex flex-col lg:flex-row justify-between mt-8 gap-2">
          <button className="flex items-center justify-center gap-2 border-[1.5px] rounded-full py-3 px-4 text-gray-500">
            <FcGoogle size={20} />
            Continue with Google
          </button>
          <button className="flex items-center justify-center gap-2 border-[1.5px] rounded-full py-3 px-4 text-gray-500">
            <FaFacebook size={20} className="text-blue-600" />
            Continue with Facebook
          </button>
        </div>

        
        <div className="flex mt-10 justify-center">
          <p className="text-[#B19BD9]">Don't have an account?</p>
          <button
            className="text-[#B19BD9] ml-1 underline"
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
