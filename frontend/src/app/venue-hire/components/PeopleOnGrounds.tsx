"use client";

import {
  UseFormRegister,
  FieldErrors,
  useFieldArray,
  Control,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FilmingPublicityFormData } from "../utils/filmingPublicitySchema";

interface PeopleOnGroundsProps {
  register: UseFormRegister<FilmingPublicityFormData>;
  errors: FieldErrors<FilmingPublicityFormData>;
  control: Control<FilmingPublicityFormData>;
}

export default function PeopleOnGrounds({
  register,
  errors,
  control,
}: PeopleOnGroundsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "peopleOnGrounds",
  });

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-teal mb-2">
        Who Will Be on POMRC Grounds
      </h2>
      <p className="text-sm text-muted-teal mb-4">
        List names and positions of everyone who will be on club grounds during
        the activity.
      </p>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-light-teal rounded-lg relative"
          >
            <div>
              <label className="block text-sm font-medium text-dark-teal">
                Name
              </label>
              <input
                type="text"
                {...register(`peopleOnGrounds.${index}.name`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2 bg-white"
              />
              {errors.peopleOnGrounds?.[index]?.name && (
                <p className="mt-1 text-deep-red text-sm">
                  {errors.peopleOnGrounds[index]?.name?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-teal">
                Position
              </label>
              <input
                type="text"
                {...register(`peopleOnGrounds.${index}.position`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2 bg-white"
              />
              {errors.peopleOnGrounds?.[index]?.position && (
                <p className="mt-1 text-deep-red text-sm">
                  {errors.peopleOnGrounds[index]?.position?.message}
                </p>
              )}
            </div>

            {fields.length > 1 && (
              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => remove(index)}
                  className="text-deep-red border-deep-red hover:bg-light-teal"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {errors.peopleOnGrounds?.root && (
        <p className="mt-2 text-deep-red text-sm">
          {errors.peopleOnGrounds.root.message}
        </p>
      )}
      {typeof errors.peopleOnGrounds?.message === "string" && (
        <p className="mt-2 text-deep-red text-sm">
          {errors.peopleOnGrounds.message}
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: "", position: "" })}
        className="mt-4 border-dark-teal text-dark-teal hover:bg-light-teal"
      >
        Add Person
      </Button>
    </section>
  );
}
