"use client"; // Keep client-side rendering for form interactions

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from 'next/dynamic';
import { api } from "../utils/api";
import { X } from "lucide-react";
import type { MembershipFormData } from "../utils/types";

// Re-added dynamic import for Payment
const Payment = dynamic(() => import('./Payment'), {
  ssr: false,
  loading: () => <div className="p-6 text-center text-dark-teal">Loading payment section...</div>,
});

// Validation schema
const membershipFormSchema: z.ZodType<MembershipFormData> = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    surname: z.string().min(1, "Surname is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().optional(),
  }),
  membershipStatus: z.enum(["new", "renewal"]),
  membershipType: z.enum(["FAMILY", "SINGLE_ADULT", "JUNIORS", "SOCIAL"]),
  familyDetails: z.object({
    spouse: z.object({
      name: z.string(),
      gender: z.string(),
      playingLevel: z.enum(["A_GRADE", "B_GRADE", "SOCIAL", "BEGINNER"]),
    }).optional(),
    children: z.array(z.object({
      name: z.string(),
      gender: z.string(),
      dateOfBirth: z.string(),
      playingLevel: z.enum(["A_GRADE", "B_GRADE", "SOCIAL", "BEGINNER", "JUNIOR"]),
    })).optional(),
  }).optional(),
  endorsements: z.object({
    firstEndorser: z.object({
      name: z.string().min(1, "Endorser name is required"),
      contact: z.string().min(1, "Endorser contact is required"),
    }),
    secondEndorser: z.object({
      name: z.string().min(1, "Endorser name is required"),
      contact: z.string().min(1, "Endorser contact is required"),
    }),
  }).optional(),
  clubInvolvement: z.object({
    interestedInClubOfficer: z.boolean(),
    skills: z.string().optional(),
  }),
  declaration: z.boolean(),
}).refine(data => {
  if (data.membershipStatus === "new" && !data.endorsements) {
    return false;
  }
  return true;
}, {
  message: "New members must provide endorsements",
  path: ["endorsements"],
});

// Constants (moved from page.tsx)
const MEMBERSHIP_TYPES = {
  FAMILY: {
    title: "FAMILY",
    description:
      "Family including children <=18 years and 21 years if in full time study",
    price: "K 600.00",
  },
  SINGLE_ADULT: {
    title: "SINGLE ADULT",
    description: "Adults over >=19 years",
    price: "K 360.00",
  },
  JUNIORS: {
    title: "JUNIORS",
    description: "<= 18 years and 21 years if in full time study",
    price: "K 70.00",
  },
  SOCIAL: {
    title: "SOCIAL",
    description: "All Member benefits but Non Member court fee applies",
    price: "K 180.00",
  },
};

interface MembershipFormModalProps {
  onClose: () => void;
}

