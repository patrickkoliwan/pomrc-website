"use client";

import Link from "next/link";

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
            <h3 className="text-xl font-semibold mb-4">
              Port Moresby Racquets Club
            </h3>
            <p className="text-muted-teal">
              Your premier destination for tennis, squash, and social activities
              in Port Moresby, offering both recreational and competitive
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
              <p>Monday - Sunday</p>
              <p>6:00 AM - 11:00 PM</p>
              <p className="text-sm italic">Public holidays to be advised</p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-muted-teal">
              <p>Bava Street, East Boroko</p>
              <p>Port Moresby, Papua New Guinea</p>
              <p>Email: info@portmoresbyracquetsclub.com</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-muted-teal text-center text-muted-teal">
          <p>
            &copy; {new Date().getFullYear()} Port Moresby Racquets Club. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
