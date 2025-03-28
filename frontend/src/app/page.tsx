import Image from "next/image";
import { GiTennisCourt } from "react-icons/gi";
import { MdOutlineSportsTennis } from "react-icons/md";
import { LuPartyPopper } from "react-icons/lu";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <div className="relative h-[600px] w-full">
        {/* Image container with overlay */}
        <div className="absolute inset-0 bg-dark-teal/30 z-10" />{" "}
        {/* Overlay */}
        <div className="relative h-full w-full">
          <Image
            src="/hero-placeholder.jpg"
            alt="Port Moresby Racquets Club"
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyUC08LSw1NDBAQFZJOjU6PUFXYWNkY2lrbW1pf3x/e4iKc4KDgP/2wBDARUXFx4aHh4gICD4lJSU+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </div>
        {/* Hero content */}
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

      {/* Main content section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-light-teal p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-dark-teal mb-4">
            Join Our Community
          </h2>
          <p className="text-dark-teal mb-6">
            Whether you're a beginner or an experienced player, we offer
            excellent facilities and programs for all skill levels. Enjoy our
            professional courts, coaching programs, and vibrant club atmosphere.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-light-cream p-6 rounded-lg shadow">
              <div className="flex items-center gap-2 mb-3">
                <GiTennisCourt className="text-dark-teal text-2xl" />
                <h3 className="text-xl font-semibold text-dark-teal">
                  Our Courts
                </h3>
              </div>
              <p className="text-dark-teal">
                7 synthetic grass tennis courts and 3 glass-backed squash
                courts, all well maintained for optimal playing conditions.
              </p>
            </div>
            <div className="bg-light-cream p-6 rounded-lg shadow">
              <div className="flex items-center gap-2 mb-3">
                <MdOutlineSportsTennis className="text-dark-teal text-2xl" />
                <h3 className="text-xl font-semibold text-dark-teal">
                  Expert Coaching
                </h3>
              </div>
              <p className="text-dark-teal">
                Professional coaching available for all skill levels and ages.
              </p>
            </div>
            <div className="bg-light-cream p-6 rounded-lg shadow">
              <div className="flex items-center gap-2 mb-3">
                <LuPartyPopper className="text-dark-teal text-2xl" />
                <h3 className="text-xl font-semibold text-dark-teal">
                  Social Events & Venues
                </h3>
              </div>
              <p className="text-dark-teal">
                Enjoy our events lawn, squash courtyard, and clubhouse featuring
                a bar and restaurant. Perfect for regular tournaments, social
                gatherings, and community events.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
