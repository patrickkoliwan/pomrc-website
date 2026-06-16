import { z } from "zod";
import type { MembershipFormData } from "./types";

export const membershipFormSchema: z.ZodType<MembershipFormData> = z
  .object({
    personalInfo: z.object({
      firstName: z.string().min(1, "First name is required"),
      surname: z.string().min(1, "Surname is required"),
      phone: z.string().min(1, "Phone number is required"),
      email: z.string().email("Invalid email address"),
      address: z.string().optional(),
    }),
    membershipStatus: z.enum(["new", "renewal"]),
    membershipType: z.enum(["FAMILY", "SINGLE_ADULT", "JUNIORS", "SOCIAL"]),
    familyDetails: z
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
              name: z.string(),
              gender: z.string(),
              dateOfBirth: z.string(),
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
      .optional(),
    endorsements: z
      .object({
        firstEndorser: z.object({
          name: z.string().min(1, "Endorser name is required"),
          contact: z.string().min(1, "Endorser contact is required"),
        }),
        secondEndorser: z.object({
          name: z.string().min(1, "Endorser name is required"),
          contact: z.string().min(1, "Endorser contact is required"),
        }),
      })
      .optional(),
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
