import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FilmingPublicityFormData } from "../utils/filmingPublicitySchema";

interface ProductionDetailsProps {
  register: UseFormRegister<FilmingPublicityFormData>;
  errors: FieldErrors<FilmingPublicityFormData>;
}

export default function ProductionDetails({
  register,
  errors,
}: ProductionDetailsProps) {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-dark-teal mb-4">
        Production Details
      </h2>

      <div>
        <label className="block text-sm font-medium text-dark-teal">
          What is the purpose of the production?
        </label>
        <textarea
          {...register("productionPurpose")}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
        />
        {errors.productionPurpose && (
          <p className="mt-1 text-deep-red text-sm">
            {errors.productionPurpose.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark-teal">
            Date of Activity
          </label>
          <input
            type="date"
            {...register("activityDate")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
          />
          {errors.activityDate && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.activityDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-teal">
            Start Time
          </label>
          <input
            type="time"
            {...register("activityStartTime")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
          />
          {errors.activityStartTime && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.activityStartTime.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-teal">
            End Time
          </label>
          <input
            type="time"
            {...register("activityEndTime")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
          />
          {errors.activityEndTime && (
            <p className="mt-1 text-deep-red text-sm">
              {errors.activityEndTime.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-dark-teal mb-2">
          Application Fee Duration
        </span>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              {...register("durationType")}
              value="half-day"
              className="text-dark-teal focus:ring-dark-teal"
            />
            <span className="text-dark-teal">Half Day — K500</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              {...register("durationType")}
              value="full-day"
              className="text-dark-teal focus:ring-dark-teal"
            />
            <span className="text-dark-teal">Full Day — K1,000</span>
          </label>
        </div>
        {errors.durationType && (
          <p className="mt-1 text-deep-red text-sm">
            {errors.durationType.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-teal">
          Contact Person / Organization
        </label>
        <input
          type="text"
          {...register("organization")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
        />
        {errors.organization && (
          <p className="mt-1 text-deep-red text-sm">
            {errors.organization.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-teal">
          Contact Person & Full Details
        </label>
        <textarea
          {...register("contactDetails")}
          rows={3}
          placeholder="Include contact name, address, phone, and any other relevant details"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
        />
        {errors.contactDetails && (
          <p className="mt-1 text-deep-red text-sm">
            {errors.contactDetails.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-teal">
          POMRC Member Involved (if relevant)
        </label>
        <input
          type="text"
          {...register("pomrcMemberInvolved")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
        />
      </div>
    </section>
  );
}
