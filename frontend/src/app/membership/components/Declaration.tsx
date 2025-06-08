import { UseFormRegister, FieldErrors } from "react-hook-form";
import LoadingSpinner from "./LoadingSpinner";
import type { MembershipFormData } from "../utils/types";

interface DeclarationProps {
  register: UseFormRegister<MembershipFormData>;
  errors: FieldErrors<MembershipFormData>;
  isLoading?: boolean;
}

export default function Declaration({
  register,
  errors,
  isLoading = false,
}: DeclarationProps) {
  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-teal mb-4">
        Declaration
      </h2>
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="declaration"
            {...register("declaration")}
            className="mt-1 text-dark-teal focus:ring-dark-teal"
          />
          <label htmlFor="declaration" className="text-sm text-dark-teal">
            I declare that the information provided in this application is true
            and correct. I agree to abide by the Club Constitution and By-Laws
            and understand that my application is subject to Committee approval.
          </label>
        </div>
        {errors.declaration && (
          <p className="text-deep-red text-sm">
            {errors.declaration.message as string}
          </p>
        )}
      </div>
    </section>
  );
}
