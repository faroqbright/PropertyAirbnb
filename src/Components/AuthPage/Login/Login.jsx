"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { auth, db } from "../../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { setUserInfo } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("LandLord");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

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
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        toast.error("User not found in database. Please sign up first.");
        return;
      }

      const userData = userDocSnap.data();
      const userRole = userData.role;

      if (activeTab === "LandLord" && userRole !== "LandLord") {
        toast.error("You are not registered as a LandLord.");
        return;
      }

      if (activeTab === "Tenant" && userRole !== "Tenant") {
        toast.error("You are not registered as a Tenant.");
        return;
      }

      toast.success("Login successful!");
      dispatch(setUserInfo(userData));
      router.push("/Landing/Home");
      document.cookie = `uid=${user.uid}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; Secure; SameSite=Lax`;
    } catch (error) {
      console.error("Firebase Auth or Firestore Error:", error);
      let errorMessage = error.code
        ? error.code.split("/")[1].replace(/-/g, " ")
        : "Something went wrong";
      errorMessage =
        errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1) + ".";
      toast.error(errorMessage);
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

  const loginInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const existingUser = userSnap.data();
  
        if (existingUser.role === "Tenant" && existingUser.role !== activeTab) {
          toast.error("Access denied: Role mismatch.");
          return;
        }
      } else {
        await setDoc(userRef, {
          uid: user.uid,
          FullName: user.displayName || "",
          email: user.email || "",
          profilePicture: user.photoURL || "",
          userType: activeTab,
          role: formData.role,
          loginMethod: "Facebook",
        });
      }
  
      toast.success("Logged in successfully with Facebook!");
      router.push("/Landing/Home");
      console.log("Facebook Auth Success:", user);
      dispatch(setUserInfo(user));
      document.cookie = `uid=${user.uid}; path=/; max-age=${7 * 24 * 60 * 60}; Secure; SameSite=Lax`;
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
  
        if (existingUser.role === "Tenant" && existingUser.role !== activeTab) {
          toast.error("Access denied: Role mismatch.");
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
      console.log("Google Auth Success:", user);
      dispatch(setUserInfo(user));
      document.cookie = `uid=${user.uid}; path=/; max-age=${7 * 24 * 60 * 60}; Secure; SameSite=Lax`;
    } catch (error) {
      console.error("Google Auth Error:", error.code, error.message);
      toast.error(`Error: ${error.message}`);
    }
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
                type="button"
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
          <button onClick={loginWithGoogle} className="flex items-center justify-center gap-2 border-[1.5px] rounded-full py-3 px-4 text-gray-500">
            <FcGoogle size={20} />
            Continue with Google
          </button>
          <button onClick={loginInWithFacebook} className="flex items-center justify-center gap-2 border-[1.5px] rounded-full py-3 px-4 text-gray-500">
            <FaFacebook size={20} className="text-blue-600"/>
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
