import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import {
  BLUR_DATA_URL,
  getSectionPresentation,
  slugifyHeading,
} from "./about-content";

interface AboutSectionBlockProps {
  heading: string;
  content: string;
  index: number;
}

export default function AboutSectionBlock({
  heading,
  content,
  index,
}: AboutSectionBlockProps) {
  const paragraphs = content.split("\n\n").filter(Boolean);
  const [lead, ...body] = paragraphs;
  const presentation = getSectionPresentation(heading);
  const sectionId = slugifyHeading(heading);
  const imageOnLeft = index % 2 === 0;

  return (
    <AnimatedSection delay={index * 0.1} className="scroll-mt-24">
      <section
        id={sectionId}
        className="overflow-hidden rounded-2xl bg-white ring-1 ring-dark-teal/10"
      >
        <div className="grid items-center gap-0 md:grid-cols-2 md:gap-0">
          <div
            className={`relative aspect-[16/10] md:aspect-auto md:min-h-[360px] ${
              imageOnLeft ? "md:order-1" : "md:order-2"
            }`}
          >
            <Image
              src={presentation.imageUrl}
              alt={presentation.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-teal/30 to-transparent md:bg-gradient-to-r md:from-transparent md:to-dark-teal/10" />
          </div>

          <div
            className={`p-5 md:p-10 ${imageOnLeft ? "md:order-2" : "md:order-1"}`}
          >
            <h2 className="mb-4 text-2xl font-semibold text-dark-teal md:text-3xl">
              {heading}
            </h2>

            {lead && (
              <p className="text-base font-medium leading-relaxed text-dark-teal md:text-lg">
                {lead}
              </p>
            )}

            {body.length > 0 && (
              <div className="mt-4 hidden space-y-4 text-base leading-relaxed text-dark-teal/90 md:block md:text-lg">
                {body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
