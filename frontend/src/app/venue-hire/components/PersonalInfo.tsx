import { UseFormRegister, FieldErrors } from "react-hook-form";
import { z } from "zod";
import LoadingSpinner from "./LoadingSpinner";

// Validation schema
export const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isLoading?: boolean;
}

export default function PersonalInfo({
  register,
  errors,
  isLoading = false,
}: PersonalInfoProps) {
  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-teal mb-4">
        Personal Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-dark-teal">
            Name
          </label>
          <input
            type="text"
            {...register("personalInfo.name")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
          />
          {errors.personalInfo?.name && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.personalInfo.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-teal">
            Phone
          </label>
          <input
            type="tel"
            {...register("personalInfo.phone")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
          />
          {errors.personalInfo?.phone && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.personalInfo.phone.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-dark-teal">
            Email
          </label>
          <input
            type="email"
            {...register("personalInfo.email")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
          />
          {errors.personalInfo?.email && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.personalInfo.email.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
