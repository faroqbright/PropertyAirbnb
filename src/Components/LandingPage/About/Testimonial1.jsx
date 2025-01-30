import Image from "next/image";
import {
  ShieldCheck,
  MousePointerClick,
  MessagesSquare,
  Globe,
} from "lucide-react";

export default function WhyChooseCoLivers() {
  return (
    <div className="bg-gradient-to-br from-[#FFFFFF] via-[#E4E5F9] to-[#E4E5F9] py-24 px-4">
      <div className="max-w-[920px] mx-auto text-center pb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-7">
          Why Choose CoLivers?
        </h1>
        <p className="text-[15px] sm:text-[16px] text-gray-500 mb-14">
          At CoLivers, we’re committed to making property rentals seamless,
          secure, and stress-free. Here’s why thousands of tenants and landlords
          trust us for their rental needs.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-[1000px] mx-auto px-6">
        <div className="flex flex-col gap-10 md:gap-20">
          <div className="bg-white p-4 md:p-6 rounded-2xl text-center md:w-[320px] w-[290px] h-[260px] flex flex-col justify-center">
            <ShieldCheck size={40} className="text-[#00C4B4] mx-auto mb-4" />
            <h2 className="text-[18px] font-semibold">Secure and Verified</h2>
            <p className="text-gray-500 text-[13px] mt-2">
              We prioritize your safety with advanced verification processes for
              both landlords and tenants, ensuring trustworthy connections every
              time.
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl text-center md:w-[320px] w-[290px] h-[260px] flex flex-col justify-center">
            <MessagesSquare size={40} className="text-[#00C4B4] mx-auto mb-4" />
            <h2 className="text-[18px] font-semibold">
              Seamless Communication
            </h2>
            <p className="text-gray-500 text-[13px] mt-2">
              Our built-in chat feature allows direct and efficient
              communication between landlords and tenants, simplifying
              coordination and inquiries.
            </p>
          </div>
        </div>

        <div className="min-[1000px]:flex justify-center md:hidden">
          <Image
            src="/assets/Group 44.png"
            alt="Centered Image"
            width={200}
            height={200}
            className="w-[200px] h-[190px]"
          />
        </div>

        <div className="flex flex-col gap-10 md:gap-20">
          <div className="bg-white p-4 md:p-6 rounded-2xl text-center md:w-[320px] w-[290px] h-[260px] flex flex-col justify-center">
            <MousePointerClick
              size={40}
              className="text-[#00C4B4] mx-auto mb-4"
            />
            <h2 className="text-[18px] font-semibold">
              User-Friendly Platform
            </h2>
            <p className="text-gray-500 text-[13px] mt-2">
              From intuitive search filters to easy listing management, CoLivers
              is designed to offer a hassle-free experience for everyone.
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl text-center md:w-[320px] w-[290px] h-[260px] flex flex-col justify-center">
            <Globe size={40} className="text-[#00C4B4] mx-auto mb-4" />
            <h2 className="text-[18px] font-semibold">
              Global Reach, Local Expertise
            </h2>
            <p className="text-gray-500 text-[13px] mt-2">
              With listings across prime locations worldwide, CoLivers combines
              a global presence with an understanding of local rental markets to
              meet your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
