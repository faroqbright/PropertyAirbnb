import React from "react";
import Header from "@/Components/LandingPage/About/Header";
import Testimonial1 from "@/Components/LandingPage/About/Testimonial1";
import Testimonial2 from "@/Components/LandingPage/About/Testimonial2";
import Testimonial3 from "@/Components/LandingPage/Home/Testimonial3";
import ImageSec from "@/Components/LandingPage/About/ImageSec";

export default function page() {
  return (
    <>
      <Header />
      <ImageSec />
      <Testimonial2 />
      <Testimonial1 />
      <Testimonial3 />
    </>
  );
}
