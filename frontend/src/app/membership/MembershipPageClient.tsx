"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MembershipHero from "./components/MembershipHero";
import MembershipSteps from "./components/MembershipSteps";
import PricingTierCards from "./components/PricingTierCards";
import PolicyAccordions from "./components/PolicyAccordions";
import Payment from "./components/Payment";
import MembershipFormWizard from "./components/MembershipFormWizard";
import { MembershipPricingProvider } from "./components/MembershipPricingProvider";
import { membershipFormSchema } from "./utils/schema";
import { formStorage } from "./utils/formPersistence";
import { api } from "./utils/api";
import type { MembershipFormData } from "./utils/types";
import type { MembershipPricingConfig } from "@/lib/membership/pricing-types";

const defaultFormValues: Partial<MembershipFormData> = {
  personalInfo: {
    firstName: "",
    surname: "",
    phone: "",
    email: "",
    address: "",
  },
  membershipStatus: undefined,
  membershipType: undefined,
  familyDetails: {
    children: [],
  },
  clubInvolvement: {
    interestedInClubOfficer: false,
    skills: "",
  },
  declaration: false,
};

export default function MembershipPageClient({
  pricing,
}: {
  pricing: MembershipPricingConfig;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showDraftSaved, setShowDraftSaved] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setError,
    reset,
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: defaultFormValues as MembershipFormData,
  });

  useEffect(() => {
    if (!isClient) return;
    const saved = formStorage.load();
    if (saved) {
      reset({ ...defaultFormValues, ...saved } as MembershipFormData);
    }
  }, [isClient, reset]);

  const watchedData = watch();

  useEffect(() => {
    if (!isClient) return;
    formStorage.save(watchedData);
    setShowDraftSaved(true);
    const timer = window.setTimeout(() => setShowDraftSaved(false), 2000);
    return () => window.clearTimeout(timer);
  }, [watchedData, isClient]);

  const onSubmit = async (data: MembershipFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await api.submitMembershipForm(data);
      if (!response.success) {
        throw new Error(response.error || "Failed to submit application");
      }
      formStorage.clear();
      reset(defaultFormValues as MembershipFormData);
      setIsModalOpen(false);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openApplication = () => {
    setSubmitError(null);
    setIsModalOpen(true);
  };

  if (submitSuccess) {
    return (
      <main className="min-h-screen bg-light-cream py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <FaCheckCircle className="mx-auto mb-4 text-5xl text-dark-teal" />
            <h1 className="mb-4 text-2xl font-semibold text-dark-teal sm:text-3xl">
              Membership Application Submitted!
            </h1>
            <p className="mb-4 text-dark-teal">
              Thank you for your application. You will receive a confirmation
              email shortly.
            </p>
            <p className="font-medium text-dark-teal">
              Please note: Membership is confirmed only after committee approval
              and receipt of payment.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button onClick={() => setSubmitSuccess(false)}>
                Apply Again
              </Button>
              <Link
                href="/"
                className="text-deep-red underline-offset-4 hover:text-muted-teal hover:underline"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <MembershipPricingProvider config={pricing}>
      <main className="min-h-screen bg-light-cream text-dark-teal">
        <MembershipHero />

        <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 pb-24 sm:px-6 md:pb-12 lg:px-8">
          <MembershipSteps />
          <PricingTierCards />
          <PolicyAccordions />
          <Payment variant="compact" />

          <div className="hidden text-center md:block">
            <Button size="lg" onClick={openApplication}>
              Apply for Membership
            </Button>
          </div>
        </div>

        {!isModalOpen && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-muted-teal/30 bg-white/95 p-4 backdrop-blur md:hidden pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button className="w-full" size="lg" onClick={openApplication}>
              Apply for Membership
            </Button>
          </div>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="flex h-dvh max-h-dvh w-full max-w-none flex-col gap-0 overflow-hidden bg-light-cream p-0 max-sm:fixed max-sm:inset-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:data-[state=closed]:slide-out-to-bottom max-sm:data-[state=open]:slide-in-from-bottom sm:max-h-[95dvh] sm:max-w-[640px] sm:rounded-lg">
            <DialogHeader className="shrink-0 space-y-1 border-b border-muted-teal/30 px-4 py-3 text-left sm:px-6 sm:py-4">
              <DialogTitle className="text-xl font-semibold text-dark-teal sm:text-2xl">
                Membership Application
              </DialogTitle>
              <DialogDescription className="hidden text-muted-teal sm:block">
                Complete each step to submit your membership application.
              </DialogDescription>
            </DialogHeader>

            {isClient && (
              <MembershipFormWizard
                register={register}
                errors={errors}
                watch={watch}
                getValues={getValues}
                setError={setError}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                submitError={submitError}
                showDraftSaved={showDraftSaved}
                isModalOpen={isModalOpen}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </MembershipPricingProvider>
  );
}
