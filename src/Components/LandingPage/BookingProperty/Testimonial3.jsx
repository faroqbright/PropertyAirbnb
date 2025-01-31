import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Reviews() {
  const router = useRouter();

  const reviews = [
    {
      id: "1",
      name: "Jose",
      date: "December 2021",
      review: "Host was very attentive.",
      imageUrl: "/assets/review1.png",
    },
    {
      id: "2",
      name: "Luke",
      date: "December 2021",
      review: "Nice place to stay!",
      imageUrl: "/assets/review2.png",
    },
    {
      id: "3",
      name: "Shayna",
      date: "December 2021",
      review:
        "Wonderful neighborhood, easy access to restaurants and the subway, cozy studio apartment with a super comfortable bed. Great host, super helpful and responsive. Cool murphy bed...",
      imageUrl: "/assets/review3.png",
    },
    {
      id: "4",
      name: "Josh",
      date: "November 2021",
      review:
        "Well designed and fun space, neighborhood has lots of energy and amenities.",
      imageUrl: "/assets/review4.png",
    },
    {
      id: "5",
      name: "Vladko",
      date: "November 2021",
      review:
        "This is amazing place. It has everything one needs for a monthly business stay. Very clean and organized place. Amazing hospitality affordable price.",
      imageUrl: "/assets/review5.png",
    },
    {
      id: "6",
      name: "Jennifer",
      date: "January 2022",
      review:
        "A centric place, near of a sub station and a supermarket with everything you need.",
      imageUrl: "/assets/review6.png",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-9">
      <h1 className="text-[28px] font-bold text-center text-black mb-6">
        What landlords say about this place
      </h1>

      <div className="md:pl-24">
        <div className="flex items-start space-x-2 mb-8 pl-7">
          <Star fill="#FFBF2B" className="w-5 h-5 text-[#FFBF2B]" />
          <span className="font-semibold">5.0  &bull;  7 reviews</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reviews.map((item, index) => (
            <div key={index} className="p-4 bg-white">
              <div className="flex items-center space-x-4 mb-3">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-black">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.date}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-700 text-[15px] sm:text-[16px] md:text-[17px]">{item.review}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => router.push("/Landing/AllReviews")}
          className="bg-bluebutton text-white px-7 h-10 rounded-full mb-10"
        >
          See more
        </button>
      </div>
    </div>
  );
}
