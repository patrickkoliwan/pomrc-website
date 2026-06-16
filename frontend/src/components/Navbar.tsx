"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/facilities", label: "Facilities" },
  { href: "/events", label: "Events" },
  { href: "/junior-programs", label: "Junior Programs" },
  { href: "/membership", label: "Membership" },
  { href: "/venue-hire", label: "Venue Hire" },
  { href: "/club-committee", label: "Committee" },
  { href: "/contact", label: "Contact" },
];

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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-light-cream hover:text-muted-teal transition-colors text-lg"
            >
              {link.label}
            </Link>
          ))}
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-light-cream hover:text-muted-teal transition-colors text-2xl font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
