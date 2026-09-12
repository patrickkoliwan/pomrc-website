import { z } from "zod";

const applicantEmailSchema = z.string().email();

export function isValidApplicantEmail(email: string): boolean {
  return applicantEmailSchema.safeParse(email.trim()).success;
}