const MembershipFormModal: React.FC<MembershipFormModalProps> = ({
  onClose,
}) => {
  const [childrenCount, setChildrenCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      membershipStatus: undefined, // Explicitly set radio buttons to undefined initially
      membershipType: undefined, // Explicitly set radio buttons to undefined initially
      familyDetails: {
        children: [],
      },
    },
  });

  const membershipStatus = watch("membershipStatus");
  const membershipType = watch("membershipType");

  const onSubmit = async (data: MembershipFormData) => {
    setIsLoading(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await api.submitMembershipForm(data);
      
      if (response.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Membership application submitted successfully! You will receive a confirmation email shortly.'
        });
        
        // Close the modal after 2 seconds on success
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(response.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit application. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to remove a child - Placeholder, needs implementation if desired
  // const removeChild = (index: number) => {
  //   // Logic to remove child data from form state
  //   setChildrenCount(prev => prev - 1);
  //   // You'll also need to update the form data using setValue or similar
  // };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-dark-teal">Membership Application</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {submitStatus.type && (
          <div
            className={`mb-4 p-4 rounded ${
              submitStatus.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <section className="bg-white p-6 rounded-lg shadow-inner border border-gray-200">
            <h2 className="text-xl font-semibold text-dark-teal mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium text-dark-teal">
                  First Name <span className="text-deep-red">*</span>
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
                  Surname <span className="text-deep-red">*</span>
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
                  Phone <span className="text-deep-red">*</span>
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
                  Email <span className="text-deep-red">*</span>
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
                  Address (Optional)
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

          {/* Membership Status Section */}
          <section className="bg-white p-6 rounded-lg shadow-inner border border-gray-200">
            <h2 className="text-xl font-semibold text-dark-teal mb-4">
              Membership Status <span className="text-deep-red">*</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="modal-renewal"
                  value="renewal"
                  {...register("membershipStatus")}
                  className="text-dark-teal focus:ring-dark-teal"
                />
                <label
                  htmlFor="modal-renewal"
                  className="text-sm font-medium text-dark-teal"
                >
                  Renewing Member
                </label>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="modal-new"
                  value="new"
                  {...register("membershipStatus")}
                  className="text-dark-teal focus:ring-dark-teal"
                />
                <label
                  htmlFor="modal-new"
                  className="text-sm font-medium text-dark-teal"
                >
                  New Member
                </label>
              </div>
            </div>
            {/* Display top-level error for the radio group */}
            {errors.membershipStatus && !membershipStatus && (
              <p className="mt-2 text-deep-red text-sm">
                Please select membership status.
              </p>
            )}
          </section>

          {/* Endorsement Section (for new members) */}
          {membershipStatus === "new" && (
            <section className="bg-white p-6 rounded-lg shadow-inner border border-gray-200">
              <h2 className="text-xl font-semibold text-dark-teal mb-4">
                Endorsement <span className="text-deep-red">*</span>
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                As a new member, please provide details of two existing
                members who endorse your application.
              </p>

              <div className="space-y-6">
                {/* First Endorser */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-teal">
                      First Endorser Name{" "}
                      <span className="text-deep-red">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("endorsements.firstEndorser.name")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
                    />
                    {errors.endorsements?.firstEndorser?.name && (
                      <p className="mt-1 text-deep-red text-sm">
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
                    />
                    {errors.endorsements?.firstEndorser?.contact && (
                      <p className="mt-1 text-deep-red text-sm">
                        {errors.endorsements.firstEndorser.contact.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Second Endorser */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-teal">
                      Second Endorser Name{" "}
                      <span className="text-deep-red">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("endorsements.secondEndorser.name")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
                    />
                    {errors.endorsements?.secondEndorser?.name && (
                      <p className="mt-1 text-deep-red text-sm">
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
                    />
                    {errors.endorsements?.secondEndorser?.contact && (
                      <p className="mt-1 text-deep-red text-sm">
                        {errors.endorsements.secondEndorser.contact.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Membership Type Section */}
          <section className="bg-white p-6 rounded-lg shadow-inner border border-gray-200">
            <h2 className="text-xl font-semibold text-dark-teal mb-4">
              Membership Type <span className="text-deep-red">*</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(MEMBERSHIP_TYPES).map(([key, value]) => (
                <div key={key} className="relative">
                  <input
                    type="radio"
                    id={`modal-${key}`}
                    value={key}
                    {...register("membershipType")}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`modal-${key}`}
                    className="flex flex-col p-4 bg-light-teal cursor-pointer rounded-lg transition-all duration-300 hover:bg-muted-teal/20 peer-checked:bg-muted-teal peer-checked:border-2 peer-checked:border-dark-teal h-full"
                  >
                    <span className="text-lg font-semibold text-dark-teal">
                      {value.title}
                    </span>
                    <span className="text-sm text-gray-600 mt-1 flex-grow">
                      {value.description}
                    </span>
                    <span className="text-lg font-bold text-dark-teal mt-2">
                      {value.price}
                    </span>
                  </label>
                </div>
              ))}
            </div>
            {/* Display top-level error for the radio group */}
            {errors.membershipType && !membershipType && (
              <p className="mt-2 text-deep-red text-sm">
                Please select a membership type.
              </p>
            )}
          </section>

          {/* Family Details Section (if FAMILY type selected) */}
          {membershipType === "FAMILY" && (
            <section className="bg-white p-6 rounded-lg shadow-inner border border-gray-200">
              <h2 className="text-xl font-semibold text-dark-teal mb-4">
                Family Details
              </h2>

              {/* Spouse Details */}
              <div className="mb-8 border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-muted-teal mb-4">
                  Spouse Details (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-dark-teal">
                      Name
                    </label>
                    <input
                      type="text"
                      {...register("familyDetails.spouse.name")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
                    />
                    {/* Optional: Add error display if spouse details become mandatory */}
                    {/* {errors.familyDetails?.spouse?.name && (...)} */}
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-dark-teal mb-2">
                      Gender
                    </label>
                    <div className="flex gap-4 mt-1">
                      {/* Gender Radios */}
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="modal-spouse-male"
                          value="male"
                          {...register("familyDetails.spouse.gender")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="modal-spouse-male"
                          className="px-3 py-2 bg-light-teal text-dark-teal rounded-md cursor-pointer text-sm transition-all duration-300 hover:bg-muted-teal/20 peer-checked:bg-muted-teal peer-checked:border-2 peer-checked:border-dark-teal"
                        >
                          Male
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="modal-spouse-female"
                          value="female"
                          {...register("familyDetails.spouse.gender")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="modal-spouse-female"
                          className="px-3 py-2 bg-light-teal text-dark-teal rounded-md cursor-pointer text-sm transition-all duration-300 hover:bg-muted-teal/20 peer-checked:bg-muted-teal peer-checked:border-2 peer-checked:border-dark-teal"
                        >
                          Female
                        </label>
                      </div>
                    </div>
                    {/* {errors.familyDetails?.spouse?.gender && (...)} */}
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-dark-teal">
                      Playing Level
                    </label>
                    <select
                      {...register("familyDetails.spouse.playingLevel")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2 text-sm"
                    >
                      <option value="">Select level</option>
                      <option value="A_GRADE">A Grade</option>
                      <option value="B_GRADE">B Grade</option>
                      <option value="SOCIAL">Social</option>
                      <option value="BEGINNER">Beginner</option>
                    </select>
                    {/* {errors.familyDetails?.spouse?.playingLevel && (...)} */}
                  </div>
                </div>
              </div>

              {/* Children Details */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-muted-teal">
                    Children (Optional)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setChildrenCount((prev) => prev + 1)}
                    className="px-3 py-1 bg-dark-teal text-white rounded-md hover:bg-muted-teal text-sm"
                  >
                    Add Child
                  </button>
                </div>

                {childrenCount > 0 && (
                  <div className="space-y-4">
                    {Array.from({ length: childrenCount }).map((_, index) => (
                      <div
                        key={index}
                        className="p-4 bg-light-teal rounded-lg border border-muted-teal/50"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-md font-semibold text-dark-teal">
                            Child {index + 1}
                          </h4>
                          {/* Optional: Add remove button */}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Child Fields */}
                          <div>
                            <label className="block text-xs font-medium text-dark-teal">
                              Name <span className="text-deep-red">*</span>
                            </label>
                            <input
                              type="text"
                              {...register(
                                `familyDetails.children.${index}.name`
                              )}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2 text-sm"
                            />
                            {errors.familyDetails?.children?.[index]
                              ?.name && (
                              <p className="mt-1 text-deep-red text-xs">
                                {
                                  errors.familyDetails.children[index].name
                                    .message
                                }
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-dark-teal mb-2">
                              Gender <span className="text-deep-red">*</span>
                            </label>
                            <div className="flex gap-3 mt-1">
                              {/* Child Gender Radios */}
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id={`modal-child-male-${index}`}
                                  value="male"
                                  {...register(
                                    `familyDetails.children.${index}.gender`
                                  )}
                                  className="hidden peer"
                                />
                                <label
                                  htmlFor={`modal-child-male-${index}`}
                                  className="px-3 py-2 bg-white text-dark-teal rounded-md cursor-pointer text-xs transition-all duration-300 hover:bg-muted-teal/20 peer-checked:bg-muted-teal peer-checked:border-2 peer-checked:border-dark-teal"
                                >
                                  Male
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id={`modal-child-female-${index}`}
                                  value="female"
                                  {...register(
                                    `familyDetails.children.${index}.gender`
                                  )}
                                  className="hidden peer"
                                />
                                <label
                                  htmlFor={`modal-child-female-${index}`}
                                  className="px-3 py-2 bg-white text-dark-teal rounded-md cursor-pointer text-xs transition-all duration-300 hover:bg-muted-teal/20 peer-checked:bg-muted-teal peer-checked:border-2 peer-checked:border-dark-teal"
                                >
                                  Female
                                </label>
                              </div>
                            </div>
                            {errors.familyDetails?.children?.[index]
                              ?.gender && (
                              <p className="mt-1 text-deep-red text-xs">
                                {
                                  errors.familyDetails.children[index].gender
                                    .message
                                }
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-dark-teal">
                              Date of Birth{" "}
                              <span className="text-deep-red">*</span>
                            </label>
                            <input
                              type="date"
                              {...register(
                                `familyDetails.children.${index}.dateOfBirth`
                              )}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2 text-sm"
                            />
                            {errors.familyDetails?.children?.[index]
                              ?.dateOfBirth && (
                              <p className="mt-1 text-deep-red text-xs">
                                {
                                  errors.familyDetails.children[index]
                                    .dateOfBirth.message
                                }
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-dark-teal">
                              Playing Level{" "}
                              <span className="text-deep-red">*</span>
                            </label>
                            <select
                              {...register(
                                `familyDetails.children.${index}.playingLevel`
                              )}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2 text-sm"
                            >
                              <option value="">Select level</option>
                              <option value="A_GRADE">A Grade</option>
                              <option value="B_GRADE">B Grade</option>
                              <option value="SOCIAL">Social</option>
                              <option value="BEGINNER">Beginner</option>
                              <option value="JUNIOR">Junior</option>
                            </select>
                            {errors.familyDetails?.children?.[index]
                              ?.playingLevel && (
                              <p className="mt-1 text-deep-red text-xs">
                                {
                                  errors.familyDetails.children[index]
                                    .playingLevel.message
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
            </section>
          )}

          {/* Club Involvement Section */}
          <section className="bg-white p-6 rounded-lg shadow-inner border border-gray-200">
            <h2 className="text-xl font-semibold text-dark-teal mb-4">
              Club Involvement
            </h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="modal-clubOfficer"
                  {...register("clubInvolvement.interestedInClubOfficer")}
                  className="h-4 w-4 text-dark-teal rounded border-gray-300 focus:ring-dark-teal"
                />
                <label
                  htmlFor="modal-clubOfficer"
                  className="text-sm font-medium text-dark-teal"
                >
                  Would you be interested in being a club officer?
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-teal mb-2">
                  What skills do you have that could help develop the club?
                  (Optional)
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  (e.g. web design, accounting, printing, planning,
                  sponsorship, etc.)
                </p>
                <textarea
                  {...register("clubInvolvement.skills")}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
                  placeholder="Enter your skills here..."
                />
              </div>
            </div>
          </section>

          {/* Declaration Section */}
          <section className="bg-white p-6 rounded-lg shadow-inner border border-gray-200">
            <h2 className="text-xl font-semibold text-dark-teal mb-4">
              Declaration <span className="text-deep-red">*</span>
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                I promise to abide by the constitution, rules and by-laws of
                POMRC and will accept the committee&apos;s decision regarding
                any matters for the efficient running of the Club. I consider
                myself (and family members if applicable) to be physically fit
                and capable of full participation and agree to notify the club
                of any changes to physical condition. I indemnify The Port
                Moresby Racquets Club against personal accidents or injury of
                myself or my family members.
              </p>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="modal-declaration"
                  {...register("declaration")}
                  className="mt-1 h-4 w-4 text-dark-teal rounded border-gray-300 focus:ring-dark-teal"
                />
                <label
                  htmlFor="modal-declaration"
                  className="text-sm font-medium text-dark-teal"
                >
                  I agree to the above declaration{" "}
                  <span className="text-deep-red">*</span>
                </label>
              </div>
              {errors.declaration && (
                <p className="text-deep-red text-sm mt-1">
                  {errors.declaration.message}
                </p>
              )}
            </div>
          </section>

          {/* Payment Section Re-added */}
          <section className="bg-white p-6 rounded-lg shadow-inner border border-gray-200">
              <h2 className="text-xl font-semibold text-dark-teal mb-4">
                  Payment Information
              </h2>
               <Payment isLoading={isLoading} />
          </section>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dark-teal text-white rounded hover:bg-opacity-90 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⌛</span>
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipFormModal;
