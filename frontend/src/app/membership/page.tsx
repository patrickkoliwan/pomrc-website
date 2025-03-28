"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic imports
const Payment = dynamic(() => import("./components/Payment"), {
  ssr: false,
  loading: () => <div>Loading payment section...</div>,
});

// Validation schema
const membershipFormSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    surname: z.string().min(1, "Surname is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().optional(),
  }),
  membershipStatus: z.enum(["new", "renewal"]),
  endorsements: z
    .object({
      firstEndorser: z.object({
        name: z.string().min(1, "Endorser name is required"),
        contact: z.string().min(1, "Endorser contact is required"),
      }),
      secondEndorser: z.object({
        name: z.string().min(1, "Endorser name is required"),
        contact: z.string().min(1, "Endorser contact is required"),
      }),
    })
    .optional(),
  membershipType: z.enum(["FAMILY", "SINGLE_ADULT", "JUNIORS", "SOCIAL"]),
  familyDetails: z
    .object({
      spouse: z
        .object({
          name: z.string().min(1, "Spouse name is required"),
          gender: z.string().min(1, "Gender is required"),
          playingLevel: z.enum(["A_GRADE", "B_GRADE", "SOCIAL", "BEGINNER"]),
        })
        .optional(),
      children: z
        .array(
          z.object({
            name: z.string().min(1, "Child name is required"),
            gender: z.string().min(1, "Gender is required"),
            dateOfBirth: z.string().min(1, "Date of birth is required"),
            playingLevel: z.enum([
              "A_GRADE",
              "B_GRADE",
              "SOCIAL",
              "BEGINNER",
              "JUNIOR",
            ]),
          })
        )
        .optional(),
    })
    .optional(),
  clubInvolvement: z.object({
    interestedInClubOfficer: z.boolean().default(false),
    skills: z.string().optional(),
  }),
  declaration: z.boolean().refine((val) => val === true, {
    message: "You must agree to the declaration to submit the application",
  }),
});

type MembershipFormData = z.infer<typeof membershipFormSchema>;

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

