import React from "react";
import Image from "next/image";

const CustomLayout = () => {
  return (
    <div
      className="relative w-full bg-cover bg-center pb-8 px-6 -mt-14"
      style={{ backgroundImage: "url('/assets/bg-image.png')" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 relative">
        <div className="lg:w-1/2 lg:text-left text-center mt-36 md:mt-52 lg:mt-0 ml-3">
          <h1 className="text-3xl sm:text-4xl font-bold">Who We Are</h1>
          <p className="mt-6 text-[14px] text-gray-800 sm:text-[15.5px]">
            Welcome to CoLivers, your trusted partner in modern renting. We
            believe in creating seamless connections between landlords and
            tenants, making the process of finding, renting, and managing
            properties as effortless as possible. Our platform is built to
            simplify the rental experience, ensuring transparency, security, and
            satisfaction for everyone involved.
          </p>
        </div>
        <div className="lg:w-1/2 flex justify-end z-10">
          <div className="w-[75%] lg:mt-40 mt-4 lg:mb-0 mb-14 mr-5 h-auto rounded-t-full overflow-hidden">
            <Image
              src="/assets/testimonial.png"
              width={500}
              height={400}
              className="w-full h-full object-cover"
              alt="Home"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-[13px] font-normal lg:-mt-44 lg:mb-32 mb-10 flex flex-col gap-4 items-center relative z-10">
        <div className="bg-purplebutton text-white text-left px-4 py-3 rounded-xl w-[80%] md:w-[55%] z-10">
          To revolutionize the rental market by providing a secure,
          user-friendly platform that bridges the gap between property owners
          and renters, fostering trust and convenience.
        </div>
        <div className="bg-bluebutton text-white text-left px-4 py-3 rounded-xl w-[69%] -mt-6">
          To become the leading platform for property rentals worldwide, setting
          a standard for innovation, simplicity, and integrity in the rental
          industry.
        </div>
      </div>
      <div className="absolute bottom-0 hidden lg:block right-0 w-[40%] h-[65%]">
        <img
          src="/assets/bg.png"
          className="object-cover w-full h-full opacity-[0.25]"
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent opacity-85"></div>
      </div>
    </div>
  );
};

export default CustomLayout;
