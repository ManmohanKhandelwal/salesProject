import "./globals.css";
import Navbar from "@/components/Navbar";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

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
            <SignInButton />
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
