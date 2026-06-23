"use client";

import LoadingSpinner from "./LoadingSpinner";
import InfoSection from "./InfoSection";
import DetailGrid from "./DetailGrid";
import { PAYMENT_CONTENT, SECTION_INTROS } from "../content/membership-content";
import { useMembershipPricing } from "./MembershipPricingProvider";
import type { MembershipType } from "../utils/types";

interface PaymentProps {
  isLoading?: boolean;
  variant?: "full" | "compact" | "borderless";
  membershipType?: MembershipType;
}

function PaymentDetails({
  membershipType,
}: {
  membershipType?: MembershipType;
}) {
  const { resolvePrice } = useMembershipPricing();
  const quotedPrice = membershipType
    ? resolvePrice(membershipType)
    : null;

  return (
    <div className="space-y-4">
      {quotedPrice && (
        <div className="rounded-md border border-dark-teal/20 bg-light-teal p-4">
          <p className="text-sm font-semibold text-dark-teal">
            Amount due for selected membership
          </p>
          <p className="mt-1 text-2xl font-bold text-deep-red">
            {quotedPrice.displayPrice}
          </p>
          {quotedPrice.isProrata && quotedPrice.periodLabel && (
            <p className="mt-1 text-sm text-dark-teal/70">
              {quotedPrice.periodLabel}
            </p>
          )}
        </div>
      )}

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
  membershipType,
}: PaymentProps) {
  if (isLoading) return <LoadingSpinner />;

  if (variant === "borderless") {
    return <PaymentDetails membershipType={membershipType} />;
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
        <PaymentDetails membershipType={membershipType} />
      </div>
    </section>
  );
}
