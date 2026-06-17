import {
  getDisplayStepIndex,
  getTotalWizardSteps,
  WIZARD_STEP_LABELS,
  type WizardStepNumber,
} from "../constants";

interface WizardProgressProps {
  currentStep: WizardStepNumber;
  membershipType: string | undefined;
}

export default function WizardProgress({
  currentStep,
  membershipType,
}: WizardProgressProps) {
  const totalSteps = getTotalWizardSteps(membershipType);
  const displayStep = getDisplayStepIndex(currentStep, membershipType);
  const progressPercent = (displayStep / totalSteps) * 100;
  const label = WIZARD_STEP_LABELS[currentStep];

  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex items-center justify-between gap-2">
        <p className="hidden text-sm font-medium text-dark-teal sm:block">
          Step {displayStep} of {totalSteps} — {label}
        </p>
        <p className="text-sm font-medium text-dark-teal sm:hidden">
          Step {displayStep} of {totalSteps}
        </p>
      </div>

      <div className="flex gap-1 sm:hidden">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full ${
              index < displayStep ? "bg-dark-teal" : "bg-muted-teal/30"
            }`}
          />
        ))}
      </div>

      <div className="hidden h-2 overflow-hidden rounded-full bg-muted-teal/30 sm:block">
        <div
          className="h-full rounded-full bg-dark-teal transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
