import { Button } from "@/components/ui/button";
import { WIZARD_STEPS, type WizardStepNumber } from "../constants";

interface WizardFooterProps {
  currentStep: WizardStepNumber;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  inline?: boolean;
}

export default function WizardFooter({
  currentStep,
  isSubmitting,
  onBack,
  onNext,
  onSubmit,
  inline = false,
}: WizardFooterProps) {
  const isFirstStep = currentStep === WIZARD_STEPS.PERSONAL;
  const isLastStep = currentStep === WIZARD_STEPS.DECLARATION;

  return (
    <div
      className={
        inline
          ? "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          : "flex shrink-0 items-center justify-between gap-3 border-t border-muted-teal/30 bg-white p-4"
      }
    >
      {!isFirstStep ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className={inline ? "w-full sm:w-auto" : undefined}
        >
          Back
        </Button>
      ) : (
        !inline && <div />
      )}

      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={inline ? "w-full sm:w-auto" : undefined}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className={inline ? "w-full sm:w-auto" : undefined}
        >
          Next
        </Button>
      )}
    </div>
  );
}
