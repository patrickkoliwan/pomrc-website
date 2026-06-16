import { z } from "zod";

const phonePattern = /^[+\d\s()-]+$/;

export function isValidPhoneOrEmail(value: string) {
  const trimmedValue = value.trim();
  const emailResult = z.string().email().safeParse(trimmedValue);

  if (emailResult.success) {
    return true;
  }

  const digitCount = trimmedValue.replace(/\D/g, "").length;
  return phonePattern.test(trimmedValue) && digitCount >= 7;
}

