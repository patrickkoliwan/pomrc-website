export interface HireVenue {
  id: "events-lawn" | "squash-courtyard";
  title: string;
  description: string;
  imageUrl: string;
  features?: string[];
  capacity: string;
}

export const hireVenues: HireVenue[] = [
  {
    id: "events-lawn",
    title: "Events Lawn",
    description: "Outdoor venue for up to 200 guests",
    imageUrl: "/events-lawn.jpg",
    features: [
      "Spacious outdoor setting",
      "Perfect for large events",
      "BBQ facilities available",
      "Capacity: up to 200 guests",
    ],
    capacity: "Up to 200 guests",
  },
  {
    id: "squash-courtyard",
    title: "Squash Courtyard",
    description: "Intimate courtyard for up to 50 guests",
    imageUrl: "/squash-courtyard.jpg",
    features: [
      "Cozy courtyard setting",
      "Perfect for intimate events",
      "Adjacent to squash courts",
      "Capacity: up to 50 guests",
    ],
    capacity: "Up to 50 guests",
  },
];

export function getHireVenueLabel(id: string): string {
  return hireVenues.find((v) => v.id === id)?.title ?? id;
}
