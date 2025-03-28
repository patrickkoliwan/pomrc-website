import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import Modal from "./Modal";
import { FormData } from "../page";

interface TermsAndConditionsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isLoading?: boolean;
}

export default function TermsAndConditions({
  register,
  errors,
  isLoading = false,
}: TermsAndConditionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-teal mb-4">
        Key Terms and Conditions
      </h2>
      <div className="space-y-6">
        {/* Key Points */}
        <div className="prose prose-sm max-w-none text-dark-teal">
          <div className="bg-light-teal p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-dark-teal">Important Points:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Bond Fee (K500.00) is refundable subject to compliance with
                terms
              </li>
              <li>All drinks must be purchased at the POMRC Club Bar</li>
              <li>Maximum capacity is 200 guests</li>
              <li>Venue must be vacated by designated ending time</li>
              <li>No outside food or drinks allowed</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-deep-red hover:text-muted-teal transition-colors text-sm underline"
          >
            Read Full Terms and Conditions
          </button>
        </div>

        {/* Terms Acceptance */}
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="termsAccepted"
            {...register("termsAccepted")}
            className="mt-1 text-dark-teal focus:ring-dark-teal"
          />
          <label htmlFor="termsAccepted" className="text-sm text-dark-teal">
            I have read and agree to the terms and conditions. I understand that
            failure to comply with these terms may result in forfeiture of the
            bond fee.
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="text-deep-red text-sm">
            {errors.termsAccepted.message as string}
          </p>
        )}

        <p className="text-dark-teal mb-4">
          The hirer agrees to &ldquo;make good&rdquo; any damage caused to the
          facility during the hire period.
        </p>
      </div>

      {/* Full Terms Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Full Terms and Conditions"
      >
        <div className="prose prose-sm max-w-none text-dark-teal">
          <p className="font-medium mb-2">
            Bond Fee refundable subject to Terms and Conditions of this venue
            hire form being adhered to:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Area hired left tidy with no damage.</li>
            <li>Published Club Rules on Gate entrance adhered to.</li>
            <li>
              All alcoholic and non-alcoholic drinks being purchased at the Bar.
            </li>
            <li>Venue being vacated by designated ending time.</li>
          </ul>

          <ol className="list-decimal list-inside space-y-2">
            <li>
              All guests must be screened at the Club Boom gate entrance before
              entering through the POMRC Function gate. Not the Members Access
              gate.
            </li>
            <li>
              All guests are required to stay within the designated area that
              has been booked.
            </li>
            <li>
              All guests must observe cleanliness & use the toilet block
              adjacent to the car park.
            </li>
            <li>
              Guests who act in a drunken or disorderly manner will be removed
              from the club premises by security. The Hirer is responsible for
              any damage caused to POMRC properties & the Bond fee will not be
              refunded.
            </li>
            <li>
              The Hirer (Event organisers) are responsible for ensuring good
              behavior and conduct throughout the event and while their guests
              remain on POMRC property.
            </li>
            <li>
              Purchases from The Bar will be on a "pay as you go" basis only.
              Credit is not allowed.
            </li>
            <li>
              All alcoholic & non-alcoholic drinks are TO BE PURCHASED AT THE
              POMRC CLUB BAR – the Bond fee will be forfeited if ANY outside
              alcoholic or non-alcoholic drinks are brought into the club.
            </li>
            <li>
              Functions continuing AFTER designated end time knowingly forfeit
              their Bond as a late stay fee.
            </li>
            <li>
              The hiring party shall assign and advise the name and mobile
              contact of a representative who will be always present during the
              whole duration of the event and responsible for the event, and the
              guests ensuring all music and other noise is not excessive and
              that guests vacate the premises at the end of the function.
            </li>
            <li>
              Please observe that the Haus Wins in front of the Bar & Kitchen
              are reserved for Members only.
            </li>
            <li>
              Club Management will not be liable for damage or loss of property
              belonging to your guests while on the premises.
            </li>
            <li>
              Events with more than 200 people subject to committee approval.
            </li>
            <li>
              Cancellation and refund of full amount of payment for the venue
              hire up to three (3) days prior the event booking. No refund if
              the cancellation is less than three (3) days.
            </li>
            <li>
              Please do not use the following to affix your decorations, banners
              etc. to POMRC Property:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>
                  Double sided white sticky tape / brown adhesive masking/
                  sticky tape / Adhesive cable tie mounts.
                </li>
              </ul>
              <p className="ml-4 mt-1">You can use the following:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Blu tack / Clear sticky tap/ Cable ties and rope</li>
              </ul>
              <p className="ml-4 mt-1">
                Please DO NOT attach or cover any POMRC and Sponsors paid
                signage.
              </p>
            </li>
            <li>
              Chewing of betelnut (buai) is prohibited in the Club and for any
              Function Hire.
            </li>
          </ol>
        </div>
      </Modal>
    </section>
  );
}
