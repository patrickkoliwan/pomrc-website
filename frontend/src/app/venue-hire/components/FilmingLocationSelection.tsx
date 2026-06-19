import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { hireVenues } from "@/data/hireVenues";
import { premisesAreas } from "@/data/premisesAreas";
import { FilmingPublicityFormData } from "../utils/filmingPublicitySchema";

interface FilmingLocationSelectionProps {
  register: UseFormRegister<FilmingPublicityFormData>;
  errors: FieldErrors<FilmingPublicityFormData>;
  watch: UseFormWatch<FilmingPublicityFormData>;
}

const locationOptions = [
  ...hireVenues.map((v) => ({
    id: v.id as "events-lawn" | "squash-courtyard",
    label: v.title,
    description: v.description,
  })),
  {
    id: "other-area" as const,
    label: "Other specific area of premises",
    description: "Select a specific area from the club grounds",
  },
];

export default function FilmingLocationSelection({
  register,
  errors,
  watch,
}: FilmingLocationSelectionProps) {
  const locationType = watch("locationSelection.locationType");
  const specificArea = watch("locationSelection.specificArea");

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-teal mb-4">
        Area Requested
      </h2>
      <p className="text-sm text-muted-teal mb-4">
        Indicate the exact area of POMRC requested for filming, photography, or
        publicity.
      </p>

      <div className="space-y-3">
        {locationOptions.map((option) => (
          <label key={option.id} className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              {...register("locationSelection.locationType")}
              value={option.id}
              className="mt-1 text-dark-teal focus:ring-dark-teal"
            />
            <div>
              <span className="font-medium text-dark-teal">{option.label}</span>
              <p className="text-sm text-muted-teal">{option.description}</p>
            </div>
          </label>
        ))}
      </div>
      {errors.locationSelection?.locationType && (
        <p className="mt-2 text-deep-red text-sm">
          {errors.locationSelection.locationType.message}
        </p>
      )}

      {locationType === "other-area" && (
        <div className="mt-4 space-y-4 pl-1">
          <div>
            <label className="block text-sm font-medium text-dark-teal">
              Select Specific Area
            </label>
            <select
              {...register("locationSelection.specificArea")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2 bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Choose an area...
              </option>
              {premisesAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.label}
                </option>
              ))}
            </select>
            {errors.locationSelection?.specificArea && (
              <p className="mt-1 text-deep-red text-sm">
                {errors.locationSelection.specificArea.message}
              </p>
            )}
          </div>

          {specificArea === "other" && (
            <div>
              <label className="block text-sm font-medium text-dark-teal">
                Please Specify Area
              </label>
              <input
                type="text"
                {...register("locationSelection.specificAreaOther")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
              />
              {errors.locationSelection?.specificAreaOther && (
                <p className="mt-1 text-deep-red text-sm">
                  {errors.locationSelection.specificAreaOther.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
