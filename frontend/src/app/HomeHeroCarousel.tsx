"use client";

import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState, useEffect, useCallback } from "react";

const heroImages = [
  {
    src: "/hero-placeholder.jpg",
    alt: "Port Moresby Racquets Club - Tennis Courts",
  },
  {
    src: "/hero-2.jpg",
    alt: "Port Moresby Racquets Club - Bar",
  },
  {
    src: "/hero-3.jpg",
    alt: "Port Moresby Racquets Club - Social Tennis",
  },
];

export default function HomeHeroCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const prevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
      >
        {heroImages.map((image, index) => (
          <div key={index} className="relative min-w-full h-full">
            <div className="absolute inset-0 bg-dark-teal/30 z-10" />
            <Image
              src={image.src}
              alt={image.alt}
              width={1920}
              height={1080}
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              quality={85}
              className="object-cover h-full w-full"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyUC08LSw1NDBAQFZJOjU6PUFXYWNkY2lrbW1pf3x/e4iKc4KDgP/2wBDARUXFx4aHh4gICD4lJSU+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute md:left-4 md:top-1/2 md:-translate-y-1/2 left-4 bottom-20 z-30 bg-light-cream/80 hover:bg-light-cream p-1.5 md:p-2 rounded-full text-dark-teal"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute md:right-4 md:top-1/2 md:-translate-y-1/2 right-4 bottom-20 z-30 bg-light-cream/80 hover:bg-light-cream p-1.5 md:p-2 rounded-full text-dark-teal"
        aria-label="Next slide"
      >
        <FiChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
              index === currentImageIndex
                ? "bg-light-cream"
                : "bg-light-cream/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="text-center text-light-cream px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Welcome to Port Moresby Racquets Club
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
            Your premier destination for tennis, squash, and social activities
            in Port Moresby
          </p>
          <a
            href="/membership"
            className="inline-block bg-deep-red text-light-cream px-8 py-4 rounded-md font-medium hover:bg-muted-teal transition-colors text-lg"
          >
            Join Our Club
          </a>
        </div>
      </div>
    </div>
  );
}
