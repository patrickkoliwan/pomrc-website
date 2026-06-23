"use client";

import {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import LoadingSpinner from "./LoadingSpinner";
import { INPUT_CLASS } from "../constants";
import type { MembershipFormData } from "../utils/types";
import { useMembershipPricing } from "./MembershipPricingProvider";
import { membershipTierIds } from "@/lib/membership/pricing-types";

interface MembershipStatusStepProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
  watch: UseFormWatch<MembershipFormData>;
  stepErrors?: Record<string, string>;
  isLoading?: boolean;
}

export default function MembershipStatusStep({
  register,
  errors,
  watch,
  stepErrors = {},
  isLoading = false,
}: MembershipStatusStepProps) {
  const { getTierContent } = useMembershipPricing();

  if (isLoading) return <LoadingSpinner />;

  const membershipStatus = watch("membershipStatus");
  const membershipType = watch("membershipType");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-dark-teal">
          Membership Status <span className="text-deep-red">*</span>
        </h3>
        <div className="space-y-3">
          <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-muted-teal/30 bg-light-teal px-4 py-3">
            <input
              type="radio"
              value="renewal"
              {...register("membershipStatus")}
              className="text-dark-teal focus:ring-dark-teal"
            />
            <span className="text-sm font-medium text-dark-teal">
              Renewing Member
            </span>
          </label>
          <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-muted-teal/30 bg-light-teal px-4 py-3">
            <input
              type="radio"
              value="new"
              {...register("membershipStatus")}
              className="text-dark-teal focus:ring-dark-teal"
            />
            <span className="text-sm font-medium text-dark-teal">
              New Member
            </span>
          </label>
        </div>
        {(errors.membershipStatus || stepErrors.membershipStatus) && (
          <p className="mt-2 text-sm text-deep-red">
            {errors.membershipStatus?.message ||
              stepErrors.membershipStatus ||
              "Please select membership status."}
          </p>
        )}
      </div>

      {membershipStatus === "new" && (
        <div>
          <h3 className="mb-2 text-lg font-semibold text-dark-teal">
            Endorsement <span className="text-deep-red">*</span>
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            As a new member, please provide details of two existing members who
            endorse your application.
          </p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-dark-teal">
                  First Endorser Name{" "}
                  <span className="text-deep-red">*</span>
                </label>
                <input
                  type="text"
                  {...register("endorsements.firstEndorser.name")}
                  className={INPUT_CLASS}
                />
                {errors.endorsements?.firstEndorser?.name && (
                  <p className="mt-1 text-sm text-deep-red">
                    {errors.endorsements.firstEndorser.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-teal">
                  First Endorser Contact{" "}
                  <span className="text-deep-red">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Phone or Email"
                  {...register("endorsements.firstEndorser.contact")}
                  className={INPUT_CLASS}
                />
                {errors.endorsements?.firstEndorser?.contact && (
                  <p className="mt-1 text-sm text-deep-red">
                    {errors.endorsements.firstEndorser.contact.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-dark-teal">
                  Second Endorser Name{" "}
                  <span className="text-deep-red">*</span>
                </label>
                <input
                  type="text"
                  {...register("endorsements.secondEndorser.name")}
                  className={INPUT_CLASS}
                />
                {errors.endorsements?.secondEndorser?.name && (
                  <p className="mt-1 text-sm text-deep-red">
                    {errors.endorsements.secondEndorser.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-teal">
                  Second Endorser Contact{" "}
                  <span className="text-deep-red">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Phone or Email"
                  {...register("endorsements.secondEndorser.contact")}
                  className={INPUT_CLASS}
                />
                {errors.endorsements?.secondEndorser?.contact && (
                  <p className="mt-1 text-sm text-deep-red">
                    {errors.endorsements.secondEndorser.contact.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {stepErrors.endorsements && (
            <p className="mt-2 text-sm text-deep-red">
              {stepErrors.endorsements}
            </p>
          )}
        </div>
      )}

      <div>
        <h3 className="mb-4 text-lg font-semibold text-dark-teal">
          Membership Type <span className="text-deep-red">*</span>
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {membershipTierIds.map((key) => {
            const value = getTierContent(key);
            return (
            <div key={key} className="relative">
              <input
                type="radio"
                id={`wizard-${key}`}
                value={key}
                {...register("membershipType")}
                className="peer sr-only"
              />
              <label
                htmlFor={`wizard-${key}`}
                className="flex h-full cursor-pointer flex-col rounded-lg bg-light-teal p-4 transition-all duration-300 hover:bg-muted-teal/20 peer-checked:border-2 peer-checked:border-dark-teal peer-checked:bg-muted-teal"
              >
                <span className="text-lg font-semibold text-dark-teal">
                  {value.title}
                </span>
                <span className="mt-1 flex-grow text-sm text-gray-600">
                  {value.description}
                </span>
                <span className="mt-2 text-lg font-bold text-deep-red">
                  {value.price}
                </span>
                {value.isProrata && (
                  <span className="mt-1 text-xs text-dark-teal/70">
                    {value.period}
                  </span>
                )}
              </label>
            </div>
            );
          })}
        </div>
        {(errors.membershipType || stepErrors.membershipType) &&
          !membershipType && (
            <p className="mt-2 text-sm text-deep-red">
              {errors.membershipType?.message ||
                stepErrors.membershipType ||
                "Please select a membership type."}
            </p>
          )}
      </div>
    </div>
  );
}
