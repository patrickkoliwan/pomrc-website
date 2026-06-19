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
import FilmingPublicityInfo from "./components/FilmingPublicityInfo";
import VenueHireIntro from "./components/VenueHireIntro";
import { venueSelectionSchema } from "./components/VenueSelection";
import { formStorage } from "./utils/formPersistence";
import { api } from "./utils/api";
import { filmingFormStorage } from "./utils/filmingPublicityFormPersistence";
import { filmingPublicityApi } from "./utils/filmingPublicityApi";
import {
  filmingPublicitySchema,
  filmingPublicityDefaultValues,
  type FilmingPublicityFormData,
} from "./utils/filmingPublicitySchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import VenueHireFormModalContent from "./components/VenueHireFormModalContent";
import FilmingPublicityFormModalContent from "./components/FilmingPublicityFormModalContent";

const venueHireFormSchema = z.object({
  personalInfo: personalInfoSchema,
  eventDetails: eventDetailsSchema,
  venueSelection: venueSelectionSchema,
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type FormData = z.infer<typeof venueHireFormSchema>;

type SuccessType = "venue-hire" | "filming-publicity" | null;

export default function VenueHire() {
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isFilmingModalOpen, setIsFilmingModalOpen] = useState(false);
  const [isVenueSubmitting, setIsVenueSubmitting] = useState(false);
  const [isFilmingSubmitting, setIsFilmingSubmitting] = useState(false);
  const [venueSubmitError, setVenueSubmitError] = useState<string | null>(null);
  const [filmingSubmitError, setFilmingSubmitError] = useState<string | null>(
    null
  );
  const [successType, setSuccessType] = useState<SuccessType>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const venueHireForm = useForm<FormData>({
    resolver: zodResolver(venueHireFormSchema),
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

  const filmingForm = useForm<FilmingPublicityFormData>({
    resolver: zodResolver(filmingPublicitySchema),
    defaultValues: isClient
      ? filmingFormStorage.load() || filmingPublicityDefaultValues
      : filmingPublicityDefaultValues,
  });

  const onVenueSubmit = async (data: FormData) => {
    setIsVenueSubmitting(true);
    setVenueSubmitError(null);

    try {
      await api.submitVenueHireForm(data);
      setSuccessType("venue-hire");
      formStorage.clear();
      venueHireForm.reset();
      setIsVenueModalOpen(false);
    } catch (error) {
      setVenueSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsVenueSubmitting(false);
    }
  };

  const onFilmingSubmit = async (data: FilmingPublicityFormData) => {
    setIsFilmingSubmitting(true);
    setFilmingSubmitError(null);

    try {
      await filmingPublicityApi.submitFilmingPublicityForm(data);
      setSuccessType("filming-publicity");
      filmingFormStorage.clear();
      filmingForm.reset(filmingPublicityDefaultValues);
      setIsFilmingModalOpen(false);
    } catch (error) {
      setFilmingSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsFilmingSubmitting(false);
    }
  };

  const watchedVenueData = venueHireForm.watch();
  useEffect(() => {
    if (isClient) {
      formStorage.save(watchedVenueData);
    }
  }, [watchedVenueData, isClient]);

  const watchedFilmingData = filmingForm.watch();
  useEffect(() => {
    if (isClient) {
      filmingFormStorage.save(watchedFilmingData);
    }
  }, [watchedFilmingData, isClient]);

  if (successType === "venue-hire") {
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
              onClick={() => setSuccessType(null)}
              className="mt-6 bg-dark-teal text-light-cream py-2 px-4 rounded-md font-medium hover:bg-muted-teal transition-colors"
            >
              Make Another Request
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (successType === "filming-publicity") {
    return (
      <main className="min-h-screen bg-light-cream py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-dark-teal mb-4">
              Filming & Publicity Application Submitted!
            </h2>
            <p className="text-dark-teal mb-4">
              Thank you for your application. We have received your details and
              will forward them to the Tennis/Squash Director for review and
              final approval by the POMRC Committee Executive.
            </p>
            <p className="text-dark-teal font-medium">
              Please note: Approval is pending committee review. Do not proceed
              with filming or photography until you receive written confirmation.
            </p>
            <button
              onClick={() => setSuccessType(null)}
              className="mt-6 bg-dark-teal text-light-cream py-2 px-4 rounded-md font-medium hover:bg-muted-teal transition-colors"
            >
              Make Another Application
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

        <VenueHireIntro
          onOpenEventForm={() => setIsVenueModalOpen(true)}
          onOpenFilmingForm={() => setIsFilmingModalOpen(true)}
        />

        {/* Section 1: Event Venue Hire */}
        <section id="event-venue-hire" className="space-y-8 scroll-mt-8">
          <VenueHireSteps />
          <AvailableVenues isLoading={false} />
          <VenueInfo isLoading={false} />
          <TermsDisplay />

          <div className="text-center pt-4">
            <Dialog open={isVenueModalOpen} onOpenChange={setIsVenueModalOpen}>
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
                  register={venueHireForm.register}
                  errors={venueHireForm.formState.errors}
                  handleSubmit={venueHireForm.handleSubmit}
                  watch={venueHireForm.watch}
                  onSubmit={onVenueSubmit}
                  isSubmitting={isVenueSubmitting}
                  isLoading={!isClient}
                  submitError={venueSubmitError}
                  onClose={() => setIsVenueModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Section 2: Filming, Photography & Publicity */}
        <section
          id="filming-publicity"
          className="space-y-8 border-t border-muted-teal pt-8 scroll-mt-8"
        >
          <FilmingPublicityInfo />

          <div className="text-center pt-4">
            <Dialog
              open={isFilmingModalOpen}
              onOpenChange={setIsFilmingModalOpen}
            >
              <DialogTrigger asChild>
                <button className="bg-deep-red text-light-cream py-3 px-8 rounded-md font-semibold text-lg hover:bg-deep-red/80 transition-colors shadow-md">
                  Submit Filming & Publicity Application
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-light-cream">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold text-dark-teal">
                    Filming, Photography & Publicity Application
                  </DialogTitle>
                  <DialogDescription className="text-muted-teal">
                    Complete this form to request approval for filming,
                    photography, or publicity events at POMRC.
                  </DialogDescription>
                </DialogHeader>

                <FilmingPublicityFormModalContent
                  register={filmingForm.register}
                  errors={filmingForm.formState.errors}
                  handleSubmit={filmingForm.handleSubmit}
                  watch={filmingForm.watch}
                  control={filmingForm.control}
                  onSubmit={onFilmingSubmit}
                  isSubmitting={isFilmingSubmitting}
                  isLoading={!isClient}
                  submitError={filmingSubmitError}
                  onClose={() => setIsFilmingModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </div>
    </main>
  );
}
