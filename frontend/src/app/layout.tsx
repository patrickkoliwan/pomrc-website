import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PerformanceMetrics from "@/components/PerformanceMetrics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Port Moresby Racquets Club",
  description:
    "Your premier destination for tennis, squash, and social activities in Port Moresby",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-light-cream min-h-screen flex flex-col`}
      >
        <PerformanceMetrics />
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
