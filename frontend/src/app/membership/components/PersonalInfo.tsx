import { UseFormRegister, FieldErrors } from "react-hook-form";
import { z } from "zod";
import LoadingSpinner from "./LoadingSpinner";
import { MembershipFormData } from "../page";

// Validation schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Surname is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().optional(),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
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
            First Name
          </label>
          <input
            type="text"
            {...register("personalInfo.firstName")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
          />
          {errors.personalInfo?.firstName && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.personalInfo.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-teal">
            Surname
          </label>
          <input
            type="text"
            {...register("personalInfo.surname")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
          />
          {errors.personalInfo?.surname && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.personalInfo.surname.message}
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

        <div>
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-dark-teal">
            Address
          </label>
          <input
            type="text"
            {...register("personalInfo.address")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
          />
          {errors.personalInfo?.address && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.personalInfo.address.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
