"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/Landing/Home" },
    { name: "About", href: "/Landing/About" },
    { name: "Properties", href: "/Landing/Properties" },
    { name: "Contact", href: "/Landing/Contact" },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
                  pathname.startsWith(item.href) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </div>

        <div className="rounded-full border-[1px] border-gray-300 px-6 py-1">
          <button variant="outline" className="inline-flex text-black">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
