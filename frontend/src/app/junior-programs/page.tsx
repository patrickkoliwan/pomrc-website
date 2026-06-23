import ProgramCard from "@/components/ProgramCard";
import { juniorPrograms } from "@/data/juniorPrograms";
import {
  getPublishedJuniorProgramNotice,
  getPublishedJuniorPrograms,
} from "@/lib/cms/public-data";
import type { JuniorProgramNoticeRecord } from "@/lib/cms/types";
import { isJuniorProgramNoticePublic } from "@/lib/junior-programs/notice";
import {
  groupJuniorPrograms,
  mapJuniorProgram,
} from "@/lib/junior-programs/programs";
import { hasSupabasePublicConfig } from "@/lib/supabase/server";

export default async function JuniorPrograms() {
  const [cmsPrograms, notice] = await Promise.all([
    getPublishedJuniorPrograms(),
    getPublishedJuniorProgramNotice(),
  ]);
  const programs = hasSupabasePublicConfig()
    ? cmsPrograms.map(mapJuniorProgram)
    : juniorPrograms;
  const groupedPrograms = groupJuniorPrograms(programs);
  const tennisPrograms = groupedPrograms.tennis;
  const squashPrograms = groupedPrograms.squash;
  const otherPrograms = groupedPrograms.other;
  const visibleSections = [
    tennisPrograms.length > 0 && { href: "#tennis", label: "Tennis Programs" },
    squashPrograms.length > 0 && { href: "#squash", label: "Squash Programs" },
    otherPrograms.length > 0 && { href: "#other", label: "Other Programs" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <main className="min-h-screen bg-light-cream">
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

        {visibleSections.length > 0 && (
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-md shadow-sm bg-light-teal p-1">
              {visibleSections.map((section) => (
                <a
                  key={section.href}
                  href={section.href}
                  className="px-5 py-3 text-deep-red hover:text-dark-teal font-medium rounded-md hover:bg-white transition duration-150 ease-in-out"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>
        )}

        <JuniorProgramNotice notice={notice} />

        {tennisPrograms.length > 0 && (
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
                  (WPQ), which begin at the under-12 category. Success at the
                  WPQ opens doors to the Pacific Oceania Junior Championships,
                  where top finishers may qualify for further opportunities in
                  Pacific Oceania junior touring events. Join us to start your
                  child&apos;s journey toward tennis excellence on the
                  international stage.
                </p>
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
        )}

        {squashPrograms.length > 0 && (
          <section id="squash" className="mb-16 scroll-mt-24">
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
                  isPriority={tennisPrograms.length === 0 && index === 0}
                />
              ))}
            </div>
          </section>
        )}

        {otherPrograms.length > 0 && (
          <section id="other" className="scroll-mt-24">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-dark-teal mb-4">
                Other Programs
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {otherPrograms.map((program, index) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  isPriority={
                    tennisPrograms.length === 0 &&
                    squashPrograms.length === 0 &&
                    index === 0
                  }
                />
              ))}
            </div>
          </section>
        )}

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

function JuniorProgramNotice({
  notice,
}: {
  notice: JuniorProgramNoticeRecord | null;
}) {
  if (!notice || !isJuniorProgramNoticePublic(notice)) {
    return null;
  }

  return (
    <div className="mb-12 border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
      <p className="mb-2 font-bold">Important Notice:</p>
      <p className="whitespace-pre-line">{notice.message}</p>
    </div>
  );
}
