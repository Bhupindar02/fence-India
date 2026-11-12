import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "FenceCo India | Premium Architectural Fencing Solutions",
  description:
    "Experience seamless property boundary transformations across India with our architectural fencing solutions. Precision craftsmanship, premium materials, and flawless installation.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-black">
      <body className="bg-black text-white antialiased selection:bg-neutral-800 selection:text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
