"use client";

import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { toast } from "react-toastify";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Email does not exist in our records.");
        return;
      }

      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
      setEmail("");

      setTimeout(() => {
        router.push("/Auth/Login");
      }, 1000);
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

  return (
    <div className="flex items-center justify-center w-full mb-10 mt-10">
      <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 py-14 lg:px-14 px-5 flex flex-col">
        <div className="text-center text-textclr font-semibold text-2xl">
          <h1>Forgot Password!</h1>
        </div>

        <div className="mt-10 w-full">
          <label className="text-textclr" htmlFor="email">
            Email
          </label>
          <br />
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter Email Address"
            className="border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-20">
          <button
            className="w-full text-center mt-5 border-[1.5px] py-2 text-white bg-bluebutton rounded-full"
            onClick={handleResetPassword}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
