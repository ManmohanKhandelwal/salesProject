"use client";

import { pages } from "@/constants";
import { Bell, Minus, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  const [activePage, setActivePage] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 shadow-md">
        {/* LOGO */}
        <div className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="logo"
            width={50}
            height={50}
            className=""
          />
          <h1 className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">
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
                  <h1 className="text-gray-900 dark:text-white font-semibold">
                    {page.title}
                  </h1>

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
              <Bell
                size={22}
                className="cursor-pointer text-gray-800 dark:text-white"
              />
              <div className="absolute h-2 w-2 rounded-full bg-red-500 top-0 right-0"></div>
            </div>
            <div
              className="border-2 border-red-500 rounded-xl p-1"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun
                  size={22}
                  className="cursor-pointer text-gray-800 dark:text-white"
                />
              ) : (
                <Moon
                  size={22}
                  className="cursor-pointer text-gray-800 dark:text-white"
                />
              )}
            </div>
          </div>

          <Minus
            size={45}
            className="rotate-90 text-gray-400 dark:text-gray-500"
          />

          <div className="flex items-center gap-2">
            <UserButton />
            <div className="">
              <p className="text-gray-800 dark:text-white font-semibold">
                {user?.fullName}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {user?.emailAddresses[0].emailAddress}
              </p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
