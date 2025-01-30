import React from 'react';
import Image from 'next/image';

export default function Testimonial2() {
  return (
    <div className="flex flex-col items-center mt-24 px-10 text-center">
      <span className="text-black font-bold text-[26px] sm:text-[30px] mb-12">
        What users say about this place
      </span>
      <Image
        src="/assets/testimonial2.png"
        alt="Testimonial2 Image"
        width={400}
        height={300}
      />
      <span className="text-[#8A8A8A] text-[17px] mt-8 mb-14">
        Be the first one to review
      </span>
    </div>
  );
}
