import ProgramCard from "@/components/ProgramCard";
import { juniorPrograms } from "@/data/juniorPrograms";
import PerformanceMetrics from "@/components/PerformanceMetrics";

export default function JuniorPrograms() {
  const tennisPrograms = juniorPrograms.filter((program) =>
    program.title.toLowerCase().includes("tennis")
  );

  const squashPrograms = juniorPrograms.filter((program) =>
    program.title.toLowerCase().includes("squash")
  );

  return (
    <main className="min-h-screen bg-light-cream">
      <PerformanceMetrics />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-teal mb-4">
            Junior Programs
          </h1>
          <p className="text-xl text-muted-teal max-w-3xl mx-auto">
            Develop your child&apos;s tennis and squash skills with our
            comprehensive junior programs. We offer classes for all skill
            levels, from beginners to advanced players.
          </p>
        </div>

        {/* Program Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-md shadow-sm bg-light-teal p-1">
            <a
              href="#tennis"
              className="px-5 py-3 text-deep-red hover:text-dark-teal font-medium rounded-md hover:bg-white transition duration-150 ease-in-out"
            >
              Tennis Programs
            </a>
            <a
              href="#squash"
              className="px-5 py-3 text-deep-red hover:text-dark-teal font-medium rounded-md hover:bg-white transition duration-150 ease-in-out"
            >
              Squash Programs
            </a>
          </div>
        </div>

        {/* Tennis Section */}
        <section id="tennis" className="mb-16 scroll-mt-24">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-dark-teal mb-4">
              Tennis Programs
            </h2>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-6">
                Our junior tennis training prepares children from age ten
                onwards for competitive play at the highest level. We focus on
                building strong foundations for the West Pacific Qualifiers
                (WPQ), which begin at the under-12 category. Success at the WPQ
                opens doors to the Pacific Oceania Junior Championships, where
                top finishers may qualify for further opportunities in Pacific
                Oceania junior touring events. Join us to start your
                child&apos;s journey toward tennis excellence on the
                international stage.
              </p>
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p className="font-bold mb-2">⚠️ Important Notice:</p>
                <p className="mb-2">Due to unforeseen circumstances, group junior tennis programs have been suspended until further notice. Private coaching for kids is still available and parents can inquire at the club bar for available coaches, fees and time slots.</p>
                <div className="flex items-center gap-2">
                  <p>Check socials for latest updates</p>
                  <a 
                    href="https://www.facebook.com/pomracquetsclub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tennisPrograms.map((program, index) => (
              <ProgramCard
                key={program.id}
                program={program}
                isPriority={index === 0}
              />
            ))}
          </div>
        </section>

        {/* Squash Section */}
        <section id="squash" className="scroll-mt-24">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-dark-teal mb-4">
              Squash Programs
            </h2>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-6">
                The Squash Junior Development Elite program offers weekly
                dedicated training sessions for juniors aspiring to compete at
                regional and international levels. Our program creates clear
                pathways to prestigious competitions including the Oceania
                Junior Championships and Australian Junior Open. POMRC Squash
                Juniors have proudly represented PNG at the 2018 Commonwealth
                Games, 2019 Pacific Games, and 2022 Birmingham Commonwealth
                Games. Endorsed by the PNG Squash Rackets Federation, our
                program is your child&apos;s gateway to sporting excellence.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {squashPrograms.map((program, index) => (
              <ProgramCard
                key={program.id}
                program={program}
                isPriority={index === 0}
              />
            ))}
          </div>
        </section>

        {/* Back to top button */}
        <div className="flex justify-center mt-12">
          <a
            href="#"
            className="px-5 py-3 bg-light-teal text-dark-teal hover:bg-muted-teal hover:text-light-cream font-medium rounded-md transition duration-150 ease-in-out"
          >
            Back to Top
          </a>
        </div>
      </div>
    </main>
  );
}
