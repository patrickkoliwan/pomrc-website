import InfoSection from "./InfoSection";
import {
  MEMBERSHIP_TIERS,
  SECTION_INTROS,
} from "../content/membership-content";

export default function PricingTierCards() {
  return (
    <InfoSection title="Membership Categories" intro={SECTION_INTROS.categories}>
      <div className="divide-y divide-muted-teal/30 sm:grid sm:grid-cols-2 sm:gap-3 sm:divide-y-0 lg:grid-cols-4">
        {MEMBERSHIP_TIERS.map((tier) => (
          <div
            key={tier.key}
            className="py-4 first:pt-0 last:pb-0 sm:flex sm:h-full sm:flex-col sm:rounded-lg sm:bg-light-teal sm:p-4 sm:py-4"
          >
            <div className="flex items-start justify-between gap-4 sm:block">
              <h3 className="text-base font-semibold text-dark-teal sm:text-lg">
                {tier.title}
              </h3>
              <div className="shrink-0 text-right sm:mt-2 sm:text-left">
                <span className="text-xl font-bold text-deep-red sm:text-2xl">
                  {tier.price}
                </span>
                <span className="mt-0.5 block text-xs text-dark-teal/70 sm:ml-1 sm:mt-0 sm:inline sm:text-sm">
                  {tier.period}
                </span>
              </div>
            </div>

            <ul className="mt-2 space-y-0.5 text-sm leading-relaxed text-dark-teal/80 sm:mt-3 sm:list-outside sm:list-disc sm:space-y-1 sm:pl-4">
              {tier.highlights.map((highlight) => (
                <li key={highlight} className="list-none sm:list-item">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </InfoSection>
  );
}
