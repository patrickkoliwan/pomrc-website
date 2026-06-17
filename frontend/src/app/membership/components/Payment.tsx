import LoadingSpinner from "./LoadingSpinner";
import InfoSection from "./InfoSection";
import DetailGrid from "./DetailGrid";
import { PAYMENT_CONTENT, SECTION_INTROS } from "../content/membership-content";

interface PaymentProps {
  isLoading?: boolean;
  variant?: "full" | "compact" | "borderless";
}

function PaymentDetails() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-dark-teal">
          {PAYMENT_CONTENT.bankTransferHeading}
        </h3>
        <p className="mt-1 text-sm text-dark-teal/80">
          {PAYMENT_CONTENT.bankTransferIntro}
        </p>
        <div className="mt-3">
          <DetailGrid
            rows={PAYMENT_CONTENT.bankDetails}
            valueClassName="font-mono font-semibold text-dark-teal"
          />
        </div>
      </div>

      <div className="border-t border-muted-teal/30 pt-4">
        <p className="text-sm leading-relaxed text-dark-teal/80">
          {PAYMENT_CONTENT.inPerson}
        </p>
      </div>
    </div>
  );
}

export default function Payment({
  isLoading = false,
  variant = "full",
}: PaymentProps) {
  if (isLoading) return <LoadingSpinner />;

  if (variant === "borderless") {
    return <PaymentDetails />;
  }

  if (variant === "compact") {
    return (
      <InfoSection title="Payment Information" intro={SECTION_INTROS.payment}>
        <PaymentDetails />
      </InfoSection>
    );
  }

  return (
    <section className="rounded-lg bg-deep-red p-4 shadow-md sm:p-6">
      <h2 className="mb-4 text-2xl font-semibold text-light-cream sm:text-3xl">
        Payment Information
      </h2>
      <div className="rounded-lg bg-light-cream p-4 sm:p-5">
        <PaymentDetails />
      </div>
    </section>
  );
}
