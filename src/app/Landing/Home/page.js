import Header from "@/Components/LandingPage/Home/Header";
import Card from '@/Components/LandingPage/Home/Cards'
import Testimonial from "@/Components/LandingPage/Home/Testimonial";
import Testimonial2 from "@/Components/LandingPage/Home/Testimonial2";
import Testimonial3 from "@/Components/LandingPage/Home/Testimonial3";
import React from "react";

export default function page() {
  return (
    <>
      <Header />
      <Card />
      <Testimonial />
      <Testimonial2 />
      <Testimonial3 />
    </>
  );
}
