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
        <div className="absolute inset-0 bg-dark-teal/30 z-10" />
        <div className="relative h-full w-full">
          <Image
            src="/hero-placeholder.jpg"
            alt="Port Moresby Racquets Club - Tennis and Squash Courts"
            width={1920}
            height={1080}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            quality={85}
            className="object-cover h-full"
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
            Whether you&apos;re a beginner or an experienced player, we offer
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

      {/* Map and Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-16">
        <div className="bg-light-teal p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-dark-teal mb-8 text-center">
            Come Find Us Today!
          </h2>
          <p className="text-xl text-dark-teal mb-8 text-center">
            Located in the heart of Port Moresby, we&apos;re ready to welcome
            you to our vibrant sporting community.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="w-full h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3935.3743960284355!2d147.20059828123692!3d-9.476127075131304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x690236b85f5f7729%3A0xd6ae37f22b23fbb5!2sPort%20Moresby%20Raquets%20Club%20Bava%20St%2C%20Boroko!5e0!3m2!1sen!2spg!4v1743199274557!5m2!1sen!2spg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-lg"
                sandbox="allow-scripts allow-same-origin allow-popups"
                title="Port Moresby Racquets Club Location"
              />
            </div>
            <div className="w-full bg-light-cream p-8 rounded-lg shadow-lg h-[500px] overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h3 className="text-2xl font-semibold text-dark-teal">
                  What Our Members Say
                </h3>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <div className="text-deep-red text-xl mr-2">★★★★☆</div>
                  <div className="text-dark-teal border-l border-muted-teal/20 pl-2">
                    <span className="font-medium">4.3/5</span>
                    <span className="text-sm text-dark-teal/80 ml-1">
                      from 30 reviews
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-muted-teal/10 hover:border-muted-teal/30 transition-colors">
                  <div className="flex items-center mb-4">
                    <div className="text-deep-red text-lg">★★★★★</div>
                    <span className="ml-3 text-dark-teal font-medium">
                      Nick Nick
                    </span>
                  </div>
                  <p className="text-dark-teal/90 leading-relaxed">
                    &quot;Great family sports club in a safe location. Has the
                    best tennis and squash courts in town. Friendly atmosphere.
                    Has an outstanding chef if you&apos;re just looking for a
                    place to drink and eat lunch/dinner.&quot;
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-muted-teal/10 hover:border-muted-teal/30 transition-colors">
                  <div className="flex items-center mb-4">
                    <div className="text-deep-red text-lg">★★★★</div>
                    <span className="ml-3 text-dark-teal font-medium">
                      Materua Tamarua
                    </span>
                  </div>
                  <p className="text-dark-teal/90 leading-relaxed">
                    &quot;If you love your racquet sports, this is the place for
                    you. Great squash and outdoor tennis courts. It prob has the
                    most affordable club membership in POM and the most
                    affordable bar in POM as well.&quot;
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-muted-teal/10 hover:border-muted-teal/30 transition-colors">
                  <div className="flex items-center mb-4">
                    <div className="text-deep-red text-lg">★★★★</div>
                    <span className="ml-3 text-dark-teal font-medium">
                      Lukas Bekker
                    </span>
                  </div>
                  <p className="text-dark-teal/90 leading-relaxed">
                    &quot;Good clean Facilities. Also much more affordable than
                    most private sports clubs&quot;
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps/place/Port+Moresby+Raquets+Club+Bava+St,+Boroko/@-9.4761271,147.2005983,17z/data=!3m1!4b1!4m6!3m5!1s0x690236b85f5f7729:0xd6ae37f22b23fbb5!8m2!3d-9.4761271!4d147.2005983!16s%2Fg%2F11c5m8c4k8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-deep-red hover:text-muted-teal transition-colors mt-4 group"
                >
                  <span>View more reviews on Google</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
