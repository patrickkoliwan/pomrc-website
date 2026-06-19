import { GiTennisCourt } from "react-icons/gi";
import { MdOutlineSportsTennis } from "react-icons/md";
import { LuPartyPopper } from "react-icons/lu";
import HomeHeroCarousel from "./HomeHeroCarousel";
import HomeEventsTeaser from "@/components/HomeEventsTeaser";
import { getHomepageEventPreview } from "@/lib/events/homepage-events";
import { googleMapsEmbedUrl, googleMapsPlaceUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function Home() {
  const previewEvents = await getHomepageEventPreview(3);

  return (
    <main>
      <HomeHeroCarousel />
      <HomeEventsTeaser events={previewEvents} />

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
                src={googleMapsEmbedUrl}
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
                  href={googleMapsPlaceUrl}
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
