"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CircleUserRound, LogOut, Menu, Settings, User, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { clearUserInfo } from "@/features/auth/authSlice";
import { toast } from "react-toastify";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAuthenticated = !!userInfo?.FullName || !!userInfo?.displayName;

  const handleNavigate = () => {
    router.push("/Auth/Login");
  };

  const handleLogout = () => {
    document.cookie = "uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    toast.success("User logged out successfully");
    dispatch(clearUserInfo());
    router.push("/Auth/Login");
    setIsOpen(false);
  };

  const goToSettings = () => {
    router.push("/Landing/Profile");
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: "Home", href: "/Landing/Home" },
    { name: "About", href: "/Landing/About" },
    { name: "Properties", href: "/Landing/Properties" },
    { name: "Contact", href: "/Landing/Contact" },
  ];

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
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-black">
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
        {isAuthenticated ? (
          <div className="relative z-10" ref={dropdownRef}>
            <div className="rounded-full border-[1.5px] border-bluebutton px-3 py-[1px]">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center font-medium text-bluebutton"
              >
                <div className="bg-slate-100 rounded-full text-sm p-1 mr-2 mt-1">
                  <User size={17} className="text-bluebutton" />
                </div>
                <span className="-mb-[3px]">
                  {userInfo.FullName.split(" ").slice(0, 9).join(" ") || userInfo.displayName.split(" ").slice(0, 9).join(" ")}
                </span>
              </button>
            </div>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white p-2 border rounded-lg shadow-lg">
                <button
                  onClick={goToSettings}
                  className="flex items-center p-2 w-full text-left hover:bg-gray-100"
                >
                  <CircleUserRound size={16} className="mr-2" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 w-full text-left hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
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
