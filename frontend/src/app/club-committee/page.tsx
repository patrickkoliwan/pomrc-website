import {
  dedupeCommitteeMembers,
  dedupeCommitteePositions,
} from "@/lib/cms/committee";
import {
  getPublishedCommitteeMembers,
  getPublishedCommitteePositions,
} from "@/lib/cms/public-data";
import {
  COMMITTEE_SECTION_ID,
  DisplayMember,
  fallbackCommitteeMembers,
  resolveMemberPhotoUrl,
} from "./committee-content";
import CommitteeCta from "./components/CommitteeCta";
import CommitteeHero from "./components/CommitteeHero";
import CommitteeSection from "./components/CommitteeSection";

export const revalidate = 3600;

export default async function CommitteePage() {
  const cmsPositions = await getPublishedCommitteePositions();
  const cmsMembers = await getPublishedCommitteeMembers();
  const uniqueCmsPositions = dedupeCommitteePositions(cmsPositions).filter(
    (position) => position.member
  );
  const uniqueCmsMembers = dedupeCommitteeMembers(cmsMembers);

  const displayedMembers: DisplayMember[] = uniqueCmsPositions.length
    ? uniqueCmsPositions.map((position) => ({
        id: position.id,
        name: position.member?.name ?? "",
        position: position.title,
        imageUrl: resolveMemberPhotoUrl(
          position.member?.name ?? "",
          position.member?.photo_url
        ),
        isActing: position.is_acting,
      }))
    : uniqueCmsMembers.length
      ? uniqueCmsMembers.map((member) => ({
          id: member.id,
          name: member.name,
          position: member.title,
          imageUrl: resolveMemberPhotoUrl(member.name, member.photo_url),
        }))
      : fallbackCommitteeMembers;

  return (
    <main className="min-h-screen bg-light-cream">
      <CommitteeHero />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6 md:space-y-8 md:py-6 lg:px-8">
        <CommitteeSection
          id={COMMITTEE_SECTION_ID}
          title="Committee Members"
          members={displayedMembers}
        />

        <CommitteeCta />
      </div>
    </main>
  );
}
