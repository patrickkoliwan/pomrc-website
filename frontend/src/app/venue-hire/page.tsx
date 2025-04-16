"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { personalInfoSchema } from "./components/PersonalInfo";
import { eventDetailsSchema } from "./components/EventDetails";
import VenueInfo from "./components/VenueInfo";
import TermsDisplay from "./components/TermsDisplay";
import VenueHireSteps from "./components/VenueHireSteps";
import AvailableVenues from "./components/AvailableVenues";
import { venueSelectionSchema } from "./components/VenueSelection";
import { formStorage } from "./utils/formPersistence";
import { api } from "./utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import VenueHireFormModalContent from "./components/VenueHireFormModalContent";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: isClient
      ? formStorage.load() || {
          personalInfo: { name: "", phone: "", email: "" },
          eventDetails: { eventType: "", expectedGuests: 0 },
          venueSelection: { selectedVenue: "events-lawn" },
          termsAccepted: false,
        }
      : {
          personalInfo: { name: "", phone: "", email: "" },
          eventDetails: { eventType: "", expectedGuests: 0 },
          venueSelection: { selectedVenue: "events-lawn" },
          termsAccepted: false,
        },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.submitVenueHireForm(data);
      setSubmitSuccess(true);
      formStorage.clear();
      reset();
      setIsModalOpen(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedData = watch();
  useEffect(() => {
    if (isClient) {
      formStorage.save(watchedData);
    }
  }, [watchedData, isClient]);

  if (submitSuccess) {
    return (
      <main className="min-h-screen bg-light-cream py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-dark-teal mb-4">
              Venue Hire Request Submitted!
            </h2>
            <p className="text-dark-teal mb-4">
              Thank you for your venue hire request. We have received your
              details and will review your application shortly.
            </p>
            <p className="text-dark-teal font-medium">
              Please note: Your booking is confirmed only upon receipt of
              payment.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="mt-6 bg-dark-teal text-light-cream py-2 px-4 rounded-md font-medium hover:bg-muted-teal transition-colors"
            >
              Make Another Request
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-light-cream py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-4xl font-bold text-dark-teal mb-8 text-center">
          Venue Hire at POMRC
        </h1>

        <VenueHireSteps />
        <AvailableVenues isLoading={false} />
        <VenueInfo isLoading={false} />
        <TermsDisplay />

        <div className="text-center pt-4">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button className="bg-deep-red text-light-cream py-3 px-8 rounded-md font-semibold text-lg hover:bg-deep-red/80 transition-colors shadow-md">
                Submit Venue Hire Request
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-light-cream">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-dark-teal">
                  Venue Hire Request Form
                </DialogTitle>
                <DialogDescription className="text-muted-teal">
                  Please fill out the details below to request a venue booking.
                </DialogDescription>
              </DialogHeader>

              <VenueHireFormModalContent
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                watch={watch}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                isLoading={!isClient}
                submitError={submitError}
                onClose={() => setIsModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
}
