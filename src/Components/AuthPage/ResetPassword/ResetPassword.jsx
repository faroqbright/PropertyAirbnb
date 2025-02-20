"use client";

import React, { useState, useEffect } from "react";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oobCode, setOobCode] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("oobCode");

    if (!code) {
      toast.error("Invalid or expired reset link.");
      router.push("/auth/login");
    } else {
      setOobCode(code);
    }
  }, [router]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password should be at least 8 characters long.");
      return;
    }

    if (!oobCode) {
      toast.error("Invalid or expired reset code.");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success("Password reset successfully!");
      
      setTimeout(() => {
        router.push("/Auth/Login");
      }, 1000);
    } catch (err) {
      let errorMessage =
        err.code && err.code.includes("auth/")
          ? err.code.split("/")[1].replace(/-/g, " ")
          : "Something went wrong";
      errorMessage =
        errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1) + ".";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center w-full mb-10 mt-10">
      <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 py-14 lg:px-14 px-5 flex flex-col">
        <div className="text-center text-textclr font-semibold text-2xl">
          <h1>Reset Password</h1>
        </div>
        <div>
          <div className="mt-5 relative">
            <label className="text-textclr">New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-[46px] text-gray-500"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="mt-5">
            <label className="text-textclr">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
            />
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={handleResetPassword}
            className="w-full text-center mt-5 border-[1.5px] py-2 text-white bg-bluebutton rounded-full"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
