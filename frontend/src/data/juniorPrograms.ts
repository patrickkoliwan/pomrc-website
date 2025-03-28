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
    id: "saturday-beginners-tennis",
    title: "Saturday Beginners Tennis (Red Ball)",
    description:
      "Perfect for young beginners starting their tennis journey. Using red balls for easier learning.",
    date: "Saturday",
    time: "8:00 AM - 9:30 AM",
    location: "Tennis Courts",
    isWeekly: true,
    price: "K10 per child",
    imageUrl: "/images/junior-programs/tennis-red-ball.jpg", // Placeholder image path
  },
  {
    id: "saturday-advanced-tennis",
    title: "Saturday Intermediate & Advanced Tennis",
    description:
      "For progressing players using green and yellow balls. Focus on technique and match play.",
    date: "Saturday",
    time: "9:30 AM - 11:00 AM",
    location: "Tennis Courts",
    isWeekly: true,
    price: "K10 per child",
    imageUrl: "/images/junior-programs/tennis-advanced.jpg", // Placeholder image path
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
    id: "tuesday-thursday-beginners",
    title: "Tuesday & Thursday Beginners Tennis",
    description:
      "Twice-weekly tennis program for beginners, focusing on fundamental skills and fun.",
    date: "Tuesday & Thursday",
    time: "4:00 PM - 5:00 PM",
    location: "Tennis Courts",
    isWeekly: true,
    price: "K10 per child",
    imageUrl: "/images/junior-programs/tennis-beginners.jpg", // Placeholder image path
  },
  {
    id: "tuesday-thursday-advanced",
    title: "Tuesday & Thursday Advanced Tennis",
    description:
      "Advanced tennis training sessions focusing on technique, strategy, and match play.",
    date: "Tuesday & Thursday",
    time: "5:00 PM - 6:00 PM",
    location: "Tennis Courts",
    isWeekly: true,
    price: "K10 per child",
    imageUrl: "/images/junior-programs/tennis-advanced-2.jpg", // Placeholder image path
  },
];