export default function Membership() {
  const [childrenCount, setChildrenCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      familyDetails: {
        children: [],
      },
    },
  });

  const membershipStatus = watch("membershipStatus");
  const membershipType = watch("membershipType");

  const onSubmit = async (data: MembershipFormData) => {
    try {
      setIsLoading(true);
      console.log(data);
      // Handle form submission here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-light-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-dark-teal mb-8">
          Membership Application
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Section */}
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

          {/* Membership Status Section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-dark-teal mb-4">
              Membership Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="renewal"
                  value="renewal"
                  {...register("membershipStatus")}
                  className="text-dark-teal focus:ring-dark-teal"
                />
                <label
                  htmlFor="renewal"
                  className="text-sm font-medium text-dark-teal"
                >
                  Renewing Member
                </label>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="new"
                  value="new"
                  {...register("membershipStatus")}
                  className="text-dark-teal focus:ring-dark-teal"
                />
                <label
                  htmlFor="new"
                  className="text-sm font-medium text-dark-teal"
                >
                  New Member
                </label>
              </div>
            </div>
          </section>

          {/* Endorsement Section (for new members) */}
          {membershipStatus === "new" && (
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-dark-teal mb-4">
                Endorsement
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                As a new member, please provide details of two existing members
                who endorse your application.
              </p>

              <div className="space-y-6">
                {/* First Endorser */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-teal">
                      First Endorser Name
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
                      First Endorser Contact
                    </label>
                    <input
                      type="text"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-teal">
                      Second Endorser Name
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
                      Second Endorser Contact
                    </label>
                    <input
                      type="text"
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
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-dark-teal mb-4">
              Membership Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(MEMBERSHIP_TYPES).map(([key, value]) => (
                <div key={key} className="relative">
                  <input
                    type="radio"
                    id={key}
                    value={key}
                    {...register("membershipType")}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={key}
                    className="flex flex-col p-4 bg-light-teal cursor-pointer rounded-lg transition-all duration-300 hover:bg-muted-teal/20 peer-checked:bg-muted-teal peer-checked:border-2 peer-checked:border-dark-teal"
                  >
                    <span className="text-lg font-semibold text-dark-teal">
                      {value.title}
                    </span>
                    <span className="text-sm text-gray-600">
                      {value.description}
                    </span>
                    <span className="text-lg font-bold text-dark-teal mt-2">
                      {value.price}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Family Details Section (if FAMILY type selected) */}
          {membershipType === "FAMILY" && (
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-dark-teal mb-4">
                Family Details
              </h2>

              {/* Spouse Details */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-dark-teal mb-4">
                  Spouse Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-teal">
                      Name
                    </label>
                    <input
                      type="text"
                      {...register("familyDetails.spouse.name")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-teal mb-2">
                      Gender
                    </label>
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="male"
                          value="male"
                          {...register("familyDetails.spouse.gender")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="male"
                          className="px-4 py-2 bg-light-teal text-dark-teal rounded-md cursor-pointer transition-all duration-300 hover:bg-muted-teal/20 peer-checked:bg-muted-teal peer-checked:border-2 peer-checked:border-dark-teal"
                        >
                          Male
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="female"
                          value="female"
                          {...register("familyDetails.spouse.gender")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="female"
                          className="px-4 py-2 bg-light-teal text-dark-teal rounded-md cursor-pointer transition-all duration-300 hover:bg-muted-teal/20 peer-checked:bg-muted-teal peer-checked:border-2 peer-checked:border-dark-teal"
                        >
                          Female
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-teal">
                      Playing Level
                    </label>
                    <select
                      {...register("familyDetails.spouse.playingLevel")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
                    >
                      <option value="">Select playing level</option>
                      <option value="A_GRADE">A Grade</option>
                      <option value="B_GRADE">B Grade</option>
                      <option value="SOCIAL">Social</option>
                      <option value="BEGINNER">Beginner</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Children Details */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-dark-teal">
                    Children
                  </h3>
                  <button
                    type="button"
                    onClick={() => setChildrenCount((prev) => prev + 1)}
                    className="px-4 py-2 bg-dark-teal text-white rounded-md hover:bg-muted-teal"
                  >
                    Add Child
                  </button>
                </div>

                {Array.from({ length: childrenCount }).map((_, index) => (
                  <div
                    key={index}
                    className="mb-6 p-4 bg-light-teal rounded-lg"
                  >
                    <h4 className="text-lg font-semibold text-dark-teal mb-4">
                      Child {index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-dark-teal">
                          Name
                        </label>
                        <input
                          type="text"
                          {...register(`familyDetails.children.${index}.name`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-teal mb-2">
                          Gender
                        </label>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`male-${index}`}
                              value="male"
                              {...register(
                                `familyDetails.children.${index}.gender`
                              )}
                              className="hidden peer"
                            />
                            <label
                              htmlFor={`male-${index}`}
                              className="px-4 py-2 bg-light-teal text-dark-teal rounded-md cursor-pointer transition-all duration-300 hover:bg-muted-teal/20 peer-checked:bg-muted-teal peer-checked:border-2 peer-checked:border-dark-teal"
                            >
                              Male
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`female-${index}`}
                              value="female"
                              {...register(
                                `familyDetails.children.${index}.gender`
                              )}
                              className="hidden peer"
                            />
                            <label
                              htmlFor={`female-${index}`}
                              className="px-4 py-2 bg-light-teal text-dark-teal rounded-md cursor-pointer transition-all duration-300 hover:bg-muted-teal/20 peer-checked:bg-muted-teal peer-checked:border-2 peer-checked:border-dark-teal"
                            >
                              Female
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-teal">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          {...register(
                            `familyDetails.children.${index}.dateOfBirth`
                          )}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-teal">
                          Playing Level
                        </label>
                        <select
                          {...register(
                            `familyDetails.children.${index}.playingLevel`
                          )}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2"
                        >
                          <option value="">Select playing level</option>
                          <option value="A_GRADE">A Grade</option>
                          <option value="B_GRADE">B Grade</option>
                          <option value="SOCIAL">Social</option>
                          <option value="BEGINNER">Beginner</option>
                          <option value="JUNIOR">Junior</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Club Involvement Section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-dark-teal mb-4">
              Club Involvement
            </h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="clubOfficer"
                  {...register("clubInvolvement.interestedInClubOfficer")}
                  className="h-4 w-4 text-dark-teal rounded border-gray-300 focus:ring-dark-teal"
                />
                <label
                  htmlFor="clubOfficer"
                  className="text-sm font-medium text-dark-teal"
                >
                  Would you be interested in being a club officer?
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-teal mb-2">
                  What skills do you have that could help develop the club?
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  (e.g. web design, accounting, printing, planning, sponsorship,
                  etc.)
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
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-dark-teal mb-4">
              Declaration
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
                  id="declaration"
                  {...register("declaration")}
                  className="mt-1 h-4 w-4 text-dark-teal rounded border-gray-300 focus:ring-dark-teal"
                />
                <label
                  htmlFor="declaration"
                  className="text-sm font-medium text-dark-teal"
                >
                  I agree to the above declaration
                </label>
              </div>
              {errors.declaration && (
                <p className="text-deep-red text-sm">
                  {errors.declaration.message}
                </p>
              )}
            </div>
          </section>

          {/* Payment Section */}
          <Payment isLoading={isLoading} />

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-dark-teal text-white rounded-md hover:bg-muted-teal focus:outline-none focus:ring-2 focus:ring-dark-teal focus:ring-offset-2"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
