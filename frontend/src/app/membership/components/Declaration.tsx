import { FieldErrors, UseFormRegister } from "react-hook-form";
import LoadingSpinner from "./LoadingSpinner";
import type { MembershipFormData } from "../utils/types";

interface DeclarationProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
  isLoading?: boolean;
  compact?: boolean;
}

export default function Declaration({
  register,
  errors,
  isLoading = false,
  compact = false,
}: DeclarationProps) {
  if (isLoading) return <LoadingSpinner />;

  const content = (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-gray-600">
        I promise to abide by the constitution, rules and by-laws of POMRC and
        will accept the committee&apos;s decision regarding any matters for the
        efficient running of the Club. I consider myself (and family members if
        applicable) to be physically fit and capable of full participation and
        agree to notify the club of any changes to physical condition. I
        indemnify The Port Moresby Racquets Club against personal accidents or
        injury of myself or my family members.
      </p>
      <label className="flex min-h-[44px] cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          id="declaration"
          {...register("declaration")}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-dark-teal focus:ring-dark-teal"
        />
        <span className="text-sm font-medium text-dark-teal">
          I agree to the above declaration{" "}
          <span className="text-deep-red">*</span>
        </span>
      </label>
      {errors.declaration && (
        <p className="text-sm text-deep-red">
          {errors.declaration.message as string}
        </p>
      )}
    </div>
  );

  if (compact) return content;

  return (
    <section className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-dark-teal">
        Declaration
      </h2>
      {content}
    </section>
  );
}
