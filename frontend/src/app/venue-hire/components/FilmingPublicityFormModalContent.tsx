"use client";

import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormWatch,
  Control,
} from "react-hook-form";
import { FilmingPublicityFormData } from "../utils/filmingPublicitySchema";
import FilmingApplicantInfo from "./FilmingApplicantInfo";
import ProductionDetails from "./ProductionDetails";
import FilmingLocationSelection from "./FilmingLocationSelection";
import PeopleOnGrounds from "./PeopleOnGrounds";
import FilmingTermsAcceptance from "./FilmingTermsAcceptance";
import LoadingSpinner from "./LoadingSpinner";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FilmingPublicityFormModalContentProps {
  register: UseFormRegister<FilmingPublicityFormData>;
  errors: FieldErrors<FilmingPublicityFormData>;
  handleSubmit: UseFormHandleSubmit<FilmingPublicityFormData>;
  watch: UseFormWatch<FilmingPublicityFormData>;
  control: Control<FilmingPublicityFormData>;
  onSubmit: (data: FilmingPublicityFormData) => Promise<void>;
  isSubmitting: boolean;
  isLoading: boolean;
  submitError: string | null;
  onClose: () => void;
}

export default function FilmingPublicityFormModalContent({
  register,
  errors,
  handleSubmit,
  watch,
  control,
  onSubmit,
  isSubmitting,
  isLoading,
  submitError,
  onClose,
}: FilmingPublicityFormModalContentProps) {
  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <FilmingApplicantInfo register={register} errors={errors} />
        <ProductionDetails register={register} errors={errors} />
        <FilmingLocationSelection
          register={register}
          errors={errors}
          watch={watch}
        />
        <PeopleOnGrounds
          register={register}
          errors={errors}
          control={control}
        />
        <FilmingTermsAcceptance register={register} errors={errors} />
      </div>

      {submitError && (
        <p className="text-deep-red text-sm mt-4">Error: {submitError}</p>
      )}

      <DialogFooter className="pt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-deep-red hover:bg-deep-red/80 text-light-cream"
        >
          {isSubmitting ? <LoadingSpinner /> : "Submit Application"}
        </Button>
      </DialogFooter>
    </form>
  );
}
