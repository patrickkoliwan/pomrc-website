import Link from "next/link";
import { desktopQuickLinks, mobileQuickLinks } from "./about-content";

function QuickLinkPill({
  label,
  href,
  className,
}: {
  label: string;
  href: string;
  className?: string;
}) {
  const pillClassName =
    "shrink-0 snap-start rounded-full border border-dark-teal/20 bg-white px-4 py-2 text-sm font-medium text-dark-teal transition-colors hover:bg-light-teal md:text-base";

  if (href.startsWith("#")) {
    return (
      <a href={href} className={`${pillClassName} ${className ?? ""}`}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={`${pillClassName} ${className ?? ""}`}>
      {label}
    </Link>
  );
}

export default function AboutQuickLinks() {
  return (
    <>
      <nav
        aria-label="About page quick links"
        className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory md:hidden"
      >
        {mobileQuickLinks.map((link) => (
          <QuickLinkPill key={link.href} label={link.label} href={link.href} />
        ))}
      </nav>

      <nav
        aria-label="About page quick links"
        className="hidden flex-wrap justify-center gap-3 md:flex"
      >
        {desktopQuickLinks.map((link) => (
          <QuickLinkPill key={link.href} label={link.label} href={link.href} />
        ))}
      </nav>
    </>
  );
}
