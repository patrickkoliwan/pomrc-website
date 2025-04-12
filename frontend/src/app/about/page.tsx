"use client";

import { useState } from "react";
import Image from "next/image";

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
      src: "/southern-courts.jpg",
      alt: "Tennis Courts",
      caption: "International competition level tennis courts",
    },
    {
      src: "/squash-courts.jpg",
      alt: "Squash Courts",
      caption: "State-of-the-art glass-backed squash courts",
    },
    {
      src: "/images/tennis-advanced-2.jpg",
      alt: "POMRC Open Tournament",
      caption:
        "The POMRC Open is PNG's most prestigious tennis and squash competition",
    },
  ];

  return (
    <main className="min-h-screen bg-light-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-dark-teal mb-8 text-center">
          About POMRC
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="prose max-w-none text-dark-teal">
            <h2 className="text-2xl font-semibold mb-4 text-dark-teal">
              Our Legacy
            </h2>

            <p className="mb-6 text-lg">
              The Port Moresby Racquets Club officially debuted during the
              spectacular Pacific Games Opening Ceremony on July 4th, 2015. As
              part of this landmark event's Legacy Agreement, the club underwent
              a remarkable transformation, establishing itself as a premier
              sporting destination in Port Moresby.
            </p>

            <p className="mb-10 text-lg">
              Our state of the art facilities include international-standard
              tennis courts, professional glass-backed squash courts, and a
              modern Clubhouse designed to foster community connection.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-dark-teal">
              Championship Tradition
            </h2>

            <p className="mb-10 text-lg">
              Since 2016, the POMRC Open has evolved into PNG's most prestigious
              tennis and squash competition. Now in its 9th year (with a pause
              in 2020 due to the Covid-19 pandemic), this signature event serves
              as an official ranking tournament for Team PNG selection,
              highlighting our commitment to developing elite sporting talent
              across the nation.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-dark-teal text-center">
          Our Club Gallery
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

        {/* Image Modal */}
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
      </div>
    </main>
  );
}
