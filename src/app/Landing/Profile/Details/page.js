"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/Components/LandingPage/Common/Header";
import Details from "@/Components/LandingPage/Profile/Details/Details";
import React from "react";

export default function BookingDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <Details id={id} />
    </>
  );
}
