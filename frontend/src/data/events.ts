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
    title: "Social Tennis Doubles Night 🎾",
    description:
      "Experience the thrill of doubles tennis in a fun, social atmosphere! Whether you bring your partner or let us match you up, you'll enjoy competitive play and great company. Perfect for all skill levels - come make new friends and improve your game!",
    date: "Tuesday & Thursday",
    time: "6:00 PM - 8:00 PM",
    location: "Main Tennis Courts",
    isWeekly: true,
    price: "K20 per person",
  },
  {
    id: "2",
    title: "Mojo Food Co. Speed Squash ⚡",
    description:
      "Get ready for fast-paced, heart-pumping action at our Speed Squash nights! Whether you're a beginner or pro, this high-energy session welcomes all players. Experience the excitement of rapid-fire matches and improve your skills in a supportive environment!",
    date: "Thursday",
    time: "6:00 PM",
    location: "Squash Courts",
    isWeekly: true,
    price: "K15 per person",
  },
  {
    id: "3",
    title: "POMRC Juniors Breakfast 🍳",
    description:
      "Start your weekend right with our amazing Junior Breakfast! Indulge in freshly brewed coffee, refreshing slushies, delicious baked goods, crispy waffles, and mouth-watering hotdogs and hamburgers. Best part? Your enjoyment helps support our junior tennis and squash programs!",
    date: "Saturday",
    time: "8am - Midday",
    location: "Hauswin",
    isWeekly: true,
  },
  {
    id: "4",
    title: "Live Music Nights 🎵",
    description:
      "End your week on a high note with Port Moresby's finest musicians! Our weekend live music sessions feature the city's most talented bands and performers, creating the perfect atmosphere for a memorable evening. Members enjoy free entry (gate fees may apply for non-members on special nights). Check socials to see who we have on next!",
    date: "Friday & Saturday",
    time: "Evening",
    location: "Clubhouse",
    isWeekly: true,
  },
];

export const upcomingEvents: Event[] = [
  {
    id: "5",
    title: "Junior Club Challenge Series 🏆",
    description:
      "Watch the future stars of tennis shine in our exciting Junior Club Challenge Series! Young talents will compete in this monthly tournament, showcasing their skills and determination. Come support our junior athletes as they battle for the championship!",
    date: "April 25, 2024",
    time: "TBA",
    location: "Tennis Courts",
    isWeekly: false,
  },
  {
    id: "6",
    title: "Club Squash Competition 🎯",
    description:
      "Don't miss this thrilling squash tournament featuring open mixed and U18 mixed categories! Experience intense matches, spectacular rallies, and fierce competition as players vie for the top spots. Perfect for participants and spectators alike!",
    date: "April 5, 2024",
    time: "3:00 PM",
    location: "Squash Courts",
    isWeekly: false,
  },
  {
    id: "7",
    title: "Squash Fundraiser Disco 💃",
    description:
      "Get your dancing shoes ready for an unforgettable night! Join us for a fantastic disco fundraiser supporting our junior squash players as they prepare for the QLD Junior Championships. Great music, amazing atmosphere, and a worthy cause - what's not to love? Gate fee applies.",
    date: "May 2, 2024",
    time: "Evening",
    location: "Club Arena",
    isWeekly: false,
  },
  {
    id: "8",
    title: "Squash Movie Night Fundraiser 🎬",
    description:
      "Join us for a special movie night at the squash arena! Bring your family and friends for an evening of entertainment while supporting our junior squash champions. All proceeds go towards the QLD Junior Championships. Everyone's welcome!",
    date: "May 10, 2024",
    time: "Evening",
    location: "Squash Arena",
    isWeekly: false,
  },
];
