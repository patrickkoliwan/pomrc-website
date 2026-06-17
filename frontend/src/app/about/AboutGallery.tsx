"use client";

import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCallback, useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BLUR_DATA_URL, GALLERY_SECTION_ID, galleryImages } from "./about-content";

export default function AboutGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isOpen = selectedIndex !== null;

  const openAt = (index: number) => setSelectedIndex(index);
  const close = () => setSelectedIndex(null);

  const showPrev = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null) return null;
      return current === 0 ? galleryImages.length - 1 : current - 1;
    });
  }, []);

  const showNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null) return null;
      return current === galleryImages.length - 1 ? 0 : current + 1;
    });
  }, []);

  const selectedImage =
    selectedIndex !== null ? galleryImages[selectedIndex] : null;

  return (
    <AnimatedSection delay={0.2} className="scroll-mt-24">
      <section id={GALLERY_SECTION_ID}>
        <h2 className="mb-4 text-center text-2xl font-semibold text-dark-teal md:mb-8 md:text-3xl">
          Our Club Gallery
        </h2>

        <div className="grid grid-cols-2 gap-3 md:hidden">
          {galleryImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className="relative aspect-[4/5] w-full overflow-hidden rounded-xl text-left"
              onClick={() => openAt(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-teal/80 to-transparent px-3 py-3">
                <h3 className="text-sm font-medium text-light-cream">
                  {image.alt}
                </h3>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-teal md:hidden">
          Tap to view larger
        </p>

        <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className="overflow-hidden rounded-2xl bg-white text-left ring-1 ring-dark-teal/10 transition-transform hover:scale-[1.02]"
              onClick={() => openAt(index)}
            >
              <div className="relative h-64 w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="25vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-dark-teal">{image.alt}</h3>
                <p className="text-sm text-muted-teal">{image.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
        {selectedImage && (
          <DialogContent
            className={cn(
              "gap-0 overflow-hidden border-dark-teal/10 bg-white p-0",
              "fixed bottom-0 left-0 top-auto max-h-[90vh] w-full max-w-none translate-x-0 translate-y-0 rounded-t-2xl",
              "sm:bottom-auto sm:left-[50%] sm:top-[50%] sm:max-w-4xl sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg"
            )}
          >
            <div className="relative h-[45vh] sm:h-[60vh]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 896px"
              />

              <button
                type="button"
                onClick={showPrev}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-dark-teal/80 p-2 text-light-cream hover:bg-dark-teal"
                aria-label="Previous image"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-dark-teal/80 p-2 text-light-cream hover:bg-dark-teal"
                aria-label="Next image"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>

            <DialogHeader className="space-y-2 p-6 text-left">
              <DialogTitle className="text-xl text-dark-teal">
                {selectedImage.alt}
              </DialogTitle>
              <DialogDescription className="text-muted-teal">
                {selectedImage.caption}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
    </AnimatedSection>
  );
}
