"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="relative z-50 bg-dark-teal py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative h-12 w-12 md:h-20 md:w-20">
            <Image
              src="/logo.png"
              alt="POMRC Logo"
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
          <span className="text-xl font-bold text-light-cream">POMRC</span>
        </Link>

        <div className="hidden space-x-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg text-light-cream transition-colors hover:text-muted-teal"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="p-2 text-light-cream focus:outline-none md:hidden"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
            >
              <div className="relative h-6 w-6">
                <span
                  className={cn(
                    "absolute h-0.5 w-full bg-light-cream transition-all duration-300",
                    isMenuOpen ? "top-3 rotate-45" : "top-1"
                  )}
                />
                <span
                  className={cn(
                    "absolute h-0.5 w-full bg-light-cream transition-all duration-300",
                    isMenuOpen ? "top-3 opacity-0" : "top-3"
                  )}
                />
                <span
                  className={cn(
                    "absolute h-0.5 w-full bg-light-cream transition-all duration-300",
                    isMenuOpen ? "top-3 -rotate-45" : "top-5"
                  )}
                />
              </div>
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="p-0">
            <SheetHeader className="pt-[max(1rem,env(safe-area-inset-top))]">
              <SheetTitle>Menu</SheetTitle>
              <SheetClose className="p-2 text-dark-teal focus:outline-none">
                <span className="sr-only">Close menu</span>
                <div className="relative h-5 w-5">
                  <span className="absolute top-2 h-0.5 w-full rotate-45 bg-dark-teal" />
                  <span className="absolute top-2 h-0.5 w-full -rotate-45 bg-dark-teal" />
                </div>
              </SheetClose>
            </SheetHeader>

            <nav
              aria-label="Mobile navigation"
              className="flex-1 overflow-y-auto"
            >
              <ul>
                {navLinks.map((link, index) => {
                  const isActive = isActiveRoute(pathname, link.href);

                  return (
                    <li
                      key={link.href}
                      className="animate-in fade-in slide-in-from-right-4 fill-mode-both duration-300"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "flex min-h-[48px] items-center justify-between border-b border-dark-teal/10 px-4 py-3 text-dark-teal transition-colors hover:bg-light-teal active:bg-light-teal",
                          isActive && "bg-light-teal font-semibold text-deep-red"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span>{link.label}</span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive ? "text-deep-red" : "text-muted-teal"
                          )}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <SheetFooter>
              <Link
                href="/contact"
                className="block w-full rounded-lg bg-deep-red px-4 py-3 text-center font-medium text-light-cream transition-colors hover:bg-deep-red/90 active:bg-deep-red/80"
              >
                Contact Us
              </Link>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
