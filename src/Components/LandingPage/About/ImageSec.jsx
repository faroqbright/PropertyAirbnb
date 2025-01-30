import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <div className="relative">
      <div className="relative">
        <Image
          src="/assets/bgimage.png"
          alt="Header Image"
          width={1600}
          height={600}
          className="w-full h-[420px]"
        />
        <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-white to-transparent"></div>
      </div>
    </div>
  );
}
