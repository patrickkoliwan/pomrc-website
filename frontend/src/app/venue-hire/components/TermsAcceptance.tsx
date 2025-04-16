"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "../page"; // Assuming FormData type is exported from page

interface TermsAcceptanceProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isLoading?: boolean;
}

export default function TermsAcceptance({
  register,
  errors,
  isLoading = false,
}: TermsAcceptanceProps) {
  if (isLoading) return null; // Don't show acceptance checkbox while loading

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="termsAccepted"
          {...register("termsAccepted")}
          className="mt-1 text-dark-teal focus:ring-dark-teal border-dark-teal/50 rounded"
          disabled={isLoading}
        />
        <label htmlFor="termsAccepted" className="text-sm text-dark-teal">
          I have read and agree to the terms and conditions. I understand that
          failure to comply with these terms may result in forfeiture of the
          bond fee.
        </label>
      </div>
      {errors.termsAccepted && (
        <p className="text-deep-red text-sm ml-6">
          {errors.termsAccepted.message as string}
        </p>
      )}
    </div>
  );
}
