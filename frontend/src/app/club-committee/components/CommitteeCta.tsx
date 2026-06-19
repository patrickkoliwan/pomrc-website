import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function CommitteeCta() {
  return (
    <AnimatedSection
      className="scroll-mt-24 rounded-2xl bg-dark-teal py-10 text-center text-light-cream md:py-12"
      delay={0.2}
    >
      <section id="join">
        <h2 className="mb-4 text-2xl font-semibold md:text-3xl">
          Want to Make a Difference?
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-base md:text-lg">
          Join our community and help make the club an even better place. We
          welcome members who want to contribute their time and skills to
          support our club&apos;s activities and growth.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/membership"
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-deep-red px-8 text-sm font-medium text-light-cream transition-colors hover:bg-deep-red/90 sm:w-auto"
          >
            Become a Member
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 w-full items-center justify-center rounded-md border border-light-cream/40 bg-transparent px-8 text-sm font-medium text-light-cream transition-colors hover:bg-light-cream/10 sm:w-auto"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </AnimatedSection>
  );
}
