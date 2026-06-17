import Link from "next/link";
import AboutGallery from "./AboutGallery";
import AboutHero from "./AboutHero";
import AboutQuickLinks from "./AboutQuickLinks";
import AboutSectionBlock from "./AboutSectionBlock";
import AboutTimeline from "./AboutTimeline";
import MobileContentsMenu from "../components/MobileContentsMenu";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getPublishedSitePage } from "@/lib/cms/public-data";
import type { SitePageBodySection } from "@/lib/cms/types";
import { DEFAULT_HERO_TAGLINE, JOIN_SECTION_ID, buildNavItems } from "./about-content";

const fallbackSections: SitePageBodySection[] = [
  {
    heading: "Our Legacy",
    content:
      "Established through the 2015 Pacific Games Legacy Agreement, POMRC brings international-standard tennis and squash facilities together with a clubhouse built for members, guests, and the wider Port Moresby community.",
  },
  {
    heading: "Championship Tradition",
    content:
      "The POMRC Open has grown into Papua New Guinea's flagship racquets tournament—drawing competitive players, supporting national talent pathways, and welcoming spectators to world-class sport on home soil.",
  },
];

export default async function About() {
  const page = await getPublishedSitePage("about");
  const sections = page?.body?.length ? page.body : fallbackSections;
  const navItems = buildNavItems(sections.map((section) => section.heading));

  return (
    <main className="min-h-screen bg-light-cream">
      <AboutHero
        title={page?.hero_title || "About POMRC"}
        tagline={page?.hero_subtitle || DEFAULT_HERO_TAGLINE}
        cmsHeroImageUrl={page?.hero_image_url}
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 md:space-y-16 md:py-16 lg:px-8">
        <AboutQuickLinks />

        <AboutTimeline />

        {sections.map((section, index) => (
          <AboutSectionBlock
            key={section.heading}
            heading={section.heading}
            content={section.content}
            index={index}
          />
        ))}

        <AboutGallery />

        <AnimatedSection
          className="scroll-mt-24 rounded-2xl bg-dark-teal py-10 text-center text-light-cream md:py-12"
          delay={0.3}
        >
          <section id={JOIN_SECTION_ID}>
            <h2 className="mb-4 text-2xl font-semibold md:text-3xl">
              Ready to Join Us?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-base md:text-lg">
              Explore membership and experience Port Moresby&apos;s premier
              racquets club firsthand.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/membership"
                className="inline-flex h-11 w-full items-center justify-center rounded-md bg-deep-red px-8 text-sm font-medium text-light-cream transition-colors hover:bg-deep-red/90 sm:w-auto"
              >
                View Membership Options
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 w-full items-center justify-center rounded-md border border-light-cream/40 bg-transparent px-8 text-sm font-medium text-light-cream transition-colors hover:bg-light-cream/10 sm:w-auto"
              >
                Get in Touch
              </Link>
            </div>
          </section>
        </AnimatedSection>
      </div>

      <MobileContentsMenu items={navItems} />
    </main>
  );
}
