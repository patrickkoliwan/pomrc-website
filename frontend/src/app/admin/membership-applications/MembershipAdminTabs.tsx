"use client";

import { useState } from "react";
import type { MembershipApplicationRecord } from "@/lib/membership/types";
import type { MembershipPricingConfig } from "@/lib/membership/pricing-types";
import MembershipApplicationsManager from "./MembershipApplicationsManager";
import MembershipPricingEditor from "./MembershipPricingEditor";

type AdminTab = "applications" | "pricing";

export default function MembershipAdminTabs({
  applications,
  pricing,
}: {
  applications: MembershipApplicationRecord[];
  pricing: MembershipPricingConfig;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("applications");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-muted-teal/30 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("applications")}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "applications"
              ? "bg-dark-teal text-light-cream"
              : "border border-muted-teal/40 text-dark-teal hover:bg-light-teal"
          }`}
        >
          Applications
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pricing")}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "pricing"
              ? "bg-dark-teal text-light-cream"
              : "border border-muted-teal/40 text-dark-teal hover:bg-light-teal"
          }`}
        >
          Pricing
        </button>
      </div>

      {activeTab === "applications" ? (
        <MembershipApplicationsManager applications={applications} />
      ) : (
        <MembershipPricingEditor initialConfig={pricing} />
      )}
    </div>
  );
}
