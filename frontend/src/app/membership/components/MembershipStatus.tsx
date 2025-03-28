import { UseFormRegister } from "react-hook-form";
import { z } from "zod";
import LoadingSpinner from "./LoadingSpinner";
import { MembershipFormData } from "../page";

export const membershipStatusSchema = z.enum(["new", "renewal"]);

export type MembershipStatusData = z.infer<typeof membershipStatusSchema>;

interface MembershipStatusProps {
  register: UseFormRegister<MembershipFormData>;
  isLoading?: boolean;
}

export default function MembershipStatus({
  register,
  isLoading = false,
}: MembershipStatusProps) {
  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-teal mb-4">
        Membership Status
      </h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="radio"
            id="renewal"
            value="renewal"
            {...register("membershipStatus")}
            className="text-dark-teal focus:ring-dark-teal"
          />
          <label
            htmlFor="renewal"
            className="text-sm font-medium text-dark-teal"
          >
            Renewing Member
          </label>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="radio"
            id="new"
            value="new"
            {...register("membershipStatus")}
            className="text-dark-teal focus:ring-dark-teal"
          />
          <label htmlFor="new" className="text-sm font-medium text-dark-teal">
            New Member
          </label>
        </div>
      </div>
    </section>
  );
}
