"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import InfoSection from "./InfoSection";
import DetailGrid from "./DetailGrid";
import {
  CLUB_ACCESS_PANELS,
  COURT_USE_FEE_GROUPS,
  LIGHTING_FEE_ROWS,
  SECTION_INTROS,
} from "../content/membership-content";

interface AccordionItemProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function AccordionItem({
  title,
  defaultOpen = false,
  children,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-muted-teal/30 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-md py-3 text-left hover:bg-light-teal/50"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-dark-teal">{title}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-teal transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="pb-4 pt-1">{children}</div>}
    </div>
  );
}

function FeeGroupPanel({
  heading,
  rows,
}: {
  heading: string;
  rows: (typeof COURT_USE_FEE_GROUPS)[number]["rows"];
}) {
  return (
    <div className="rounded-lg bg-light-teal p-4">
      <h4 className="mb-2 text-sm font-semibold text-dark-teal">{heading}</h4>
      <DetailGrid rows={rows} />
    </div>
  );
}

export default function PolicyAccordions() {
  return (
    <InfoSection title="Court Fees & Access Policy" intro={SECTION_INTROS.policy}>
      <AccordionItem title="Court Use Fees" defaultOpen>
        <div className="space-y-3">
          {COURT_USE_FEE_GROUPS.map((group) => (
            <FeeGroupPanel
              key={group.heading}
              heading={group.heading}
              rows={group.rows}
            />
          ))}
        </div>
      </AccordionItem>

      <AccordionItem title="Lighting Fees (Night Sessions)">
        <div className="rounded-lg bg-light-teal p-4">
          <DetailGrid rows={LIGHTING_FEE_ROWS} />
        </div>
      </AccordionItem>

      <AccordionItem title="Club Access">
        <div className="grid gap-4 sm:grid-cols-2">
          {CLUB_ACCESS_PANELS.map((panel) => (
            <div
              key={panel.heading}
              className="rounded-lg bg-light-teal p-4"
            >
              <h4 className="mb-2 text-sm font-semibold text-dark-teal">
                {panel.heading}
              </h4>
              <ul className="list-outside list-disc space-y-1 pl-4 text-sm leading-relaxed text-dark-teal/80">
                {panel.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </AccordionItem>
    </InfoSection>
  );
}
