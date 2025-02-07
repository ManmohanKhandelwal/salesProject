import "./globals.css";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Image from "next/image";

export const metadata = {
  title: "Sales Dashboard",
  description: "P&G Sales Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased vsc-initialized">
          <SignedOut>
            <div className="flex items-center justify-center h-screen">
              <div className="flex items-center shadow-md rounded-2xl overflow-hidden border-2 border-blue-200 max-h-[600px]">
                <div className="w-1/2">
                  <Image
                    src="/assets/auth-bg.avif"
                    alt="bg"
                    width={550}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-1/2 flex justify-center flex-col items-center">
                  <h1 className="font-bold mb-1">
                    Welcome to BG Sales Dashboard
                  </h1>
                  <p className="text-gray-500 mb-3">
                    Please sign in to continue
                  </p>
                  <div className="bg-blue-700 hover:bg-blue-500 transition-all duration-300 rounded-xl py-4 px-6 text-white cursor-pointer">
                    <SignInButton mode="modal" />
                  </div>
                </div>
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            <Navbar />
            <div className="relative p-4">{children}</div>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
