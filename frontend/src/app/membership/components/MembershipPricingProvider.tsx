"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MembershipType } from "@/app/membership/utils/types";
import {
  getTierDisplayContent,
  resolveMembershipPrice,
  type MembershipPricingConfig,
  type MembershipTierId,
  type ResolvedMembershipPrice,
} from "@/lib/membership/pricing-types";

type MembershipPricingContextValue = {
  config: MembershipPricingConfig;
  getTierContent: (tierId: MembershipTierId) => ReturnType<
    typeof getTierDisplayContent
  >;
  resolvePrice: (tierId: MembershipType) => ResolvedMembershipPrice;
};

const MembershipPricingContext =
  createContext<MembershipPricingContextValue | null>(null);

export function MembershipPricingProvider({
  config,
  children,
}: {
  config: MembershipPricingConfig;
  children: ReactNode;
}) {
  const value: MembershipPricingContextValue = {
    config,
    getTierContent: (tierId) => {
      const tier =
        config.tiers.find((item) => item.id === tierId && item.active) ??
        config.tiers.find((item) => item.id === tierId);
      if (!tier) {
        throw new Error(`Unknown membership tier: ${tierId}`);
      }
      return getTierDisplayContent(tier, config);
    },
    resolvePrice: (tierId) => resolveMembershipPrice(tierId, config),
  };

  return (
    <MembershipPricingContext.Provider value={value}>
      {children}
    </MembershipPricingContext.Provider>
  );
}

export function useMembershipPricing() {
  const context = useContext(MembershipPricingContext);
  if (!context) {
    throw new Error(
      "useMembershipPricing must be used within MembershipPricingProvider"
    );
  }
  return context;
}
