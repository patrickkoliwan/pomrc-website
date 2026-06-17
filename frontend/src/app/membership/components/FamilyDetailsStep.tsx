"use client";

import { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { INPUT_CLASS } from "../constants";
import type { MembershipFormData } from "../utils/types";

interface FamilyDetailsStepProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
}

export default function FamilyDetailsStep({
  register,
  errors,
}: FamilyDetailsStepProps) {
  const [childrenCount, setChildrenCount] = useState(0);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <h3 className="mb-4 text-lg font-semibold text-muted-teal">
          Spouse Details (Optional)
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-dark-teal">
              Name
            </label>
            <input
              type="text"
              {...register("familyDetails.spouse.name")}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark-teal">
              Gender
            </label>
            <div className="mt-1 flex gap-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="spouse-male"
                  value="male"
                  {...register("familyDetails.spouse.gender")}
                  className="peer hidden"
                />
                <label
                  htmlFor="spouse-male"
                  className="cursor-pointer rounded-md bg-light-teal px-3 py-2 text-sm text-dark-teal transition-all duration-300 hover:bg-muted-teal/20 peer-checked:border-2 peer-checked:border-dark-teal peer-checked:bg-muted-teal"
                >
                  Male
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="spouse-female"
                  value="female"
                  {...register("familyDetails.spouse.gender")}
                  className="peer hidden"
                />
                <label
                  htmlFor="spouse-female"
                  className="cursor-pointer rounded-md bg-light-teal px-3 py-2 text-sm text-dark-teal transition-all duration-300 hover:bg-muted-teal/20 peer-checked:border-2 peer-checked:border-dark-teal peer-checked:bg-muted-teal"
                >
                  Female
                </label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-teal">
              Playing Level
            </label>
            <select
              {...register("familyDetails.spouse.playingLevel")}
              className={INPUT_CLASS}
            >
              <option value="">Select level</option>
              <option value="A_GRADE">A Grade</option>
              <option value="B_GRADE">B Grade</option>
              <option value="SOCIAL">Social</option>
              <option value="BEGINNER">Beginner</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-muted-teal">
            Children (Optional)
          </h3>
          <button
            type="button"
            onClick={() => setChildrenCount((prev) => prev + 1)}
            className="rounded-md bg-dark-teal px-3 py-2 text-sm text-white hover:bg-muted-teal"
          >
            Add Child
          </button>
        </div>

        {childrenCount > 0 && (
          <div className="space-y-4">
            {Array.from({ length: childrenCount }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-muted-teal/50 bg-light-teal p-4"
              >
                <h4 className="mb-3 text-base font-semibold text-dark-teal">
                  Child {index + 1}
                </h4>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-dark-teal">
                      Name <span className="text-deep-red">*</span>
                    </label>
                    <input
                      type="text"
                      {...register(`familyDetails.children.${index}.name`)}
                      className={INPUT_CLASS}
                    />
                    {errors.familyDetails?.children?.[index]?.name && (
                      <p className="mt-1 text-xs text-deep-red">
                        {errors.familyDetails.children[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-dark-teal">
                      Gender <span className="text-deep-red">*</span>
                    </label>
                    <div className="flex gap-3">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`child-male-${index}`}
                          value="male"
                          {...register(
                            `familyDetails.children.${index}.gender`
                          )}
                          className="peer hidden"
                        />
                        <label
                          htmlFor={`child-male-${index}`}
                          className="cursor-pointer rounded-md bg-white px-3 py-2 text-xs text-dark-teal transition-all duration-300 hover:bg-muted-teal/20 peer-checked:border-2 peer-checked:border-dark-teal peer-checked:bg-muted-teal"
                        >
                          Male
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`child-female-${index}`}
                          value="female"
                          {...register(
                            `familyDetails.children.${index}.gender`
                          )}
                          className="peer hidden"
                        />
                        <label
                          htmlFor={`child-female-${index}`}
                          className="cursor-pointer rounded-md bg-white px-3 py-2 text-xs text-dark-teal transition-all duration-300 hover:bg-muted-teal/20 peer-checked:border-2 peer-checked:border-dark-teal peer-checked:bg-muted-teal"
                        >
                          Female
                        </label>
                      </div>
                    </div>
                    {errors.familyDetails?.children?.[index]?.gender && (
                      <p className="mt-1 text-xs text-deep-red">
                        {errors.familyDetails.children[index]?.gender?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dark-teal">
                      Date of Birth <span className="text-deep-red">*</span>
                    </label>
                    <input
                      type="date"
                      {...register(
                        `familyDetails.children.${index}.dateOfBirth`
                      )}
                      className={INPUT_CLASS}
                    />
                    {errors.familyDetails?.children?.[index]?.dateOfBirth && (
                      <p className="mt-1 text-xs text-deep-red">
                        {
                          errors.familyDetails.children[index]?.dateOfBirth
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dark-teal">
                      Playing Level <span className="text-deep-red">*</span>
                    </label>
                    <select
                      {...register(
                        `familyDetails.children.${index}.playingLevel`
                      )}
                      className={INPUT_CLASS}
                    >
                      <option value="">Select level</option>
                      <option value="A_GRADE">A Grade</option>
                      <option value="B_GRADE">B Grade</option>
                      <option value="SOCIAL">Social</option>
                      <option value="BEGINNER">Beginner</option>
                      <option value="JUNIOR">Junior</option>
                    </select>
                    {errors.familyDetails?.children?.[index]?.playingLevel && (
                      <p className="mt-1 text-xs text-deep-red">
                        {
                          errors.familyDetails.children[index]?.playingLevel
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
