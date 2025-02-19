// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook } from "react-icons/fa";
// import { useDispatch } from "react-redux";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { toast } from "react-toastify";
// import { setUserInfo } from "../../../features/auth/authSlice";
// import apiRequest from "@/utils/apiRequest";
// import { Eye, EyeOff } from "lucide-react";

// const Login = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false); // To show loader
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const validationSchema = Yup.object({
//     email: Yup.string()
//       .email("Invalid email format")
//       .required("Email is required"),
//     password: Yup.string()
//       .min(6, "Password must be at least 6 characters")
//       .required("Password is required"),
//   });

//   const formik = useFormik({
//     initialValues: {
//       activeTab: "LandLord",
//       email: "",
//       password: "",
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       setLoading(true);
//       try {
//         const response = await apiRequest("post", "/auth/login", values, {
//           "Content-Type": "application/json",
//         });
//         localStorage.setItem("isLogin", "true");
//         dispatch(setUserInfo(response.data));
//         router.push("/Landing/Home");
//         toast.success(response.data.message);
//       } catch (error) {
//         toast.error(error.response.data.error);
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   const handleForgotPassword = () => {
//     router.push("/Auth/Forgot");
//   };

//   const handleSignUpClick = () => {
//     router.push("/Auth/Signup");
//   };

//   return (
//     <div className="flex mx-auto justify-center min-h-screen p-4">
//       <div className="bg-white rounded-2xl border-[1.5px] border-gray-200 w-full max-w-lg lg:max-w-xl px-10 py-20">
//         <div className="flex justify-center mb-8">
//           <div className="flex bg-gray-200 rounded-full w-2/3 max-w-md">
//             <button
//               onClick={() => formik.setFieldValue("activeTab", "LandLord")}
//               className={`flex-1 py-2 px-4 text-sm font-medium transition ${
//                 formik.values.activeTab === "LandLord"
//                   ? "bg-[#B19BD9] text-white rounded-full"
//                   : "text-gray-600"
//               }`}
//             >
//               LandLord
//             </button>
//             <button
//               onClick={() => formik.setFieldValue("activeTab", "Tenant")}
//               className={`flex-1 py-2 px-4 text-sm font-medium transition ${
//                 formik.values.activeTab === "Tenant"
//                   ? "bg-[#B19BD9] text-white rounded-full"
//                   : "text-gray-600"
//               }`}
//             >
//               Tenant
//             </button>
//           </div>
//         </div>

//         <h1 className="text-center text-xl font-semibold text-gray-800 mb-8">
//           Welcome Back!
//         </h1>

//         <form onSubmit={formik.handleSubmit}>
//           <div className="space-y-6">
//             <div>
//               <label
//                 className="text-sm font-medium text-gray-700"
//                 htmlFor="email"
//               >
//                 Email
//               </label>
//               <input
//                 type="text"
//                 id="email"
//                 placeholder="Enter Email"
//                 {...formik.getFieldProps("email")}
//                 className="w-full mt-2 border-[1.5px] border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
//               />
//               {formik.touched.email && formik.errors.email && (
//                 <div className="text-red-500 text-sm mt-2">
//                   {formik.errors.email}
//                 </div>
//               )}
//             </div>

//             <div>
//               <label
//                 className="text-sm font-medium text-gray-700"
//                 htmlFor="password"
//               >
//                 Password
//               </label>
//               <div className="relative mt-2">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   placeholder="Enter Password"
//                   {...formik.getFieldProps("password")}
//                   className="w-full border-[1.5px] border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                 >
//                   {showPassword ? (
//                     <EyeOff size={20} className="text-gray-500" />
//                   ) : (
//                     <Eye size={20} className="text-gray-500" />
//                   )}
//                 </button>
//               </div>
//               {formik.touched.password && formik.errors.password && (
//                 <div className="text-red-500 text-sm mt-2">
//                   {formik.errors.password}
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-center lg:justify-end">
//               <button
//                 className="text-sm text-[#B19BD9]"
//                 onClick={handleForgotPassword}
//               >
//                 Forgot Password?
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full mt-8 py-3 bg-teal-500 text-white font-medium rounded-full"
//             disabled={loading}
//           >
//             {loading ? "Loading..." : "Login"}
//           </button>
//         </form>

//         <div className="flex flex-col lg:flex-row justify-between mt-8 gap-2">
//           <button className="flex items-center justify-center gap-2 border-[1.5px] rounded-full py-3 px-4 text-gray-500">
//             <FcGoogle size={20} />
//             Continue with Google
//           </button>
//           <button className="flex items-center justify-center gap-2 border-[1.5px] rounded-full py-3 px-4 text-gray-500">
//             <FaFacebook size={20} className="text-blue-600" />
//             Continue with Facebook
//           </button>
//         </div>

//         <div className="flex mt-10 justify-center">
//           <p className="text-[#B19BD9]">Don't have an account?</p>
//           <button
//             className="text-[#B19BD9] ml-1 underline"
//             onClick={handleSignUpClick}
//           >
//             Sign Up
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { auth } from "../../../firebase/firebaseConfig";

const Login = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("LandLord");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User Logged In:", userCredential.user);
      toast.success("Login successful!");
      router.push("/Landing/Home");
    } catch (error) {
      console.error("Firebase Auth Error:", error);

      switch (error.code) {
        case "auth/wrong-password":
        case "auth/user-not-found":
          toast.error("Invalid email or password.");
          break;
        case "auth/too-many-requests":
          toast.error("Too many attempts. Please try again later.");
          break;
        case "auth/requires-recent-login":
          toast.error(
            "This operation requires recent authentication. Please re-login or reset your password."
          );
          router.push("/Auth/Forgot");
          break;
        default:
          toast.error("An error occurred during login. Please try again.");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleLogin}>
          <div className="space-y-6">
            <div>
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-[1.5px] border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-500" />
                  )}
                </button>
              </div>
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

          <button
            type="submit"
            className="w-full mt-8 py-3 bg-teal-500 text-white font-medium rounded-full"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

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
