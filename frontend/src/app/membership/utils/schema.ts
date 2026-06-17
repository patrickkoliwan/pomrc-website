import { z } from "zod";
import type { MembershipFormData } from "./types";

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Surname is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().optional(),
});

export const endorserSchema = z.object({
  name: z.string().min(1, "Endorser name is required"),
  contact: z.string().min(1, "Endorser contact is required"),
});

export const endorsementsSchema = z.object({
  firstEndorser: endorserSchema,
  secondEndorser: endorserSchema,
});

export const membershipStatusSchema = z.enum(["new", "renewal"], {
  errorMap: () => ({ message: "Please select membership status" }),
});

export const membershipTypeSchema = z.enum(
  ["FAMILY", "SINGLE_ADULT", "JUNIORS", "SOCIAL"],
  {
    errorMap: () => ({ message: "Please select a membership type" }),
  }
);

export const step1Schema = z.object({
  personalInfo: personalInfoSchema,
});

export const step2Schema = z
  .object({
    membershipStatus: membershipStatusSchema,
    membershipType: membershipTypeSchema,
    endorsements: endorsementsSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.membershipStatus === "new" && !data.endorsements) {
        return false;
      }
      return true;
    },
    {
      message: "New members must provide endorsements",
      path: ["endorsements"],
    }
  )
  .refine(
    (data) => {
      if (data.membershipStatus === "new" && data.endorsements) {
        return (
          data.endorsements.firstEndorser.name.length > 0 &&
          data.endorsements.firstEndorser.contact.length > 0 &&
          data.endorsements.secondEndorser.name.length > 0 &&
          data.endorsements.secondEndorser.contact.length > 0
        );
      }
      return true;
    },
    {
      message: "Please complete all endorser details",
      path: ["endorsements"],
    }
  );

export const familyDetailsSchema = z
  .object({
    spouse: z
      .object({
        name: z.string(),
        gender: z.string(),
        playingLevel: z.enum(["A_GRADE", "B_GRADE", "SOCIAL", "BEGINNER"]),
      })
      .optional(),
    children: z
      .array(
        z.object({
          name: z.string().min(1, "Child name is required"),
          gender: z.string().min(1, "Child gender is required"),
          dateOfBirth: z.string().min(1, "Date of birth is required"),
          playingLevel: z.enum([
            "A_GRADE",
            "B_GRADE",
            "SOCIAL",
            "BEGINNER",
            "JUNIOR",
          ]),
        })
      )
      .optional(),
  })
  .optional();

export const step3Schema = z.object({
  familyDetails: familyDetailsSchema,
});

export const step4Schema = z.object({
  clubInvolvement: z.object({
    interestedInClubOfficer: z.boolean(),
    skills: z.string().optional(),
  }),
});

export const step5Schema = z.object({
  declaration: z.boolean().refine((val) => val === true, {
    message: "You must agree to the declaration",
  }),
});

export const membershipFormSchema: z.ZodType<MembershipFormData> = z
  .object({
    personalInfo: personalInfoSchema,
    membershipStatus: membershipStatusSchema,
    membershipType: membershipTypeSchema,
    familyDetails: familyDetailsSchema,
    endorsements: endorsementsSchema.optional(),
    clubInvolvement: z.object({
      interestedInClubOfficer: z.boolean(),
      skills: z.string().optional(),
    }),
    declaration: z.boolean().refine((val) => val === true, {
      message: "You must agree to the declaration",
    }),
  })
  .refine(
    (data) => {
      if (data.membershipStatus === "new" && !data.endorsements) {
        return false;
      }
      return true;
    },
    {
      message: "New members must provide endorsements",
      path: ["endorsements"],
    }
  );

export function validateWizardStep(
  step: number,
  data: Partial<MembershipFormData>
): { success: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const assignErrors = (result: z.SafeParseReturnType<unknown, unknown>) => {
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });
    }
  };

  switch (step) {
    case 1:
      assignErrors(step1Schema.safeParse(data));
      break;
    case 2:
      assignErrors(step2Schema.safeParse(data));
      break;
    case 3:
      assignErrors(step3Schema.safeParse(data));
      break;
    case 4:
      assignErrors(step4Schema.safeParse(data));
      break;
    case 5:
      assignErrors(step5Schema.safeParse(data));
      break;
    default:
      break;
  }

  return { success: Object.keys(errors).length === 0, errors };
}
