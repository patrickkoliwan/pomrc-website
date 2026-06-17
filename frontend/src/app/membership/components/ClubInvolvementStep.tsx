import { UseFormRegister } from "react-hook-form";
import { INPUT_CLASS } from "../constants";
import type { MembershipFormData } from "../utils/types";

interface ClubInvolvementStepProps {
  register: UseFormRegister<MembershipFormData>;
}

export default function ClubInvolvementStep({
  register,
}: ClubInvolvementStepProps) {
  return (
    <div className="space-y-6">
      <label className="flex min-h-[44px] cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          id="club-officer"
          {...register("clubInvolvement.interestedInClubOfficer")}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-dark-teal focus:ring-dark-teal"
        />
        <span className="text-sm font-medium text-dark-teal">
          Would you be interested in being a club officer?
        </span>
      </label>

      <div>
        <label className="mb-2 block text-sm font-medium text-dark-teal">
          What skills do you have that could help develop the club? (Optional)
        </label>
        <p className="mb-2 text-xs text-gray-600">
          e.g. web design, accounting, printing, planning, sponsorship, etc.
        </p>
        <textarea
          {...register("clubInvolvement.skills")}
          rows={4}
          className={INPUT_CLASS}
          placeholder="Enter your skills here..."
        />
      </div>
    </div>
  );
}
