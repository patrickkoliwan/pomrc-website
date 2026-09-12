"use client";

import { useState } from "react";
import type { FilmingApplicationRecord } from "@/lib/venue-applications/types";
import type { VenueHireApplicationRecord } from "@/lib/venue-applications/types";
import VenueHireApplicationsManager from "./VenueHireApplicationsManager";
import FilmingApplicationsManager from "./FilmingApplicationsManager";

type AdminTab = "venue-hire" | "filming";

export default function VenueApplicationsTabs({
  venueHireApplications,
  filmingApplications,
}: {
  venueHireApplications: VenueHireApplicationRecord[];
  filmingApplications: FilmingApplicationRecord[];
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("venue-hire");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-muted-teal/30 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("venue-hire")}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "venue-hire"
              ? "bg-dark-teal text-light-cream"
              : "border border-muted-teal/40 text-dark-teal hover:bg-light-teal"
          }`}
        >
          Venue Hire Requests
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("filming")}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "filming"
              ? "bg-dark-teal text-light-cream"
              : "border border-muted-teal/40 text-dark-teal hover:bg-light-teal"
          }`}
        >
          Filming Applications
        </button>
      </div>

      {activeTab === "venue-hire" ? (
        <VenueHireApplicationsManager applications={venueHireApplications} />
      ) : (
        <FilmingApplicationsManager applications={filmingApplications} />
      )}
    </div>
  );
}
