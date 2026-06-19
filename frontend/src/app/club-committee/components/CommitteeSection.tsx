import AnimatedSection from "@/components/ui/AnimatedSection";
import { DisplayMember } from "../committee-content";
import CommitteeMemberCard from "./CommitteeMemberCard";

interface CommitteeSectionProps {
  id: string;
  title: string;
  members: DisplayMember[];
  delay?: number;
}

export default function CommitteeSection({
  id,
  title,
  members,
  delay = 0,
}: CommitteeSectionProps) {
  if (members.length === 0) {
    return null;
  }

  return (
    <AnimatedSection delay={delay}>
      <section id={id} className="scroll-mt-24">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-dark-teal md:text-3xl">
            {title}
          </h2>
        </div>

        <div
          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          role="list"
          aria-label={title}
        >
          {members.map((member, index) => (
            <div key={member.id ?? `${member.name}-${index}`} role="listitem">
              <CommitteeMemberCard member={member} index={index} />
            </div>
          ))}
        </div>
      </section>
    </AnimatedSection>
  );
}
