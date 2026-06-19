import type {
  CommitteeMemberRecord,
  CommitteePositionWithMember,
} from "./types";

function committeeDuplicateKey(member: CommitteeMemberRecord) {
  return [
    member.name.trim().toLowerCase(),
    member.title.trim().toLowerCase(),
    (member.photo_url ?? "").trim(),
    member.display_order,
  ].join("|");
}

export function dedupeCommitteeMembers<T extends CommitteeMemberRecord>(
  members: T[]
) {
  const seen = new Set<string>();

  return members.filter((member) => {
    const key = committeeDuplicateKey(member);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function dedupeCommitteePositions<T extends CommitteePositionWithMember>(
  positions: T[]
) {
  const seen = new Set<string>();

  return positions.filter((position) => {
    const key = [
      position.title.trim().toLowerCase(),
      position.member_id ?? "empty",
      position.is_acting ? "acting" : "permanent",
    ].join("|");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
