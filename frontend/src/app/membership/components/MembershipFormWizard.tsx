"use client";

import { useEffect, useRef, useState } from "react";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetError,
  UseFormWatch,
} from "react-hook-form";
import PersonalInfo from "./PersonalInfo";
import MembershipStatusStep from "./MembershipStatusStep";
import FamilyDetailsStep from "./FamilyDetailsStep";
import ClubInvolvementStep from "./ClubInvolvementStep";
import Declaration from "./Declaration";
import Payment from "./Payment";
import WizardProgress from "./WizardProgress";
import WizardFooter from "./WizardFooter";
import {
  getNextWizardStep,
  getPrevWizardStep,
  WIZARD_STEPS,
  type WizardStepNumber,
} from "../constants";
import { validateWizardStep } from "../utils/schema";
import type { MembershipFormData } from "../utils/types";

interface MembershipFormWizardProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
  watch: UseFormWatch<MembershipFormData>;
  getValues: UseFormGetValues<MembershipFormData>;
  setError: UseFormSetError<MembershipFormData>;
  handleSubmit: UseFormHandleSubmit<MembershipFormData>;
  onSubmit: (data: MembershipFormData) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  showDraftSaved: boolean;
  isModalOpen: boolean;
}

export default function MembershipFormWizard({
  register,
  errors,
  watch,
  getValues,
  setError,
  handleSubmit,
  onSubmit,
  isSubmitting,
  submitError,
  showDraftSaved,
  isModalOpen,
}: MembershipFormWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStepNumber>(
    WIZARD_STEPS.PERSONAL
  );
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const stepContainerRef = useRef<HTMLDivElement>(null);

  const membershipType = watch("membershipType");

  const resetScroll = () => {
    stepContainerRef.current?.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    resetScroll();
  }, [currentStep]);

  useEffect(() => {
    if (isModalOpen) {
      resetScroll();
    }
  }, [isModalOpen]);

  useEffect(() => {
    stepContainerRef.current?.querySelector<HTMLElement>(
      "input, select, textarea, button"
    )?.focus();
  }, [currentStep]);

  const clearStepErrors = () => setStepErrors({});

  const applyStepErrors = (fieldErrors: Record<string, string>) => {
    setStepErrors(fieldErrors);
    Object.entries(fieldErrors).forEach(([path, message]) => {
      setError(path as keyof MembershipFormData & string, { message });
    });
  };

  const validateCurrentStep = () => {
    const data = getValues();
    const result = validateWizardStep(currentStep, data);
    if (!result.success) {
      applyStepErrors(result.errors);
      return false;
    }
    clearStepErrors();
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setCurrentStep((prev) =>
      getNextWizardStep(prev, membershipType)
    );
  };

  const handleBack = () => {
    clearStepErrors();
    setCurrentStep((prev) => getPrevWizardStep(prev, membershipType));
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    const result = validateWizardStep(WIZARD_STEPS.DECLARATION, data);
    if (!result.success) {
      applyStepErrors(result.errors);
      return;
    }
    await onSubmit(data);
  });

  const footerProps = {
    currentStep,
    isSubmitting,
    onBack: handleBack,
    onNext: handleNext,
    onSubmit: () => void handleFormSubmit(),
  };

  const renderStep = () => {
    switch (currentStep) {
      case WIZARD_STEPS.PERSONAL:
        return (
          <PersonalInfo
            register={register}
            errors={errors}
            compact
          />
        );
      case WIZARD_STEPS.MEMBERSHIP:
        return (
          <MembershipStatusStep
            register={register}
            errors={errors}
            watch={watch}
            stepErrors={stepErrors}
          />
        );
      case WIZARD_STEPS.FAMILY:
        return (
          <FamilyDetailsStep register={register} errors={errors} />
        );
      case WIZARD_STEPS.CLUB:
        return <ClubInvolvementStep register={register} />;
      case WIZARD_STEPS.DECLARATION:
        return (
          <div className="space-y-6">
            <Declaration register={register} errors={errors} compact />
            <Payment variant="borderless" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 space-y-2 border-b border-muted-teal/30 px-4 py-3 sm:px-6 sm:py-4">
        <WizardProgress
          currentStep={currentStep}
          membershipType={membershipType}
        />
        {showDraftSaved && (
          <p className="text-xs text-muted-teal">Draft saved</p>
        )}
      </div>

      <div
        ref={stepContainerRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6"
      >
        {submitError && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
            {submitError}
          </div>
        )}
        <form onSubmit={(event) => event.preventDefault()}>{renderStep()}</form>

        {/* Mobile: inline footer at bottom of scroll content */}
        <div className="mt-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:hidden">
          <WizardFooter {...footerProps} inline />
        </div>
      </div>

      {/* Desktop: sticky footer */}
      <div className="hidden sm:block">
        <WizardFooter {...footerProps} />
      </div>
    </div>
  );
}
