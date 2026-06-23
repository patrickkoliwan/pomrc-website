"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { resolveMemberPhotoUrl } from "@/app/club-committee/committee-content";
import type {
  CommitteeMemberRecord,
  CommitteePositionRecord,
} from "@/lib/cms/types";
import CroppedImageUploader from "../components/CroppedImageUploader";
import { CMS_IMAGE_PRESETS } from "../components/image-presets";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const COMMITTEE_PHOTO_PRESET = CMS_IMAGE_PRESETS.squarePortrait;

type PositionForm = {
  id?: string;
  title: string;
  published: boolean;
  member_id: string;
  is_acting: boolean;
  memberMode: "existing" | "new";
  existingMemberPhotoUrl: string;
  newMemberName: string;
  newMemberPhotoUrl: string;
  newMemberBio: string;
  newMemberEmailAlias: string;
};

const emptyForm: PositionForm = {
  title: "",
  published: true,
  member_id: "",
  is_acting: false,
  memberMode: "existing",
  existingMemberPhotoUrl: "",
  newMemberName: "",
  newMemberPhotoUrl: "",
  newMemberBio: "",
  newMemberEmailAlias: "",
};

function nextDisplayOrder(positions: CommitteePositionRecord[]) {
  if (positions.length === 0) {
    return 0;
  }

  return Math.max(...positions.map((position) => position.display_order)) + 1;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function MemberAvatar({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl?: string | null;
}) {
  const imageUrl = resolveMemberPhotoUrl(name, photoUrl);

  if (imageUrl) {
    return (
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-light-teal">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover object-center"
          sizes="48px"
        />
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-light-teal text-sm font-bold text-dark-teal">
      {name ? getInitials(name) : "-"}
    </div>
  );
}

export default function AdminCommitteeManager({
  initialPositions,
  initialMembers,
}: {
  initialPositions: CommitteePositionRecord[];
  initialMembers: CommitteeMemberRecord[];
}) {
  const [positions, setPositions] =
    useState<CommitteePositionRecord[]>(initialPositions);
  const [members, setMembers] = useState<CommitteeMemberRecord[]>(initialMembers);
  const [editing, setEditing] = useState<PositionForm | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const membersById = useMemo(
    () => new Map(members.map((member) => [member.id, member])),
    [members]
  );
  const sortedPositions = useMemo(
    () => [...positions].sort((a, b) => a.display_order - b.display_order),
    [positions]
  );

  function beginCreate() {
    setEditing({
      ...emptyForm,
    });
    setStatus(null);
    setError(null);
  }

  function beginEdit(position: CommitteePositionRecord) {
    setEditing({
      ...emptyForm,
      id: position.id,
      title: position.title,
      published: position.published,
      member_id: position.member_id ?? "",
      is_acting: position.is_acting,
      memberMode: position.member_id ? "existing" : "existing",
      existingMemberPhotoUrl: position.member_id
        ? membersById.get(position.member_id)?.photo_url ?? ""
        : "",
    });
    setStatus(null);
    setError(null);
  }

  function closeEditing() {
    setEditing(null);
    setError(null);
  }

  function updateField<K extends keyof PositionForm>(
    field: K,
    value: PositionForm[K]
  ) {
    setEditing((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current
    );
  }

  async function uploadNewMemberPhoto(file: File | null) {
    return uploadCommitteePhoto(file, "newMemberPhotoUrl");
  }

  async function uploadExistingMemberPhoto(file: File | null) {
    return uploadCommitteePhoto(file, "existingMemberPhotoUrl");
  }

  async function uploadCommitteePhoto(
    file: File | null,
    field: "existingMemberPhotoUrl" | "newMemberPhotoUrl"
  ) {
    if (!file || !editing) {
      return "";
    }

    setStatus("Uploading photo...");
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus(null);
      setError(result.error || "Photo upload failed");
      throw new Error(result.error || "Photo upload failed");
    }

    updateField(field, result.url);
    setStatus("Photo uploaded.");
    return result.url as string;
  }

  function updateExistingMember(memberId: string) {
    const member = memberId ? membersById.get(memberId) : null;

    setEditing((current) =>
      current
        ? {
            ...current,
            member_id: memberId,
            existingMemberPhotoUrl: member?.photo_url ?? "",
          }
        : current
    );
  }

  async function savePosition(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editing) {
      return;
    }

    setStatus("Saving position...");
    setError(null);

    let memberId = editing.member_id || null;

    if (editing.memberMode === "new") {
      if (!editing.newMemberName.trim()) {
        setStatus(null);
        setError("Enter a name for the new committee member.");
        return;
      }

      const memberResponse = await fetch("/api/admin/cms/committee_members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.newMemberName,
          title: "Committee Member",
          photo_url: editing.newMemberPhotoUrl,
          bio: editing.newMemberBio,
          email_alias: editing.newMemberEmailAlias,
          display_order: members.length,
          published: true,
        }),
      });
      const memberResult = await memberResponse.json();

      if (!memberResponse.ok) {
        setStatus(null);
        setError(memberResult.error || "Could not create committee member.");
        return;
      }

      memberId = memberResult.data.id;
      setMembers((current) => [...current, memberResult.data]);
    } else if (memberId) {
      const member = membersById.get(memberId);
      const nextPhotoUrl = editing.existingMemberPhotoUrl.trim();

      if (member && nextPhotoUrl !== (member.photo_url ?? "")) {
        const memberResponse = await fetch(
          `/api/admin/cms/committee_members/${member.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...member,
              photo_url: nextPhotoUrl,
            }),
          }
        );
        const memberResult = await memberResponse.json();

        if (!memberResponse.ok) {
          setStatus(null);
          setError(memberResult.error || "Could not update committee member photo.");
          return;
        }

        setMembers((current) =>
          current.map((currentMember) =>
            currentMember.id === memberResult.data.id
              ? memberResult.data
              : currentMember
          )
        );
      }
    }

    const isUpdate = Boolean(editing.id);
    const displayOrder = isUpdate
      ? positions.find((position) => position.id === editing.id)?.display_order ?? 0
      : nextDisplayOrder(positions);

    const payload = {
      title: editing.title,
      display_order: displayOrder,
      published: editing.published,
      member_id: memberId,
      is_acting: editing.is_acting,
    };
    const response = await fetch(
      isUpdate
        ? `/api/admin/cms/committee_positions/${editing.id}`
        : "/api/admin/cms/committee_positions",
      {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const result = await response.json();

    if (!response.ok) {
      setStatus(null);
      setError(result.error || "Could not save position.");
      return;
    }

    setPositions((current) =>
      isUpdate
        ? current.map((position) =>
            position.id === result.data.id ? result.data : position
          )
        : [...current, result.data]
    );
    closeEditing();
    setStatus("Saved.");
  }

  async function deletePosition(position: CommitteePositionRecord) {
    if (
      !window.confirm(
        `Delete the ${position.title} position? The assigned member will be kept.`
      )
    ) {
      return;
    }

    setStatus("Deleting position...");
    setError(null);
    const response = await fetch(`/api/admin/cms/committee_positions/${position.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = await response.json();
      setStatus(null);
      setError(result.error || "Could not delete position.");
      return;
    }

    setPositions((current) =>
      current.filter((currentPosition) => currentPosition.id !== position.id)
    );
    setStatus("Position deleted. The member record was kept.");
  }

  return (
    <>
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark-teal">
              Committee positions
            </h2>
            <p className="mt-1 text-sm text-muted-teal">
              Create positions, fill them, or leave them hidden until ready.
            </p>
          </div>
          <button
            type="button"
            onClick={beginCreate}
            className="rounded-md bg-dark-teal px-4 py-2 text-sm font-semibold text-light-cream hover:bg-muted-teal"
          >
            Create position
          </button>
        </div>

        {sortedPositions.length === 0 ? (
          <p className="rounded-md border border-muted-teal/20 bg-light-teal p-4 text-dark-teal">
            No committee positions yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedPositions.map((position) => {
              const member = position.member_id
                ? membersById.get(position.member_id)
                : null;

              return (
                <div
                  key={position.id}
                  className="flex h-full flex-col gap-3 rounded-lg border border-muted-teal/20 p-4"
                >
                  <div className="flex items-start gap-3">
                    <MemberAvatar
                      name={member?.name ?? ""}
                      photoUrl={member?.photo_url}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-dark-teal">
                          {position.title}
                        </h3>
                        {position.is_acting && (
                          <span className="rounded-full bg-light-teal px-2 py-0.5 text-xs font-semibold text-dark-teal">
                            Acting
                          </span>
                        )}
                        {!position.published && (
                          <span className="rounded-full bg-deep-red/10 px-2 py-0.5 text-xs font-semibold text-deep-red">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-teal">
                        {member ? member.name : "Unfilled"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto grid w-full grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => beginEdit(position)}
                      className="rounded-md border border-muted-teal px-3 py-2 text-sm font-medium text-dark-teal hover:bg-light-teal"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePosition(position)}
                      className="rounded-md border border-deep-red px-3 py-2 text-sm font-medium text-deep-red hover:bg-deep-red/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {status && <p className="mt-4 text-sm text-muted-teal">{status}</p>}
        {error && !editing && (
          <p className="mt-4 text-sm text-deep-red">{error}</p>
        )}
      </section>

      <Dialog open={!!editing} onOpenChange={(open) => !open && closeEditing()}>
        <DialogContent className="flex max-h-[90dvh] w-full max-w-xl flex-col gap-0 overflow-hidden border-muted-teal/30 bg-light-cream p-0 sm:max-w-xl">
          <DialogHeader className="shrink-0 space-y-1 border-b border-muted-teal/30 px-6 py-4 text-left">
            <DialogTitle className="text-xl font-semibold text-dark-teal">
              {editing?.id ? "Edit position" : "Create position"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {editing?.id
                ? "Edit committee position details"
                : "Create a new committee position"}
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <form
                  id="committee-position-form"
                  onSubmit={savePosition}
                  className="space-y-5"
                >
                  <Field label="Position title">
                    <input
                      value={editing.title}
                      required
                      onChange={(event) =>
                        updateField("title", event.target.value)
                      }
                      className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                    />
                  </Field>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm font-medium text-dark-teal">
                      <input
                        type="checkbox"
                        checked={editing.published}
                        onChange={(event) =>
                          updateField("published", event.target.checked)
                        }
                        className="h-4 w-4 rounded border-muted-teal text-dark-teal"
                      />
                      Show this filled position publicly
                    </label>
                    <label className="flex items-center gap-3 text-sm font-medium text-dark-teal">
                      <input
                        type="checkbox"
                        checked={editing.is_acting}
                        onChange={(event) =>
                          updateField("is_acting", event.target.checked)
                        }
                        className="h-4 w-4 rounded border-muted-teal text-dark-teal"
                      />
                      Mark as Acting
                    </label>
                  </div>

                  <Field label="Fill position">
                    <div className="grid gap-2">
                      <select
                        value={editing.memberMode}
                        onChange={(event) =>
                          updateField(
                            "memberMode",
                            event.target.value as PositionForm["memberMode"]
                          )
                        }
                        className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                      >
                        <option value="existing">Use existing member</option>
                        <option value="new">Create new member</option>
                      </select>

                      {editing.memberMode === "existing" ? (
                        <div className="grid gap-3">
                          <select
                            value={editing.member_id}
                            onChange={(event) =>
                              updateExistingMember(event.target.value)
                            }
                            className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                          >
                            <option value="">Unfilled</option>
                            {members.map((member) => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                          </select>
                          {editing.member_id && (
                            <CroppedImageUploader
                              value={editing.existingMemberPhotoUrl}
                              onChange={(value) =>
                                updateField("existingMemberPhotoUrl", value)
                              }
                              onUpload={uploadExistingMemberPhoto}
                              aspect={COMMITTEE_PHOTO_PRESET.aspect}
                              targetWidth={COMMITTEE_PHOTO_PRESET.targetWidth}
                              maxSizeMB={COMMITTEE_PHOTO_PRESET.maxSizeMB}
                              previewAlt="Committee member photo preview"
                              helpText="Phone photos welcome, including HEIC. Large files are compressed automatically; crop preview exports as a square WebP around 800px wide."
                            />
                          )}
                        </div>
                      ) : (
                        <div className="grid gap-3 rounded-md border border-muted-teal/20 bg-light-teal/50 p-3">
                          <input
                            placeholder="Name"
                            value={editing.newMemberName}
                            onChange={(event) =>
                              updateField("newMemberName", event.target.value)
                            }
                            className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                          />
                          <CroppedImageUploader
                            value={editing.newMemberPhotoUrl}
                            onChange={(value) =>
                              updateField("newMemberPhotoUrl", value)
                            }
                            onUpload={uploadNewMemberPhoto}
                            aspect={COMMITTEE_PHOTO_PRESET.aspect}
                            targetWidth={COMMITTEE_PHOTO_PRESET.targetWidth}
                            maxSizeMB={COMMITTEE_PHOTO_PRESET.maxSizeMB}
                            previewAlt="Committee member photo preview"
                            helpText="Phone photos welcome, including HEIC. Large files are compressed automatically; crop preview exports as a square WebP around 800px wide."
                          />
                          <textarea
                            placeholder="Bio"
                            rows={3}
                            value={editing.newMemberBio}
                            onChange={(event) =>
                              updateField("newMemberBio", event.target.value)
                            }
                            className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                          />
                          <input
                            placeholder="Email alias"
                            value={editing.newMemberEmailAlias}
                            onChange={(event) =>
                              updateField(
                                "newMemberEmailAlias",
                                event.target.value
                              )
                            }
                            className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
                          />
                        </div>
                      )}
                    </div>
                  </Field>

                  {error && <p className="text-sm text-deep-red">{error}</p>}
                  {status && <p className="text-sm text-muted-teal">{status}</p>}
                </form>
              </div>

              <div className="flex shrink-0 gap-2 border-t border-muted-teal/30 px-6 py-4">
                <button
                  type="submit"
                  form="committee-position-form"
                  className="rounded-md bg-dark-teal px-4 py-2 text-sm font-semibold text-light-cream hover:bg-muted-teal"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeEditing}
                  className="rounded-md border border-muted-teal px-4 py-2 text-sm font-semibold text-dark-teal hover:bg-light-teal"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-dark-teal">{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}
