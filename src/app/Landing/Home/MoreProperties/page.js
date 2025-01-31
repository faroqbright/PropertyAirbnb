"use client"
import Header from "@/Components/LandingPage/Home/Header";
import dynamic from "next/dynamic";
import React from "react";
const Card = dynamic(
  () => import("@/Components/LandingPage/Home/MoreProperties/Cards"),
  { ssr: false }
);

export default function page() {
  return (
    <>
      <Header />
      <Card />
    </>
  );
}
