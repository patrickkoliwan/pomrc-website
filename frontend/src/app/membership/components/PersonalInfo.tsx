import { FieldErrors, UseFormRegister } from "react-hook-form";
import LoadingSpinner from "./LoadingSpinner";
import { INPUT_CLASS } from "../constants";
import type { MembershipFormData } from "../utils/types";

interface PersonalInfoProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
  isLoading?: boolean;
  compact?: boolean;
}

export default function PersonalInfo({
  register,
  errors,
  isLoading = false,
  compact = false,
}: PersonalInfoProps) {
  if (isLoading) return <LoadingSpinner />;

  const content = (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-dark-teal">
          First Name <span className="text-deep-red">*</span>
        </label>
        <input
          type="text"
          {...register("personalInfo.firstName")}
          className={INPUT_CLASS}
        />
        {errors.personalInfo?.firstName && (
          <p className="mt-1 text-sm text-deep-red">
            {errors.personalInfo.firstName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-teal">
          Surname <span className="text-deep-red">*</span>
        </label>
        <input
          type="text"
          {...register("personalInfo.surname")}
          className={INPUT_CLASS}
        />
        {errors.personalInfo?.surname && (
          <p className="mt-1 text-sm text-deep-red">
            {errors.personalInfo.surname.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-teal">
          Phone <span className="text-deep-red">*</span>
        </label>
        <input
          type="tel"
          {...register("personalInfo.phone")}
          className={INPUT_CLASS}
        />
        {errors.personalInfo?.phone && (
          <p className="mt-1 text-sm text-deep-red">
            {errors.personalInfo.phone.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-teal">
          Email <span className="text-deep-red">*</span>
        </label>
        <input
          type="email"
          {...register("personalInfo.email")}
          className={INPUT_CLASS}
        />
        {errors.personalInfo?.email && (
          <p className="mt-1 text-sm text-deep-red">
            {errors.personalInfo.email.message}
          </p>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-dark-teal">
          Address (Optional)
        </label>
        <input
          type="text"
          {...register("personalInfo.address")}
          className={INPUT_CLASS}
        />
      </div>
    </div>
  );

  if (compact) return content;

  return (
    <section className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-dark-teal">
        Personal Information
      </h2>
      {content}
    </section>
  );
}
