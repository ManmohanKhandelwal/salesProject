import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Sales Dashboard",
  description: "P&G Sales Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased vsc-initialized">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
