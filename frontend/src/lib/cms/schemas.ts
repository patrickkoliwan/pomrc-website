import { z } from "zod";
import type { CmsTable } from "./types";

const optionalText = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value ? value : null));

const optionalUrlOrPath = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value ? value : null));

const displayOrder = z.coerce.number().int().min(0).default(0);
const published = z.coerce.boolean().default(true);

const slug = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens");

export const sitePageBodySectionSchema = z.object({
  heading: z.string().trim().min(1).max(160),
  content: z.string().trim().min(1).max(4000),
});

export const sitePageSchema = z.object({
  slug,
  title: z.string().trim().min(1).max(160),
  hero_title: optionalText,
  hero_subtitle: optionalText,
  body: z.array(sitePageBodySectionSchema).default([]),
  hero_image_url: optionalUrlOrPath,
  seo_title: optionalText,
  seo_description: optionalText,
  published,
});

export const facilitySchema = z.object({
  name: z.string().trim().min(1).max(160),
  slug: slug.optional().nullable().transform((value) => (value ? value : null)),
  description: optionalText,
  image_url: optionalUrlOrPath,
  features: z.array(z.string().trim().min(1).max(160)).default([]),
  display_order: displayOrder,
  published,
});

export const clubEventSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: optionalText,
  day: optionalText,
  event_date: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => (value ? value : null)),
  start_time: optionalText,
  end_time: optionalText,
  image_url: optionalUrlOrPath,
  display_order: displayOrder,
  published,
});

export const juniorProgramSchema = z.object({
  title: z.string().trim().min(1).max(160),
  program_type: z.enum(["tennis", "squash", "other"]),
  description: z.string().trim().min(1).max(1200),
  day_text: z.string().trim().min(1).max(160),
  time_text: z.string().trim().min(1).max(240),
  location: z.string().trim().min(1).max(160),
  price: z.string().trim().min(1).max(160),
  image_url: optionalUrlOrPath,
  display_order: displayOrder,
  published,
});

export const juniorProgramNoticeSchema = z
  .object({
    message: z.string().trim().max(1200).default(""),
    section: z.enum(["page", "tennis", "squash", "other"]).default("tennis"),
    enabled: z.coerce.boolean().default(true),
  })
  .superRefine((notice, context) => {
    if (notice.enabled && notice.message.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a notice message or disable the notice.",
        path: ["message"],
      });
    }
  });

export const committeeMemberSchema = z.object({
  name: z.string().trim().min(1).max(160),
  title: z.string().trim().min(1).max(160).default("Committee Member"),
  photo_url: optionalUrlOrPath,
  bio: optionalText,
  email_alias: optionalText,
  display_order: displayOrder,
  published,
});

export const committeePositionSchema = z.object({
  title: z.string().trim().min(1).max(160),
  display_order: displayOrder,
  published,
  member_id: z
    .string()
    .uuid()
    .optional()
    .nullable()
    .transform((value) => (value ? value : null)),
  is_acting: z.coerce.boolean().default(false),
});

const emailSchema = z.string().trim().email().max(254);

export const contactRoutingSchema = z.object({
  enquiry_type: slug,
  label: z.string().trim().min(1).max(160),
  recipient_email: emailSchema,
  cc_emails: z.array(emailSchema).default([]),
  active: z.coerce.boolean().default(true),
});

export const cmsSchemas = {
  site_pages: sitePageSchema,
  facilities: facilitySchema,
  club_events: clubEventSchema,
  junior_programs: juniorProgramSchema,
  junior_program_notice: juniorProgramNoticeSchema,
  committee_members: committeeMemberSchema,
  committee_positions: committeePositionSchema,
  contact_routing: contactRoutingSchema,
} satisfies Record<CmsTable, z.ZodTypeAny>;

export function parseCmsPayload(table: CmsTable, payload: unknown) {
  return cmsSchemas[table].parse(payload);
}
