import React from "react";
import Image from "next/image";

const CustomLayout = () => {
  return (
    <div className="relative">
      <div className="p-6 max-w-6xl mx-auto py-20 relative">
        <h1 className="text-3xl sm:text-4xl mb-4 text-center font-semibold">
          Find Homes Across the Globe
        </h1>
        <p className="text-[15px] sm:text-[16px] text-gray-500 text-center mb-8">
          Discover stunning properties in some of the most sought-after
          locations around the world. Whether you're looking for a cozy retreat
          or an urban getaway, CoLivers offers options in prime destinations.
          Start your journey by exploring these regions{" "}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 mb-6 relative z-10">
          {[
            "/assets/image4.png",
            "/assets/image5.png",
            "/assets/image6.png",
            "/assets/image7.png",
          ].map((src, index) => (
            <div
              key={index}
              className={`relative sm:w-[350px] min-[400px]:w-[300px] min-[400px]:h-[150px] w-[250px] h-[130px] sm:h-[200px] min-[840px]:ml-10 lg:ml-0 mx-auto ${
                index === 3 ? "lg:hidden block" : ""
              }`}
            >
              <img
                src={src}
                alt={`Image ${index + 1}`}
                className="object-cover w-full h-full rounded-3xl"
              />
              <p className="absolute bottom-0 w-full text-white pl-7 pb-4 text-[18px] font-semibold py-1 rounded-b-3xl z-10">
                {index === 0
                  ? "Europe"
                  : index === 1
                  ? "Asia"
                  : index === 2
                  ? "North America"
                  : "South America"}
              </p>
              <div
                className="absolute inset-x-0 bottom-0 h-[100px] w-full rounded-3xl" 
                style={{
                  backgroundImage: `linear-gradient(to top, ${
                    index === 1
                      ? "#af99d6"
                      : index === 0
                      ? "#3CD9C8"
                      : "#3CD9C8"
                  }, transparent)`,
                }}
              ></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 relative z-10">
          {["/assets/image7.png", "/assets/image8.png"].map((src, index) => (
            <div
              key={index}
              className={`relative ${
                index === 0
                  ? "ml-32 w-[380px] hidden lg:block"
                  : "sm:w-[450px] min-[400px]:w-[340px] w-[270px] md:ml-44 min-[850px]:ml-52 min-[950px]:ml-60 lg:-ml-5"
              } sm:h-[200px] min-[400px]:h-[160px] h-[140px] mx-auto`}
            >
              <Image
                src={src}
                alt={`Image ${index + 4}`}
                fill
                className="object-cover rounded-3xl"
              />
              <p className="absolute bottom-0 w-full text-white pl-7 pb-4 text-[18px] font-semibold py-1 rounded-b-3xl z-10">
                {index === 0
                  ? "South America"
                  : index === 1
                  ? "Australia & Oceania"
                  : "North America"}
              </p>
              <div
                className="absolute inset-x-0 bottom-0 h-[100px] w-full rounded-3xl" 
                style={{
                  backgroundImage: `linear-gradient(to top, ${
                    index === 1
                      ? "#af99d6"
                      : index === 0
                      ? "#3CD9C8"
                      : "#5c4b6d"
                  }, transparent)`,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-[50%] h-[60%]">
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
