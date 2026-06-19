import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FilmingPublicityFormData } from "../utils/filmingPublicitySchema";

interface FilmingTermsAcceptanceProps {
  register: UseFormRegister<FilmingPublicityFormData>;
  errors: FieldErrors<FilmingPublicityFormData>;
}

const acknowledgementItems = [
  {
    key: "feesAcknowledged" as const,
    label:
      "I understand application fees are K500 (half day) or K1,000 (full day), with a damages liability bond of 50% incorporated in the application fee.",
  },
  {
    key: "damagesAndTidyAcknowledged" as const,
    label:
      "I accept responsibility for leaving the area clean and tidy, and for restoring and paying for any repairs if the location is changed or damaged.",
  },
  {
    key: "insuranceAcknowledged" as const,
    label:
      "I will provide a valid public liability insurance certificate before approval is granted.",
  },
  {
    key: "committeeApprovalAcknowledged" as const,
    label:
      "I understand that all filming, photography, and media for commercial or publicity purposes (including newspaper, television, and social media) requires prior approval by the POMRC Committee Executive.",
  },
];

export default function FilmingTermsAcceptance({
  register,
  errors,
}: FilmingTermsAcceptanceProps) {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-teal mb-4">
        Acknowledgements
      </h2>

      <div className="space-y-4">
        {acknowledgementItems.map((item) => (
          <label key={item.key} className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register(`acknowledgements.${item.key}`)}
              className="mt-1 rounded border-gray-300 text-dark-teal focus:ring-dark-teal"
            />
            <span className="text-sm text-dark-teal">{item.label}</span>
          </label>
        ))}
      </div>

      {(errors.acknowledgements?.feesAcknowledged ||
        errors.acknowledgements?.damagesAndTidyAcknowledged ||
        errors.acknowledgements?.insuranceAcknowledged ||
        errors.acknowledgements?.committeeApprovalAcknowledged) && (
        <div className="mt-3 space-y-1">
          {[
            errors.acknowledgements?.feesAcknowledged,
            errors.acknowledgements?.damagesAndTidyAcknowledged,
            errors.acknowledgements?.insuranceAcknowledged,
            errors.acknowledgements?.committeeApprovalAcknowledged,
          ].map(
            (err, i) =>
              err?.message && (
                <p key={i} className="text-deep-red text-sm">
                  {err.message}
                </p>
              )
          )}
        </div>
      )}
    </section>
  );
}
