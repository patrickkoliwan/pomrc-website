import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FilmingPublicityFormData } from "../utils/filmingPublicitySchema";

interface FilmingApplicantInfoProps {
  register: UseFormRegister<FilmingPublicityFormData>;
  errors: FieldErrors<FilmingPublicityFormData>;
}

export default function FilmingApplicantInfo({
  register,
  errors,
}: FilmingApplicantInfoProps) {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-teal mb-4">
        Applicant Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-dark-teal">
            Applicant Name
          </label>
          <input
            type="text"
            {...register("applicantInfo.name")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
          />
          {errors.applicantInfo?.name && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.applicantInfo.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-teal">
            Phone
          </label>
          <input
            type="tel"
            {...register("applicantInfo.phone")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
          />
          {errors.applicantInfo?.phone && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.applicantInfo.phone.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-dark-teal">
            Email
          </label>
          <input
            type="email"
            {...register("applicantInfo.email")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
          />
          {errors.applicantInfo?.email && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.applicantInfo.email.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
