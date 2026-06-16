import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { clubDescription, clubName, siteUrl } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: clubName,
  description: clubDescription,
  keywords: [
    "tennis",
    "squash",
    "sports club",
    "port moresby",
    "racquets",
    "social activities",
  ],
  authors: [{ name: clubName }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: clubName,
    description: clubDescription,
    url: siteUrl,
    siteName: clubName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: `${clubName} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: clubName,
    description: clubDescription,
    images: ["/logo.png"],
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
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
