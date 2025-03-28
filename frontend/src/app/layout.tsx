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
  keywords: [
    "tennis",
    "squash",
    "sports club",
    "port moresby",
    "racquets",
    "social activities",
  ],
  authors: [{ name: "Port Moresby Racquets Club" }],
  openGraph: {
    title: "Port Moresby Racquets Club",
    description:
      "Your premier destination for tennis, squash, and social activities in Port Moresby",
    url: "https://pomrc.com",
    siteName: "Port Moresby Racquets Club",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Port Moresby Racquets Club",
    description:
      "Your premier destination for tennis, squash, and social activities in Port Moresby",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" />
      </head>
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
