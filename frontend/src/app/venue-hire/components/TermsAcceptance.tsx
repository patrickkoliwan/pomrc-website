"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "../page"; // Assuming FormData type is exported from page

interface TermsAcceptanceProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  hasAcceptedFullTerms: boolean;
  onReadFullTerms: () => void;
  isLoading?: boolean;
}

export default function TermsAcceptance({
  register,
  errors,
  hasAcceptedFullTerms,
  onReadFullTerms,
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
        <div className="space-y-2">
          <label htmlFor="termsAccepted" className="text-sm text-dark-teal">
            I have read and agree to the terms and conditions. I understand that
            failure to comply with these terms may result in forfeiture of the
            bond fee.
          </label>
          <div>
            <button
              type="button"
              onClick={onReadFullTerms}
              className="text-sm text-deep-red underline hover:text-muted-teal transition-colors"
            >
              Read full terms and conditions
            </button>
            {hasAcceptedFullTerms && (
              <span className="ml-2 text-sm text-dark-teal">
                Full terms accepted.
              </span>
            )}
          </div>
        </div>
      </div>
      {errors.termsAccepted && (
        <p className="text-deep-red text-sm ml-6">
          {errors.termsAccepted.message as string}
        </p>
      )}
    </div>
  );
}
