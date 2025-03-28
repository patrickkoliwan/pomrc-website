import ProgramCard from "@/components/ProgramCard";
import { juniorPrograms } from "@/data/juniorPrograms";
import PerformanceMetrics from "@/components/PerformanceMetrics";

export default function JuniorPrograms() {
  return (
    <main className="min-h-screen bg-light-cream">
      <PerformanceMetrics />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-teal mb-4">
            Junior Programs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Develop your child&apos;s tennis and squash skills with our
            comprehensive junior programs. We offer classes for all skill
            levels, from beginners to advanced players.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {juniorPrograms.map((program, index) => (
            <ProgramCard
              key={program.id}
              program={program}
              isPriority={index === 0}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
