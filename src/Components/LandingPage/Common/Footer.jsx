import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const socialLinks = [
    { name: "Facebook" },
    { name: "Linkedin" },
    { name: "Instagram" },
    { name: "Twitter" },
  ];

  const SiteLinks = [
    { name: "Home", path: "/Landing/Home" },
    { name: "Properties", path: "/Landing/Properties" },
    { name: "About", path: "/Landing/About" },
    { name: "Contact", path: "/Landing/Contact" },
    { name: "Reviews", path: "/Landing/AllReviews" },
    { name: "Terms & Conditions", path: "/Landing/Terms" },
    { name: "Privacy Policy", path: "/Landing/Privacy" },
  ];

  return (
    <footer className="relative overflow-hidden">
      <div className="w-full h-full absolute inset-0 z-0">
        <img
          src="/assets/footer.png"
          className="object-cover w-full h-full"
          alt="background"
        />
      </div>
      <div className="w-40 h-[400px] -top-56 left-0 absolute inset-0 z-0">
        <img
          src="/assets/vector.png"
          className="object-cover w-full h-full"
          alt="background"
        />
      </div>
      <div className="w-40 h-[400px] -bottom-56 rotate-180 right-0 absolute">
        <img
          src="/assets/vector.png"
          className="object-cover w-full h-full"
          alt="background"
        />
      </div>
      <div className="px-4 pt-14 pb-8 relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-4 lg:px-24 px-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-center">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/assets/footerFrame.png"
                      alt="CoLivers Footer"
                      width={37}
                      height={40}
                    />
                    <span className="text-white text-[15px] font-semibold">
                      CoLivers
                    </span>
                  </Link>
                </div>
                <p className="text-sm text-white/90">
                  Lorem ipsum is simply dummy text of <br /> the printing and
                  typesetting
                </p>
              </div>
            </div>
            <div className="sm:block hidden lg:hidden">
              <h3 className="mb-1 text-[17px] font-semibold text-white">
                Contact Details
              </h3>
              <div className="space-y-2 mt-1 text-sm text-white/90">
                <p>contact@colivers.com</p>
                <p>123 Maple Lane, Springfield, CA 90210, USA</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="lg:ml-14 mt-10 lg:mt-0">
                <h3 className="mb-4 text-[17px] font-semibold text-white">
                  Sitemap
                </h3>
                <ul className="space-y-2">
                  {SiteLinks.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.path}
                        className="text-[13px] text-white/90 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="lg:ml-6 -ml-14 mb-14 lg:mb-9 lg:-mt-14 mt-10">
                <h3 className="mb-4 text-[17px] font-semibold text-white">
                  Social
                </h3>
                <ul className="space-y-2">
                  {socialLinks.map((item) => (
                    <li key={item.name}>
                      <Link
                        href="#"
                        className="text-[13px] text-white/90 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-center -mt-[74px]">
              <div className="lg:block block sm:hidden">
                <h3 className="mb-4 mt-10 lg:mt-0 text-[17px] font-semibold text-white">
                  Contact Details
                </h3>
                <div className="space-y-2 mt-4 text-sm text-white/90">
                  <p>contact@colivers.com</p>
                  <p>123 Maple Lane, Springfield, CA 90210, USA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="rounded-full bg-white py-3 w-[850px]">
            <p className="text-center text-[12px] font-medium text-[#3BD5C5]">
              © 2025 CoLivers. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
