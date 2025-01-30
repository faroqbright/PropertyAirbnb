import React from "react";

export default function HeroSection() {
  return (
    <div className="p-6 max-w-[920px] mx-auto py-20 relative">
      <h1 className="text-3xl sm:text-4xl mb-7 text-center font-semibold">
        Redefining the Way You Rent
      </h1>
      <p className="text-[15px] sm:text-[16px] text-gray-500 text-center mb-14">
        Discover a smarter, easier, and more reliable way to rent properties. At
        CoLivers, we’re transforming the rental experience with innovation,
        transparency, and a commitment to excellence. Whether you’re a tenant
        seeking a perfect home or a landlord managing your listings, we’ve got
        you covered.
      </p>
      <div className="mt-6 flex flex-col min-[500px]:flex-row gap-4 justify-center">
        <button className="bg-bluebutton text-white font-medium text-[14px] px-5 py-2 rounded-full">
          Find Your CoLivers Home
        </button>
        <button className="bg-purplebutton text-white font-medium text-[14px] px-5 py-2 rounded-full">
          List Your Property
        </button>
      </div>
    </div>
  );
}
