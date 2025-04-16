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
import TermsAcceptance from "./TermsAcceptance";
import TermsContent from "./TermsContent";
import LoadingSpinner from "./LoadingSpinner";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

  const handleAcceptFullTerms = () => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <PersonalInfo register={register} errors={errors} />
        <EventDetails register={register} errors={errors} watch={watch} />
        <VenueSelection register={register} errors={errors} />
        <TermsAcceptance register={register} errors={errors} />
      </div>

      {submitError && (
        <p className="text-deep-red text-sm mt-4">Error: {submitError}</p>
      )}

      <DialogFooter className="pt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-deep-red hover:bg-deep-red/80 text-light-cream"
        >
          {isSubmitting ? <LoadingSpinner /> : "Submit Request"}
        </Button>
      </DialogFooter>
    </form>
  );
}
