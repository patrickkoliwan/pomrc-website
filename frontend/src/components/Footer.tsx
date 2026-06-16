"use client";

import Link from "next/link";
import {
  addressLine1,
  addressLine2,
  clubDescription,
  clubName,
  openingDays,
  openingHours,
  openingHoursNote,
  publicEmail,
} from "@/lib/site";

const quickLinks = [
  { href: "/membership", label: "Membership" },
  { href: "/facilities", label: "Facilities" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

const Footer = () => {
  return (
    <footer className="bg-dark-teal text-light-cream py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Club Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{clubName}</h3>
            <p className="text-muted-teal">
              {clubDescription}, offering both recreational and competitive
              opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-teal hover:text-light-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
            <div className="space-y-2 text-muted-teal">
              <p>{openingDays}</p>
              <p>{openingHours}</p>
              <p className="text-sm italic">{openingHoursNote}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-muted-teal">
              <p>{addressLine1}</p>
              <p>{addressLine2}</p>
              <p>Email: {publicEmail}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-muted-teal text-center text-muted-teal">
          <p>
            &copy; {new Date().getFullYear()} {clubName}. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
