"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Facebook,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  addressLine1,
  addressLine2,
  clubDescription,
  clubName,
  clubShortName,
  contactPhones,
  facebookUrl,
  googleMapsPlaceUrl,
  openingDays,
  openingHours,
  openingHoursNote,
  publicEmail,
} from "@/lib/site";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/facilities", label: "Facilities" },
  { href: "/events", label: "Events" },
  { href: "/membership", label: "Membership" },
  { href: "/contact", label: "Contact" },
];

type FooterActionButtonProps = {
  href: string;
  icon: ReactNode;
  label: string;
  ariaLabel: string;
  external?: boolean;
};

function FooterActionButton({
  href,
  icon,
  label,
  ariaLabel,
  external,
}: FooterActionButtonProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg bg-light-teal/10 px-3 py-3 text-center transition-colors hover:bg-light-teal/20 active:bg-light-teal/25"
    >
      <span className="text-light-cream">{icon}</span>
      <span className="text-xs font-medium leading-tight text-light-cream">
        {label}
      </span>
    </a>
  );
}

type FooterSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

function FooterSection({ title, children, defaultOpen }: FooterSectionProps) {
  return (
    <>
      {/* Mobile: collapsible */}
      <details
        className="group border-b border-muted-teal/30 md:hidden"
        open={defaultOpen}
      >
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-lg font-semibold [&::-webkit-details-marker]:hidden">
          {title}
          <ChevronDown
            className="h-5 w-5 text-muted-teal transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="pb-4 text-muted-teal">{children}</div>
      </details>

      {/* Desktop: always visible */}
      <div className="hidden md:block">
        <h3 className="mb-4 text-xl font-semibold">{title}</h3>
        <div className="text-muted-teal">{children}</div>
      </div>
    </>
  );
}

function QuickLinksList() {
  return (
    <ul className="space-y-2">
      {quickLinks.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="inline-block min-h-[44px] py-1 text-muted-teal transition-colors hover:text-light-cream"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function OpeningHoursContent() {
  return (
    <div className="space-y-2">
      <p>{openingDays}</p>
      <p>{openingHours}</p>
      <p className="text-sm italic">{openingHoursNote}</p>
    </div>
  );
}

function ContactContent() {
  return (
    <div className="space-y-3">
      <div>
        <p>{addressLine1}</p>
        <p>{addressLine2}</p>
      </div>
      <p>
        <a
          href={`mailto:${publicEmail}`}
          className="inline-flex min-h-[44px] items-center gap-2 py-1 text-muted-teal transition-colors hover:text-light-cream"
        >
          <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
          {publicEmail}
        </a>
      </p>
      {contactPhones.map((phone) => (
        <p key={phone.tel}>
          <a
            href={`tel:${phone.tel}`}
            className="inline-flex min-h-[44px] items-center gap-2 py-1 text-muted-teal transition-colors hover:text-light-cream"
            aria-label={`Call ${phone.label}`}
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              {phone.label}: {phone.display}
            </span>
          </a>
        </p>
      ))}
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="border-t border-muted-teal/30 bg-dark-teal text-light-cream">
      <div className="container mx-auto px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
        {/* Brand header — mobile only; desktop uses grid column */}
        <div className="mb-8 flex flex-col items-center text-center md:hidden">
          <Link
            href="/"
            className="mb-3 flex flex-col items-center gap-3"
          >
            <div className="relative h-16 w-16">
              <Image
                src="/logo.png"
                alt="POMRC Logo"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-xl font-bold text-light-cream">
                {clubShortName}
              </p>
              <p className="mt-1 max-w-xs text-sm text-muted-teal">
                {clubDescription}
              </p>
            </div>
          </Link>
        </div>

        {/* Action grid — mobile-first tap targets */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 md:mb-10">
          {contactPhones.map((phone) => (
            <FooterActionButton
              key={phone.tel}
              href={`tel:${phone.tel}`}
              icon={<Phone className="h-5 w-5" aria-hidden="true" />}
              label={phone.label.replace("POMRC ", "")}
              ariaLabel={`Call ${phone.label}`}
            />
          ))}
          <FooterActionButton
            href={`mailto:${publicEmail}`}
            icon={<Mail className="h-5 w-5" aria-hidden="true" />}
            label="Email"
            ariaLabel={`Email ${publicEmail}`}
          />
          <FooterActionButton
            href={googleMapsPlaceUrl}
            icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
            label="Directions"
            ariaLabel="Get directions to POMRC"
            external
          />
        </div>

        {/* Sections: accordion on mobile, grid on desktop */}
        <div className="md:grid md:grid-cols-4 md:gap-8">
          {/* Brand column — desktop only (mobile uses header above) */}
          <div className="hidden md:block">
            <Link href="/" className="mb-4 inline-flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0">
                <Image
                  src="/logo.png"
                  alt="POMRC Logo"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-xl font-bold text-light-cream">
                {clubShortName}
              </span>
            </Link>
            <h3 className="mb-2 text-lg font-semibold text-muted-teal">
              {clubName}
            </h3>
            <p className="text-muted-teal">
              {clubDescription}, offering both recreational and competitive
              opportunities.
            </p>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit POMRC on Facebook"
              className={cn(
                "mt-4 inline-flex min-h-12 items-center gap-2 rounded-lg px-3 py-2",
                "text-muted-teal transition-colors hover:bg-light-teal/10 hover:text-light-cream"
              )}
            >
              <Facebook className="h-5 w-5" aria-hidden="true" />
              <span>Follow us on Facebook</span>
            </a>
          </div>

          <FooterSection title="Quick Links">
            <QuickLinksList />
          </FooterSection>

          <FooterSection title="Opening Hours">
            <OpeningHoursContent />
          </FooterSection>

          <FooterSection title="Contact Us">
            <ContactContent />
          </FooterSection>
        </div>

        {/* Social — mobile only (desktop has it in brand column) */}
        <div className="mt-6 flex justify-center md:hidden">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit POMRC on Facebook"
            className="inline-flex min-h-12 items-center gap-2 rounded-lg px-4 py-2 text-muted-teal transition-colors hover:bg-light-teal/10 hover:text-light-cream"
          >
            <Facebook className="h-5 w-5" aria-hidden="true" />
            <span>Follow us on Facebook</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-muted-teal/30 pt-8 text-center text-sm text-muted-teal">
          <p>
            &copy; {new Date().getFullYear()} {clubName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
