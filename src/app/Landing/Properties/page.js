"use client"
import Header from "@/Components/LandingPage/Home/Header";
import Card from "@/Components/LandingPage/Properties/Cards";
import React, { useState } from "react";

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
      <Card  filters={filters}/>
    </>
  );
}
