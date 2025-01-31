"use client"
import Context from "@/Components/LandingPage/BookingProperty/Context";
import Header from "@/Components/LandingPage/BookingProperty/Header";
const MapCalSection = dynamic(
  () => import("@/Components/LandingPage/BookingProperty/MapCalSection"),
  { ssr: false }
);
import Testimonial from "@/Components/LandingPage/BookingProperty/Testimonial";
import Testimonial2 from "@/Components/LandingPage/BookingProperty/Testimonial2";
import dynamic from "next/dynamic";
import React from "react";

export default function page() {
  return (
    <>
      <Header />
      <Context />
      <MapCalSection />
      <Testimonial />
      <Testimonial2 />
    </>
  );
}
