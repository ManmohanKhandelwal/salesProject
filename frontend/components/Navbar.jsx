"use client";

import { pages } from "@/constants";
import { Bell, CircleUserRound, Minus, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [activePage, setActivePage] = useState(0);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };
  return (
    <>
      <nav className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
        {/* LOGO */}
        <div className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="logo"
            width={50}
            height={50}
            className=""
          />
          <h1 className="ml-2 text-xl font-semibold text-gray-800">
            BG Distributors Pvt. Ltd.
          </h1>
        </div>

        {/* LINKS */}
        <div className="relative">
          <ul className="flex justify-center items-center gap-2">
            {pages.map((page) => (
              <li key={page.id}>
                <Link
                  href={page.path}
                  className="relative py-2 px-4 tracking-wide inline-block"
                  onClick={() => setActivePage(page.id)}
                >
                  <h1 className="text-gray-900 font-semibold">{page.title}</h1>

                  {activePage === page.id && (
                    <div className="absolute inset-0 bg-red-700 rounded-full bg-opacity-65"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT SECTION */}
        <div className="relative flex items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell size={22} className="cursor-pointer" />
              <div className="absolute h-2 w-2 rounded-full bg-red-500 top-0 right-0"></div>
            </div>
            <div
              className="border-2 border-red-500 rounded-xl p-1"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Sun size={22} className="cursor-pointer " />
              ) : (
                <Moon size={22} className="cursor-pointer " />
              )}
            </div>
          </div>

          <Minus size={45} className="rotate-90 text-gray-400" />

          <div className="flex items-center gap-2">
            <CircleUserRound size={35} className="cursor-pointer" />
            <div className="">
              <p className="text-gray-800 font-semibold">User Name</p>
              <p className="text-gray-500 text-sm">user@gmail.com</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
