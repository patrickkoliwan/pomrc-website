"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import PersonalInfo, { personalInfoSchema } from "./components/PersonalInfo";
import EventDetails, { eventDetailsSchema } from "./components/EventDetails";
import VenueInfo from "./components/VenueInfo";
import TermsAndConditions from "./components/TermsAndConditions";
import VenueHireSteps from "./components/VenueHireSteps";
import AvailableVenues from "./components/AvailableVenues";
import VenueSelection, {
  venueSelectionSchema,
} from "./components/VenueSelection";
import { formStorage } from "./utils/formPersistence";
import { api } from "./utils/api";

const formSchema = z.object({
  personalInfo: personalInfoSchema,
  eventDetails: eventDetailsSchema,
  venueSelection: venueSelectionSchema,
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type FormData = z.infer<typeof formSchema>;

export default function VenueHire() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formStorage.load(),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.submitVenueHireForm(data);
      setSubmitSuccess(true);
      formStorage.clear();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save form data on change
  const formData = watch();
  formStorage.save(formData);

  if (submitSuccess) {
    return (
      <main className="min-h-screen bg-light-cream py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-dark-teal mb-4">
              Venue Hire Request Submitted
            </h2>
            <p className="text-dark-teal mb-4">
              Thank you for your venue hire request. We will review your
              application and contact you shortly.
            </p>
            <p className="text-dark-teal">
              Please proceed with the payment to confirm your booking.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-light-cream py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-dark-teal mb-8">Venue Hire</h1>

        <VenueHireSteps />

        <div className="my-8">
          <AvailableVenues isLoading={isSubmitting} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <PersonalInfo
            register={register}
            errors={errors}
            isLoading={isSubmitting}
          />

          <EventDetails
            register={register}
            errors={errors}
            isLoading={isSubmitting}
          />

          <VenueSelection
            register={register}
            errors={errors}
            isLoading={isSubmitting}
          />

          <VenueInfo isLoading={isSubmitting} />

          <TermsAndConditions
            register={register}
            errors={errors}
            isLoading={isSubmitting}
          />

          {submitError && (
            <div className="bg-deep-red/10 text-deep-red p-4 rounded-md">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-dark-teal text-light-cream py-3 px-6 rounded-md font-medium hover:bg-muted-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Venue Hire Request"}
          </button>
        </form>
      </div>
    </main>
  );
}
