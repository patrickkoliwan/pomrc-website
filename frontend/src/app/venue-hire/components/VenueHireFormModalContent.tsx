"use client";

import { useState } from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormWatch,
} from "react-hook-form";
import { FormData } from "../page";
import PersonalInfo from "./PersonalInfo";
import EventDetails from "./EventDetails";
import VenueSelection from "./VenueSelection";
import VenueInfo from "./VenueInfo";
import TermsAcceptance from "./TermsAcceptance";
import TermsContent from "./TermsContent";
import LoadingSpinner from "./LoadingSpinner";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";

interface VenueHireFormModalContentProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  handleSubmit: UseFormHandleSubmit<FormData>;
  watch: UseFormWatch<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
  isLoading: boolean;
  submitError: string | null;
  onClose: () => void;
}

export default function VenueHireFormModalContent({
  register,
  errors,
  handleSubmit,
  watch,
  onSubmit,
  isSubmitting,
  isLoading,
  submitError,
  onClose,
}: VenueHireFormModalContentProps) {
  // State for inline terms view
  const [isViewingFullTerms, setIsViewingFullTerms] = useState(false);
  // State to track if user clicked "Accept" in the inline view
  const [hasAcceptedFullTerms, setHasAcceptedFullTerms] = useState(false);

  // Watch the RHF termsAccepted checkbox value
  const termsAcceptedValue = watch("termsAccepted");

  const handleAcceptFullTerms = () => {
    setHasAcceptedFullTerms(true);
    setIsViewingFullTerms(false); // Go back to form view
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  // Conditional Rendering: Show Full Terms or the Form
  if (isViewingFullTerms) {
    return (
      <div className="space-y-4 px-1 py-2 max-h-[70vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-dark-teal">
          Full Terms and Conditions
        </h3>

        {/* Use the TermsContent component */}
        <TermsContent />

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setIsViewingFullTerms(false)} // Go back button
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors"
          >
            Back to Form
          </button>
          <button
            type="button"
            onClick={handleAcceptFullTerms} // Accept button
            className="bg-dark-teal text-light-cream py-2 px-4 rounded-md font-medium hover:bg-muted-teal transition-colors"
          >
            Accept Full Terms
          </button>
        </div>
      </div>
    );
  }

  // Render the Form View
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-1 py-2">
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
      <div className="pt-4">
        <VenueInfo isLoading={isSubmitting} />
      </div>

      {/* Area for Terms Acceptance */}
      <div className="pt-4 border-t border-gray-200 space-y-3">
        {/* Button to trigger inline view */}
        <button
          type="button"
          onClick={() => setIsViewingFullTerms(true)}
          className="text-deep-red hover:text-muted-teal transition-colors text-sm underline"
        >
          View & Accept Full Terms and Conditions
        </button>

        {/* RHF Terms Acceptance checkbox */}
        <TermsAcceptance
          register={register}
          errors={errors}
          isLoading={isSubmitting}
        />
        {/* Reminder to view/accept full terms if not yet done */}
        {!hasAcceptedFullTerms && (
          <p className="text-sm text-muted-teal -mt-2 ml-6">
            You must view and accept the full terms using the link above before
            submitting.
          </p>
        )}
      </div>

      {submitError && (
        <div className="bg-deep-red/10 text-deep-red p-3 rounded-md text-sm">
          <strong>Error:</strong> {submitError}
        </div>
      )}

      <DialogFooter className="pt-4 sm:justify-between">
        <DialogClose asChild>
          <button
            type="button"
            onClick={onClose} // Ensure onClose prop is used for cancel
            className="mt-2 sm:mt-0 bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </DialogClose>
        <button
          type="submit"
          // Disable if submitting OR full terms not accepted OR RHF checkbox not checked
          disabled={
            isSubmitting || !hasAcceptedFullTerms || !termsAcceptedValue
          }
          className="w-full sm:w-auto bg-dark-teal text-light-cream py-2 px-6 rounded-md font-medium hover:bg-muted-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={
            !hasAcceptedFullTerms
              ? "Please view and accept the full terms and conditions first"
              : !termsAcceptedValue
              ? "Please check the box to confirm you agree to the terms"
              : undefined
          }
        >
          {isSubmitting ? <LoadingSpinner size="sm" /> : "Submit Request"}
        </button>
      </DialogFooter>
    </form>
  );
}
