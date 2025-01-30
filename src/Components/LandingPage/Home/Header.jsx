import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <div className="relative">
      <div className="relative">
        <Image
          src="/assets/image 510.png"
          alt="Header Image"
          width={1600}
          height={600}
          className="w-full h-[500px]"
        />
        <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-white to-transparent"></div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <div className="w-[70%] max-w-7xl p-3 bg-[#B19BD9] rounded-lg lg:rounded-full flex flex-wrap lg:flex-nowrap items-center gap-4 mb-4 relative">
          <div className="flex-1 min-w-0 lg:ml-10">
            <div className="text-white font-semibold text-[15px]">Location</div>
            <div className="text-sm text-gray-200">Where are you going?</div>
          </div>
          <div className="block border-r border-gray-300 h-8"></div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-[15px]">Budget</div>
            <div className="text-sm text-gray-200">Add Budget</div>
          </div>
          <div className="hidden lg:block border-r border-gray-300 h-8"></div>
          <div className="w-full border-t border-gray-300 my-2 lg:hidden"></div>

          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-[15px]">
              Amenities
            </div>
            <div className="text-sm text-gray-200">Select Amenities</div>
          </div>
          <div className="block border-r border-gray-300 h-8"></div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-[15px]">
              #coLivers
            </div>
            <div className="text-sm text-gray-200">Add here</div>
          </div>
          <div className="w-full border-t border-gray-300 my-2 lg:hidden pb-14"></div>

          <button
            className="p-3 bg-white rounded-full absolute bottom-4 right-4 lg:right-5 lg:bottom-auto lg:top-auto lg:translate-y-0 flex-shrink-0 hover:bg-gray-50 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
