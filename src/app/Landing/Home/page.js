"use client"
import Header from "@/Components/LandingPage/Home/Header";
import Card from "@/Components/LandingPage/Home/Cards";
import Testimonial from "@/Components/LandingPage/Home/Testimonial";
import Testimonial2 from "@/Components/LandingPage/Home/Testimonial2";
import Testimonial3 from "@/Components/LandingPage/Home/Testimonial3";
import React from "react";
import Testimonial4 from "@/Components/LandingPage/Home/Testimonial4";
import { useState } from "react";

export default function page() {
  const [filters, setFilters] = useState({
    location: "",
    budget: 0,
    amenities: [],
    rooms: "",
  });

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <Card filters={filters} />
      <Testimonial />
      <Testimonial2 />
      <Testimonial4 />
      <Testimonial3 />
    </>
  );
}
