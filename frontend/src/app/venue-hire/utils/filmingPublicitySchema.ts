import { z } from "zod";
import { premisesAreas } from "@/data/premisesAreas";

const premisesAreaIds = premisesAreas.map((a) => a.id) as [
  string,
  ...string[],
];

export const personOnGroundsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
});

export const filmingPublicitySchema = z
  .object({
    applicantInfo: z.object({
      name: z.string().min(1, "Applicant name is required"),
      phone: z.string().min(1, "Phone number is required"),
      email: z.string().email("Invalid email address"),
    }),
    productionPurpose: z
      .string()
      .min(1, "Please describe the purpose of the production"),
    locationSelection: z.object({
      locationType: z.enum(["events-lawn", "squash-courtyard", "other-area"], {
        required_error: "Please select a location",
      }),
      specificArea: z.enum(premisesAreaIds).optional(),
      specificAreaOther: z.string().optional(),
    }),
    peopleOnGrounds: z
      .array(personOnGroundsSchema)
      .min(1, "At least one person on grounds is required"),
    activityDate: z.string().min(1, "Date is required"),
    activityStartTime: z.string().min(1, "Start time is required"),
    activityEndTime: z.string().min(1, "End time is required"),
    durationType: z.enum(["half-day", "full-day"], {
      required_error: "Please select half day or full day",
    }),
    organization: z.string().min(1, "Organization is required"),
    contactDetails: z
      .string()
      .min(1, "Contact person and full details are required"),
    pomrcMemberInvolved: z.string().optional(),
    acknowledgements: z.object({
      feesAcknowledged: z.boolean().refine((val) => val === true, {
        message: "You must acknowledge the application fees",
      }),
      damagesAndTidyAcknowledged: z.boolean().refine((val) => val === true, {
        message: "You must accept responsibility for damages and tidiness",
      }),
      insuranceAcknowledged: z.boolean().refine((val) => val === true, {
        message: "You must confirm insurance certificate will be provided",
      }),
      committeeApprovalAcknowledged: z.boolean().refine((val) => val === true, {
        message: "You must acknowledge committee approval is required",
      }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.locationSelection.locationType === "other-area") {
      if (!data.locationSelection.specificArea) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a specific area",
          path: ["locationSelection", "specificArea"],
        });
      }
      if (
        data.locationSelection.specificArea === "other" &&
        !data.locationSelection.specificAreaOther?.trim()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please specify the area",
          path: ["locationSelection", "specificAreaOther"],
        });
      }
    }
  });

export type FilmingPublicityFormData = z.infer<typeof filmingPublicitySchema>;

export const filmingPublicityDefaultValues: FilmingPublicityFormData = {
  applicantInfo: { name: "", phone: "", email: "" },
  productionPurpose: "",
  locationSelection: {
    locationType: "events-lawn",
    specificArea: undefined,
    specificAreaOther: "",
  },
  peopleOnGrounds: [{ name: "", position: "" }],
  activityDate: "",
  activityStartTime: "",
  activityEndTime: "",
  durationType: "half-day",
  organization: "",
  contactDetails: "",
  pomrcMemberInvolved: "",
  acknowledgements: {
    feesAcknowledged: false,
    damagesAndTidyAcknowledged: false,
    insuranceAcknowledged: false,
    committeeApprovalAcknowledged: false,
  },
};
