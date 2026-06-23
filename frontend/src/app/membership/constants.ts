export const INPUT_CLASS =
  "mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-dark-teal focus:ring-dark-teal px-3 py-2 min-h-[44px] text-base";

export const WIZARD_STEPS = {
  PERSONAL: 1,
  MEMBERSHIP: 2,
  FAMILY: 3,
  CLUB: 4,
  DECLARATION: 5,
} as const;

export type WizardStepNumber =
  (typeof WIZARD_STEPS)[keyof typeof WIZARD_STEPS];

export const WIZARD_STEP_LABELS: Record<WizardStepNumber, string> = {
  1: "Personal Information",
  2: "Membership Type",
  3: "Family Details",
  4: "Club Involvement",
  5: "Declaration & Payment",
};

export function getTotalWizardSteps(
  membershipType: string | undefined
): number {
  return membershipType === "FAMILY" ? 5 : 4;
}

export function getDisplayStepIndex(
  step: WizardStepNumber,
  membershipType: string | undefined
): number {
  if (membershipType !== "FAMILY" && step > WIZARD_STEPS.FAMILY) {
    return step - 1;
  }
  return step;
}

export function getNextWizardStep(
  step: WizardStepNumber,
  membershipType: string | undefined
): WizardStepNumber {
  if (
    step === WIZARD_STEPS.MEMBERSHIP &&
    membershipType !== "FAMILY"
  ) {
    return WIZARD_STEPS.CLUB;
  }
  return Math.min(step + 1, WIZARD_STEPS.DECLARATION) as WizardStepNumber;
}

export function getPrevWizardStep(
  step: WizardStepNumber,
  membershipType: string | undefined
): WizardStepNumber {
  if (step === WIZARD_STEPS.CLUB && membershipType !== "FAMILY") {
    return WIZARD_STEPS.MEMBERSHIP;
  }
  return Math.max(step - 1, WIZARD_STEPS.PERSONAL) as WizardStepNumber;
}
