"use client";

import { useEffect, useState } from "react";
import {
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUserInfo } from "@/features/auth/authSlice";
import { auth } from "../../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChangePassword = async () => {
    if (!user || !user.email) {
      toast.error("No user is logged in.");
      return;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password should be at least 8 characters long.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      handleLogout();
    } catch (error) {
      console.log(error);

      let errorMessage = error.code
        ? error.code.split("/")[1].replace(/-/g, " ")
        : "Something went wrong";
      errorMessage =
        errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1) + ".";
      toast.error(errorMessage);
    }
  };

  const handleLogout = () => {
    document.cookie = "uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    toast.success("Password updated and User logged out successfully!");
    dispatch(clearUserInfo());
    router.push("/Auth/Login");
  };

  return (
    <div className="flex items-center justify-center w-full mb-10 mt-10">
      <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 py-14 lg:px-14 px-5 flex flex-col">
        <div className="text-center text-textclr font-semibold text-2xl">
          <h1>Change Password!</h1>
        </div>
        <div>
          <div className="mt-5 relative">
            <label className="text-textclr">Old Password</label>
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
              className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-[46px] text-gray-500"
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
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
            onClick={handleChangePassword}
            className="w-full text-center mt-5 border-[1.5px] py-2 text-white bg-bluebutton rounded-full"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
