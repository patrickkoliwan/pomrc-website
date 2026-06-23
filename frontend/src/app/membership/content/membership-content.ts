export interface DetailRowContent {
  label: string;
  value: string;
  note?: string;
}

export interface FeeGroupContent {
  heading: string;
  rows: DetailRowContent[];
}

export interface AccessPanelContent {
  heading: string;
  points: string[];
}

export const COURT_USE_FEE_GROUPS: FeeGroupContent[] = [
  {
    heading: "Non-members",
    rows: [
      {
        label: "Court use (all courts)",
        value: "K40/person/hour",
        note: "When receiving private coaching, the full court fee applies in addition to coaching fees.",
      },
    ],
  },
  {
    heading: "Members",
    rows: [
      {
        label: "Court use (all courts)",
        value: "K10/person/hour",
      },
    ],
  },
  {
    heading: "Junior members",
    rows: [
      {
        label: "Court use",
        value: "No fee",
      },
      {
        label: "Lighting after dark",
        value: "K20/person/hour",
      },
    ],
  },
];

export const LIGHTING_FEE_ROWS: DetailRowContent[] = [
  {
    label: "All users, all courts",
    value: "K20/person/hour",
  },
];

export const CLUB_ACCESS_PANELS: AccessPanelContent[] = [
  {
    heading: "Members",
    points: [
      "Personal key card issued for entry",
      "Access to club and amenities during opening hours",
    ],
  },
  {
    heading: "Non-members",
    points: [
      "Must be signed in by a financial member",
      "Access limited to guest facilities",
    ],
  },
];

export const PAYMENT_CONTENT = {
  bankTransferHeading: "Bank transfer",
  bankTransferIntro: "Pay direct to BSP Waigani Banking Centre",
  bankDetails: [
    { label: "Account name", value: "Port Moresby Tennis Club" },
    { label: "BSB", value: "8202" },
    { label: "Account number", value: "1000583581" },
    { label: "Reference", value: "Your name" },
  ] as DetailRowContent[],
  inPerson:
    "EFTPOS or cash payment at the bar. A receipt will be issued upon payment.",
};

export const SECTION_INTROS = {
  categories: "Annual membership fees.",
  policy: "Court use, lighting, and club entry rules.",
  payment: "Pay your membership fee after your application is approved.",
};
