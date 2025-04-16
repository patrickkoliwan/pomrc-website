export interface JuniorProgram {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isWeekly: boolean;
  price: string;
  imageUrl: string;
}

export const juniorPrograms: JuniorProgram[] = [
  {
    id: "saturday-beginners-squash",
    title: "Saturday Beginners Squash",
    description:
      "Introduction to squash for junior players. Learn the basics of the game in a fun and supportive environment.",
    date: "Saturday",
    time: "8:00 AM",
    location: "Squash Courts",
    isWeekly: true,
    price: "K10 per child",
    imageUrl: "/images/junior-programs/squash-beginners.jpg", // Placeholder image path
  },
  {
    id: "saturday-junior-tennis",
    title: "Saturday Junior Tennis",
    description:
      "Combined Saturday tennis program. Beginners (Red Ball) focus on fundamentals, while Intermediate & Advanced players work on technique and match play.",
    date: "Saturday",
    time: "Beginners (Red Ball): 8:00 AM - 9:30 AM | Intermediate & Advanced: 9:30 AM - 11:00 AM",
    location: "Tennis Courts",
    isWeekly: true,
    price: "K10 per child",
    imageUrl: "/images/junior-programs/tennis-red-ball.jpg", // Reusing beginners image for now
  },
  {
    id: "wednesday-teenage-tennis",
    title: "Wednesday Teenage Tennis",
    description:
      "Tennis program specifically designed for teenagers (ages 12-18) who are new to the sport.",
    date: "Wednesday",
    time: "4:00 PM - 5:00 PM",
    location: "Tennis Courts",
    isWeekly: true,
    price: "K10 per child",
    imageUrl: "/images/junior-programs/teenage-tennis.jpg", // Placeholder image path
  },
  {
    id: "tuesday-thursday-junior-tennis",
    title: "Tuesday & Thursday Junior Tennis",
    description:
      "Twice-weekly junior tennis covering fundamentals for beginners and technique/strategy for advanced players.",
    date: "Tuesday & Thursday",
    time: "Beginners: 4:00 PM - 5:00 PM | Advanced: 5:00 PM - 6:00 PM",
    location: "Tennis Courts",
    isWeekly: true,
    price: "K10 per child",
    imageUrl: "/images/junior-programs/tennis-beginners.jpg", // Reusing beginners image
  },
];
