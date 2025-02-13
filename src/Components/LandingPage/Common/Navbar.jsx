"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, User, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem("isLogin");
      setIsLogin(loginStatus === "true");
    };
    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);  

  useEffect(() => {
    console.log("isLogin state updated:", isLogin); // Debug log
  }, [isLogin]);

  const handleNavigate = () => {
    console.log("Navigating to Login");
    router.push("/Auth/Login");
  };

  const handleClick = () => {
    console.log("Navigating to Profile");
    router.push("/Landing/Profile");
  };

  const navItems = [
    { name: "Home", href: "/Landing/Home" },
    { name: "About", href: "/Landing/About" },
    { name: "Properties", href: "/Landing/Properties" },
    { name: "Contact", href: "/Landing/Contact" },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log("Menu toggled:", menuOpen);
  };

  return (
    <nav className="w-full p-6 bg-white border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between lg:px-5">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/Frame.png"
            alt="CoLivers Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-black font-semibold text-[20px]">CoLivers</span>
        </Link>

        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-black">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`flex items-center gap-8 md:-ml-14 ${
            menuOpen
              ? "flex-col md:flex-row absolute top-20 py-5 left-0 w-full bg-white border-t md:border-none md:static md:top-auto md:w-auto overflow-hidden md:gap-8 z-50"
              : "hidden md:flex"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative group ${
                pathname.startsWith(item.href)
                  ? "text-[#3CD8C8]"
                  : "text-black/80 hover:text-black"
              } transition-colors`}
            >
              {item.name}
              <span
                className={`absolute bottom-[-2px] left-0 h-[2px] bg-[#3CD8C8] rounded-full transition-all duration-300 ${
                  pathname.startsWith(item.href)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </div>

        {isLogin ? (
          <div className="rounded-full border-[1.5px] border-bluebutton px-3 py-[1px]">
            <button
              onClick={handleClick}
              className="inline-flex items-center font-medium text-bluebutton"
            >
              <div className="bg-slate-100 rounded-full text-sm p-1 mr-2 mt-1">
                <User size={17} className="text-bluebutton" />
              </div>
              <span className="-mb-[3px]">Profile</span>
            </button>
          </div>
        ) : (
          <div
            onClick={handleNavigate}
            className="rounded-full font-medium border-[1px] border-gray-300 px-8 py-1 cursor-pointer"
          >
            <span className="inline-flex text-black pb-1">Login</span>
          </div>
        )}
      </div>
    </nav>
  );
}
