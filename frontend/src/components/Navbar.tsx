"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = "unset";
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "unset" : "hidden";
  };

  return (
    <nav className="bg-dark-teal py-3 shadow-md relative z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative w-[80px] h-[80px] sm:w-[80px] sm:h-[80px]">
            <Image
              src="/logo.png"
              alt="POMRC Logo"
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
          <span className="text-light-cream text-xl font-bold">POMRC</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link
            href="/about"
            className="text-light-cream hover:text-muted-teal transition-colors text-lg"
          >
            About
          </Link>
          <Link
            href="/facilities"
            className="text-light-cream hover:text-muted-teal transition-colors text-lg"
          >
            Facilities
          </Link>
          <Link
            href="/events"
            className="text-light-cream hover:text-muted-teal transition-colors text-lg"
          >
            Events
          </Link>
          <Link
            href="/junior-programs"
            className="text-light-cream hover:text-muted-teal transition-colors text-lg"
          >
            Junior Programs
          </Link>
          <Link
            href="/membership"
            className="text-light-cream hover:text-muted-teal transition-colors text-lg"
          >
            Membership
          </Link>
          <Link
            href="/venue-hire"
            className="text-light-cream hover:text-muted-teal transition-colors text-lg"
          >
            Venue Hire
          </Link>
          <Link
            href="/club-committee"
            className="text-light-cream hover:text-muted-teal transition-colors text-lg"
          >
            Committee
          </Link>
          <Link
            href="/contact"
            className="text-light-cream hover:text-muted-teal transition-colors text-lg"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-light-cream p-2 focus:outline-none focus:ring-2 focus:ring-muted-teal rounded-lg"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 relative">
            <span
              className={`absolute h-0.5 w-full bg-light-cream transform transition-all duration-300 ${
                isMenuOpen ? "rotate-45 top-3" : "top-1"
              }`}
            />
            <span
              className={`absolute h-0.5 w-full bg-light-cream transform transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : "top-3"
              }`}
            />
            <span
              className={`absolute h-0.5 w-full bg-light-cream transform transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 top-3" : "top-5"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-dark-teal transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
        style={{ zIndex: 40 }}
      >
        {/* Close Button */}
        <button
          onClick={toggleMenu}
          className="absolute top-6 right-6 text-light-cream p-2 focus:outline-none focus:ring-2 focus:ring-muted-teal rounded-lg"
          aria-label="Close menu"
        >
          <div className="w-6 h-6 relative">
            <span className="absolute h-0.5 w-full bg-light-cream transform rotate-45 top-3" />
            <span className="absolute h-0.5 w-full bg-light-cream transform -rotate-45 top-3" />
          </div>
        </button>
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <Link
            href="/about"
            className="text-light-cream hover:text-muted-teal transition-colors text-2xl font-medium"
          >
            About
          </Link>
          <Link
            href="/facilities"
            className="text-light-cream hover:text-muted-teal transition-colors text-2xl font-medium"
          >
            Facilities
          </Link>
          <Link
            href="/events"
            className="text-light-cream hover:text-muted-teal transition-colors text-2xl font-medium"
          >
            Events
          </Link>
          <Link
            href="/junior-programs"
            className="text-light-cream hover:text-muted-teal transition-colors text-2xl font-medium"
          >
            Junior Programs
          </Link>
          <Link
            href="/membership"
            className="text-light-cream hover:text-muted-teal transition-colors text-2xl font-medium"
          >
            Membership
          </Link>
          <Link
            href="/venue-hire"
            className="text-light-cream hover:text-muted-teal transition-colors text-2xl font-medium"
          >
            Venue Hire
          </Link>
          <Link
            href="/club-committee"
            className="text-light-cream hover:text-muted-teal transition-colors text-2xl font-medium"
          >
            Committee
          </Link>
          <Link
            href="/contact"
            className="text-light-cream hover:text-muted-teal transition-colors text-2xl font-medium"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
