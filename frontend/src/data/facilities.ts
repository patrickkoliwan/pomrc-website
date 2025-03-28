export interface Facility {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export const facilities: Facility[] = [
  {
    id: "southern-courts",
    title: "Southern Tennis Courts (1-4)",
    description:
      "Experience the perfect game on our beautifully terraced synthetic grass courts. These four premium courts offer professional-grade synthetic grass surfaces for both casual matches and competitive play.",
    imageUrl: "/southern-courts.jpg",
  },
  {
    id: "northern-courts",
    title: "Northern Tennis Courts (5-7)",
    description:
      "Enjoy seamless gameplay on our three immaculately maintained synthetic grass courts, facing the northern carpark. Set on a single level, these courts provide the ideal setting for both practice sessions and thrilling matches.",
    imageUrl: "/northern-courts.jpg",
  },
  {
    id: "squash-courts",
    title: "Squash Courts (1-3)",
    description:
      "Step into our prestigious glass-backed squash courts, proud venue of the 2015 Pacific Games. These three professional courts feature excellent spectator viewing and are equipped with fans for player comfort.",
    imageUrl: "/squash-courts.jpg",
  },
  {
    id: "amenities",
    title: "Amenities",
    description:
      "Refresh and rejuvenate in our members-only facilities. Featuring changing rooms, lockers, toilet and shower facilities - everything you need for a comfortable club experience.",
    imageUrl: "/amenities.jpg",
  },
  {
    id: "clubhouse",
    title: "Clubhouse",
    description:
      "Unwind in our charming clubhouse, where rustic charm meets modern comfort. Featuring a fully serviced bar and outdoor seating, it's the perfect spot to relax after a game or catch up with fellow members.",
    imageUrl: "/clubhouse.jpg",
  },
  {
    id: "hauswin",
    title: "Hauswin Seating",
    description:
      "Experience our PNG style hauswin spaces adjacent to the events lawn. These covered benches offer a perfect vantage point to watch the action on courts 1-3, combining local charm with practical comfort.",
    imageUrl: "/hauswin.jpg",
  },
  {
    id: "events-lawn",
    title: "Events Lawn",
    description:
      "Transform your special occasions into memorable celebrations on our spacious events lawn. Perfect for hosting up to 200 guests, this versatile space creates a great backdrop for birthday parties, corporate events, and social gatherings.",
    imageUrl: "/events-lawn.jpg",
  },
  {
    id: "squash-courtyard",
    title: "Squash Courtyard",
    description:
      "Discover our hidden gem - an intimate courtyard perfect for private gatherings of up to 50 people. Adjacent to the squash courts, this charming space offers a secluded setting for small events and social meetups.",
    imageUrl: "/squash-courtyard.jpg",
  },
  {
    id: "playground",
    title: "Children's Play Area",
    description:
      "Keep the little ones entertained in our delightful children's area. Complete with a playhouse and swingset, it's the perfect spot for young families to enjoy while parents stay active at the club.",
    imageUrl: "/playground.jpg",
  },
  {
    id: "basketball",
    title: "Basketball & Practice Wall",
    description:
      "Perfect your forehand or shoot some hoops at our multi-purpose practice area. Featuring a half-court basketball setup and a dedicated hitting wall, it's ideal for both tennis practice and casual basketball games.",
    imageUrl: "/basketball.jpg",
  },
];
