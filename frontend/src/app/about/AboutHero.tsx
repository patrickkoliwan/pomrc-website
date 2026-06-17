"use client";

import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";
import {
  BLUR_DATA_URL,
  buildHeroSlides,
  heroStats,
  type AboutHeroSlide,
} from "./about-content";

interface AboutHeroProps {
  title: string;
  tagline?: string;
  cmsHeroImageUrl?: string | null;
}

export default function AboutHero({
  title,
  tagline,
  cmsHeroImageUrl,
}: AboutHeroProps) {
  const slides: AboutHeroSlide[] = buildHeroSlides(cmsHeroImageUrl);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative h-[40vh] min-h-[240px] w-full overflow-hidden md:h-[50vh] md:min-h-[360px]">
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.src} className="relative min-w-full h-full">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={85}
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-dark-teal/90 via-dark-teal/40 to-dark-teal/20" />

      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-light-cream/80 p-1.5 text-dark-teal hover:bg-light-cream md:p-2"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-light-cream/80 p-1.5 text-dark-teal hover:bg-light-cream md:p-2"
        aria-label="Next slide"
      >
        <FiChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2 md:bottom-6">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full md:h-3 md:w-3 ${
              index === currentIndex ? "bg-light-cream" : "bg-light-cream/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end px-4 pb-8 text-center text-light-cream sm:px-6 md:pb-16 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold md:mb-4 md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {tagline && (
          <p className="mb-0 max-w-3xl text-base font-light md:mb-8 md:text-xl lg:text-2xl">
            {tagline}
          </p>
        )}

        <div className="mt-6 hidden w-full max-w-3xl grid-cols-3 gap-4 md:grid">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-light-cream/15 px-4 py-3 backdrop-blur-sm"
            >
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-sm text-light-cream/90">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
