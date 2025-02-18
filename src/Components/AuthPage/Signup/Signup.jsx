"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Facebook } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiRequest from "@/utils/apiRequest";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const Signup = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("LandLord");
  const [step, setstep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOwnerDoc, setSelectedOwnerDoc] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCheckboxChange = (event) => {
    setIsAgreed(event.target.checked);
  };

  const handleLoginClick = () => {
    router.push("/Auth/Login");
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    number: Yup.string().required("Number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      number: "",
      password: "",
      confirmPassword: "",
      cnic: null,
      OwnerDoc: null,
      role: "landlord",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("number", values.number);
        formData.append("password", values.password); 
        formData.append("cnic", values.cnic);
        formData.append("role", values.role); 
        if (values.role === "user" && values.OwnerDoc) {
          formData.append("OwnerDoc", values.OwnerDoc);
        }
        const response = await apiRequest("post", "/auth/signup", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.status === "success") {
          toast.success(
            response?.data?.message || "Something went wrong. Please try again."
          );

          if (values.role === "user") {
            localStorage.setItem("userEmail", values.email);
          }

          if (values.role === "landlord") {
            router.push("/Auth/Login");
          } else {
            router.push("/Auth/Personal");
          }
        }
      } catch (error) {
        console.error("Signup Error:", error);
        toast.error(
          error.response?.data?.error ||
            "Something went wrong. Please try again."
        );
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("cnic", file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("cnic", null);
    setSelectedImage(null);
  };

  const handleSelectedOwnerDoc = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("OwnerDoc", file);
      setSelectedOwnerDoc(URL.createObjectURL(file));
    }
  };

  const handleRemoveOwnerDoc = () => {
    formik.setFieldValue("OwnerDoc", null);
    setSelectedOwnerDoc(null);
  };

  const handleTabClick = (role) => {
    setActiveTab(role);
    setstep(role === "LandLord" ? 1 : 2);
    formik.setFieldValue("role", role === "LandLord" ? "landlord" : "user");

    
    formik.resetForm({
      values: {
        name: "",
        email: "",
        number: "",
        password: "",
        confirmPassword: "",
        cnic: null,
        OwnerDoc: null,
        role: role === "LandLord" ? "landlord" : "user", 
      },
    });

    setSelectedImage(null);
    setSelectedOwnerDoc(null);
  };

  return (
    <div className="flex items-center justify-center w-full mb-10 mt-10">
      <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 lg:px-14 px-5 flex flex-col py-20">
        <div className="flex bg-gray-200 rounded-full w-60 lg:w-72 m-auto lg:flex-row">
          <button
            onClick={() => handleTabClick("LandLord")}
            className={`flex-1 py-2 text-sm font-medium transition ${
              activeTab === "LandLord"
                ? "bg-[#B19BD9] text-white rounded-full"
                : "text-gray-600"
            }`}
          >
            LandLord
          </button>

          <button
            onClick={() => handleTabClick("Tenant")}
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
            <label className="text-textclr" htmlFor="name">
              Full Name (ID Name)
            </label>
            <br />
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter Full Name"
              className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {formik.errors.name && formik.touched.name && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>

          <div className="mt-5">
            <label className="text-textclr" htmlFor="email">
              Email
            </label>
            <br />
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter Email Here"
              className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.errors.email && formik.touched.email && (
              <div className="text-red-500 text-sm mt-3">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div className="mt-5">
            <label className="text-textclr" htmlFor="number">
              Number
            </label>
            <br />
            <input
              type="text"
              id="number"
              name="number"
              placeholder="Enter Number Here"
              className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
              value={formik.values.number}
              onChange={formik.handleChange}
            />
            {formik.errors.number && formik.touched.number && (
              <div className="text-red-500 text-sm mt-3">
                {formik.errors.number}
              </div>
            )}
          </div>

          <div className="mt-5 relative">
            <label className="text-textclr" htmlFor="password">
              Password
            </label>
            <br />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="xxxx xxxx xxxx xxxx"
                className="border-[1.5px] w-full mt-3 py-2 pl-3 pr-10 rounded-full"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-8 transform -translate-y-1/2 text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formik.errors.password && formik.touched.password && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div className="mt-5">
            <label className="text-textclr" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <br />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="xxxx xxxx xxxx xxxx"
              className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
            />
            {formik.errors.confirmPassword &&
              formik.touched.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>

          {step === 1 && (
            <div className="flex lg:flex-row flex-col gap-3 mt-5">
              {!selectedImage ? (
                <label className="flex flex-col items-center justify-center border-[1.5px] rounded-xl cursor-pointer w-[50%] h-40">
                  <p className="pt-5 px-10 text-textclr">+</p>
                  <p className="pb-8 px-10 text-textclr">Upload CNIC</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="relative items-center w-[50%] h-40">
                  <img
                    src={selectedImage}
                    alt="CNIC Preview"
                    className="rounded-xl w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-[-15px] right-[-10px] bg-slate-500 text-white rounded-full px-2.5"
                  >
                    <p className="mb-1">x</p>
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="flex lg:flex-row flex-col gap-5 mt-5">
              {!selectedImage ? (
                <label className="flex flex-col items-center justify-center border-[1.5px] rounded-xl cursor-pointer w-[50%] h-40">
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
                <div className="relative w-[50%] h-40 border-[1.5px] rounded-xl">
                  <img
                    src={selectedImage}
                    alt="CNIC Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-[-15px] right-[-10px] bg-slate-500 text-white rounded-full px-2.5"
                  >
                    <p className="mb-1">x</p>
                  </button>
                </div>
              )}

              {!selectedOwnerDoc ? (
                <label className="flex flex-col items-center justify-center border-[1.5px] rounded-xl cursor-pointer w-[50%] h-40">
                  <p className=" text-textclr text-2xl">+</p>
                  <p className="text-textclr">Upload Owner Docs</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSelectedOwnerDoc}
                  />
                </label>
              ) : (
                <div className="relative w-[50%] h-40 border-[1.5px] rounded-xl">
                  <img
                    src={selectedOwnerDoc}
                    alt="Owner Doc Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    onClick={handleRemoveOwnerDoc}
                    className="absolute top-[-15px] right-[-10px] bg-slate-500 text-white rounded-full px-2.5"
                  >
                    <p className="mb-1">x</p>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-5 flex">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 text-purple-400 border-gray-300 rounded focus:ring-purple-400"
              checked={isAgreed}
              onChange={handleCheckboxChange}
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
              className={`w-full text-center mt-5 border-[1.5px] py-2 text-white rounded-full bg-bluebutton ${
                isAgreed ? "" : "opacity-55 cursor-not-allowed"
              }`}
              onClick={formik.handleSubmit}
              disabled={!isAgreed}
            >
              SignUp
            </button>
          </div>
          <div className="flex mt-10 justify-center">
            <p className="text-[#B19BD9]">Already have an Account!</p>
            <button
              className="text-[#B19BD9] ml-1 underline"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </div>

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

export default Signup;
