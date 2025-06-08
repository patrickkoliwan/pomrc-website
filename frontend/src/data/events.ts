export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isWeekly: boolean;
  price?: string;
}

export const weeklyEvents: Event[] = [
  {
    id: "1",
    title: "Thursday Night Raffle 🎟️",
    description:
      "Try your luck at our June raffle! Every Thursday night, you have a fantastic chance to win a delicious meat tray. Support the club and potentially take home a great prize!",
    date: "Thursday",
    time: "Evening",
    location: "Club Bar",
    isWeekly: true,
    price: "K5 per ticket",
  }
];

export const upcomingEvents: Event[] = [
  {
    id: "2",
    title: "POMRC Open Tournament 🏆",
    description:
      "Get ready for an exclusive and exciting tournament weekend! This is your chance to showcase your skills and compete against fellow members in friendly rivalry. Registration forms are available at the bar - don't miss out on this premier club event!",
    date: "June 20-22, 2024",
    time: "8:00 AM - 6:00 PM",
    location: "POMRC Courts",
    isWeekly: false,
  },
  {
    id: "3",
    title: "State of Origin Game 2 Viewing Party 🏉",
    description:
      "Join us for an exciting night of rugby league! Wear your team colors and cheer on your favorites. Special feature: Fundraising BBQ by our Squashies team. Come support both your team and our club members!",
    date: "June 2024",
    time: "6:00 PM",
    location: "Clubhouse",
    isWeekly: false,
  }
];
