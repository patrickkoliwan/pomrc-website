import type { MembershipType } from "@/app/membership/utils/types";

export const membershipTierIds = [
  "FAMILY",
  "SINGLE_ADULT",
  "JUNIORS",
  "SOCIAL",
] as const satisfies readonly MembershipType[];

export type MembershipTierId = (typeof membershipTierIds)[number];

export type MembershipTierRecord = {
  id: MembershipTierId;
  title: string;
  description: string;
  highlights: string[];
  annual_amount: number;
  display_order: number;
  active: boolean;
  updated_at?: string;
};

export type MembershipProrataPeriodRecord = {
  id: string;
  label: string;
  start_month: number;
  start_day: number;
  end_month: number;
  end_day: number;
  active: boolean;
  display_order: number;
  updated_at?: string;
  rates: Partial<Record<MembershipTierId, number>>;
};

export type MembershipPricingConfig = {
  tiers: MembershipTierRecord[];
  periods: MembershipProrataPeriodRecord[];
};

export type ResolvedMembershipPrice = {
  amount: number;
  displayPrice: string;
  periodLabel: string | null;
  isProrata: boolean;
  periodId: string | null;
  quotedPriceLabel: string;
};

export const DEFAULT_MEMBERSHIP_PRICING: MembershipPricingConfig = {
  tiers: [
    {
      id: "FAMILY",
      title: "Family",
      description:
        "Two adults and children aged 18 and under, or up to 21 if in full-time study.",
      highlights: [
        "2 adults + children under 18",
        "Up to 21 if in full-time study",
      ],
      annual_amount: 600,
      display_order: 0,
      active: true,
    },
    {
      id: "SINGLE_ADULT",
      title: "Single Adult",
      description: "For individuals aged 19 years and above.",
      highlights: ["For individuals aged 19 and above"],
      annual_amount: 360,
      display_order: 1,
      active: true,
    },
    {
      id: "JUNIORS",
      title: "Junior",
      description:
        "For those aged 18 and under, or up to 21 if enrolled in full-time study.",
      highlights: ["Aged 18 and under", "Up to 21 if in full-time study"],
      annual_amount: 70,
      display_order: 2,
      active: true,
    },
    {
      id: "SOCIAL",
      title: "Social",
      description:
        "All club benefits and amenities; standard non-member court fees apply for court use.",
      highlights: ["Full club benefits and amenities", "Non-member court fees apply"],
      annual_amount: 180,
      display_order: 3,
      active: true,
    },
  ],
  periods: [],
};

export function formatKinaAmount(amount: number): string {
  const normalized = Number.isInteger(amount)
    ? amount.toFixed(0)
    : amount.toFixed(2);
  return `K${normalized}`;
}

function monthDayValue(month: number, day: number): number {
  return month * 100 + day;
}

export function isDateInProrataPeriod(
  date: Date,
  period: Pick<
    MembershipProrataPeriodRecord,
    "start_month" | "start_day" | "end_month" | "end_day"
  >
): boolean {
  const current = monthDayValue(date.getMonth() + 1, date.getDate());
  const start = monthDayValue(period.start_month, period.start_day);
  const end = monthDayValue(period.end_month, period.end_day);

  if (start <= end) {
    return current >= start && current <= end;
  }

  return current >= start || current <= end;
}

export function resolveMembershipPrice(
  tierId: MembershipTierId,
  config: MembershipPricingConfig,
  date: Date = new Date()
): ResolvedMembershipPrice {
  const tier =
    config.tiers.find((item) => item.id === tierId && item.active) ??
    DEFAULT_MEMBERSHIP_PRICING.tiers.find((item) => item.id === tierId);

  if (!tier) {
    throw new Error(`Unknown membership tier: ${tierId}`);
  }

  const activePeriods = [...config.periods]
    .filter((period) => period.active)
    .sort((a, b) => a.display_order - b.display_order);

  for (const period of activePeriods) {
    if (!isDateInProrataPeriod(date, period)) continue;

    const amount = period.rates[tierId];
    if (amount == null) continue;

    const displayPrice = formatKinaAmount(amount);
    const quotedPriceLabel = `${displayPrice} (${period.label})`;

    return {
      amount,
      displayPrice,
      periodLabel: period.label,
      isProrata: true,
      periodId: period.id,
      quotedPriceLabel,
    };
  }

  const displayPrice = formatKinaAmount(tier.annual_amount);

  return {
    amount: tier.annual_amount,
    displayPrice,
    periodLabel: null,
    isProrata: false,
    periodId: null,
    quotedPriceLabel: displayPrice,
  };
}

export function getTierDisplayContent(
  tier: MembershipTierRecord,
  config: MembershipPricingConfig,
  date: Date = new Date()
) {
  const resolved = resolveMembershipPrice(tier.id, config, date);

  return {
    key: tier.id,
    title: tier.title,
    description: tier.description,
    highlights: tier.highlights,
    price: resolved.displayPrice,
    period: resolved.isProrata
      ? resolved.periodLabel ?? "pro rata"
      : "per year",
    isProrata: resolved.isProrata,
    annualAmount: tier.annual_amount,
  };
}
