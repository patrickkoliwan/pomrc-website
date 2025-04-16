"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function About() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openModal = (imageIndex: number) => {
    setSelectedImage(imageIndex);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  // Using actual club images from the website
  const images = [
    {
      src: "/clubhouse.jpg",
      alt: "POMRC Clubhouse",
      caption: "Our modern Clubhouse built during the 2015 Pacific Games",
    },
    {
      src: "/southern-court.jpg",
      alt: "Tennis Courts",
      caption: "International competition level tennis courts",
    },
    {
      src: "/squash-courts.jpg",
      alt: "Squash Courts",
      caption: "State-of-the-art glass-backed squash courts",
    },
    {
      src: "/pomrc-open.jpg",
      alt: "POMRC Open Tournament",
      caption:
        "The POMRC Open is PNG&apos;s most prestigious tennis and squash competition",
    },
  ];

  return (
    <main className="min-h-screen bg-light-cream">
      <HeroSection
        title="About POMRC"
        tagline="Premier Racquets Destination in Port Moresby"
        backgroundImage="/clubhouse.jpg"
        altText="POMRC Clubhouse exterior"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <AnimatedSection className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-semibold mb-6 text-dark-teal">
            Our Legacy
          </h2>
          <div className="prose max-w-none text-lg text-dark-teal space-y-6">
            <p>
              The Port Moresby Racquets Club officially debuted during the
              spectacular Pacific Games Opening Ceremony on July 4th, 2015. As
              part of this landmark event&apos;s Legacy Agreement, the club
              underwent a remarkable transformation, establishing itself as a
              premier sporting destination in Port Moresby.
            </p>
            <p>
              Our state-of-the-art facilities include international-standard
              tennis courts, professional glass-backed squash courts, and a
              modern Clubhouse designed to foster community connection.
            </p>
          </div>
        </AnimatedSection>

        <hr className="border-t-2 border-muted-teal/50 mx-auto w-1/2" />

        <AnimatedSection
          className="bg-light-teal rounded-lg shadow-lg p-8 md:p-12"
          delay={0.1}
        >
          <h2 className="text-3xl font-semibold mb-6 text-dark-teal">
            Championship Tradition
          </h2>
          <div className="prose max-w-none text-lg text-dark-teal space-y-6">
            <p>
              Since 2016, the POMRC Open has evolved into PNG&apos;s most
              prestigious tennis and squash competition. Now in its 9th year
              (with a pause in 2020 due to the Covid-19 pandemic), this
              signature event serves as an official ranking tournament for Team
              PNG selection, highlighting our commitment to developing elite
              sporting talent across the nation.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h2 className="text-3xl font-semibold mb-8 text-dark-teal text-center">
            Our Club Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => openModal(index)}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-dark-teal/10 hover:bg-dark-teal/30 flex items-center justify-center transition-colors">
                    <div className="text-light-cream bg-dark-teal/70 px-4 py-2 rounded opacity-0 hover:opacity-100 transition-opacity">
                      View Larger
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-dark-teal">{image.alt}</h3>
                  <p className="text-sm text-muted-teal">{image.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[60vh]">
                <Image
                  src={images[selectedImage].src}
                  alt={images[selectedImage].alt}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-dark-teal mb-2">
                  {images[selectedImage].alt}
                </h3>
                <p className="text-muted-teal mb-4">
                  {images[selectedImage].caption}
                </p>
                <button
                  className="bg-dark-teal text-light-cream py-2 px-4 rounded hover:bg-muted-teal transition-colors"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <AnimatedSection
          className="text-center py-12 bg-dark-teal text-light-cream rounded-lg shadow-lg"
          delay={0.3}
        >
          <h2 className="text-3xl font-semibold mb-4">Ready to Join?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Become a part of the premier racquets community in Port Moresby.
          </p>
          <Link
            href="/membership"
            className="inline-block bg-deep-red text-light-cream px-8 py-3 rounded-md text-lg font-semibold hover:bg-opacity-80 transition-colors"
            role="button"
          >
            Learn More About Membership
          </Link>
        </AnimatedSection>
      </div>
    </main>
  );
}
