"use client";

import Context from "@/Components/LandingPage/BookingProperty/Context";
import Header from "@/Components/LandingPage/BookingProperty/Header";
const MapCalSection = dynamic(
  () => import("@/Components/LandingPage/BookingProperty/MapCalSection"),
  { ssr: false }
);
import Testimonial from "@/Components/LandingPage/BookingProperty/Testimonial";
import Testimonial2 from "@/Components/LandingPage/BookingProperty/Testimonial2";
import Testimonial3 from "@/Components/LandingPage/BookingProperty/Testimonial3";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [fromProfile, setFromProfile] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("fromProfile")) {
      setFromProfile(true);
    }
  }, []);

  return (
    <>
      <Header />
      <Context />
      <MapCalSection />
      <Testimonial />
      {fromProfile ? <Testimonial3 /> : <Testimonial2 />}
    </>
  );
}
