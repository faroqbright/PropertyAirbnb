import Context from "@/Components/LandingPage/BookingProperty/Context";
import Header from "@/Components/LandingPage/BookingProperty/Header";
import MapCalSection from "@/Components/LandingPage/BookingProperty/MapCalSection";
import Testimonial from "@/Components/LandingPage/BookingProperty/Testimonial";
import Testimonial2 from "@/Components/LandingPage/BookingProperty/Testimonial2";
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
