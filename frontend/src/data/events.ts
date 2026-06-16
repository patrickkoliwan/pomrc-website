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
      "Try your luck at our weekly raffle! Every Thursday night, you have a fantastic chance to win a delicious meat tray. Support the club and potentially take home a great prize!",
    date: "Thursday",
    time: "Evening",
    location: "Club Bar",
    isWeekly: true,
    price: "K5 per ticket",
  }
];

export const upcomingEvents: Event[] = [];
