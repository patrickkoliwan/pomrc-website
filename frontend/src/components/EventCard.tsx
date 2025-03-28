import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isWeekly: boolean;
  price?: string;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white border-3 border-dark-teal rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="bg-dark-teal p-5">
        <h3 className="text-xl font-bold text-light-cream">{event.title}</h3>
      </div>

      <div className="p-6 bg-gradient-to-b from-light-teal/20 to-white">
        <p className="text-gray-700 mb-4 min-h-[80px]">{event.description}</p>

        <div className="flex flex-col space-y-1 text-gray-700">
          <div className="flex items-center bg-light-teal/10 py-1.5 px-2 rounded-lg">
            <FaCalendarAlt className="h-5 w-5 mr-3 text-dark-teal" />
            <span className="font-medium text-sm">
              {event.isWeekly ? "Every " : ""}
              {event.date}
            </span>
          </div>

          <div className="flex items-center bg-light-teal/10 py-1.5 px-2 rounded-lg">
            <FaClock className="h-5 w-5 mr-3 text-dark-teal" />
            <span className="font-medium text-sm">{event.time}</span>
          </div>

          <div className="flex items-center bg-light-teal/10 py-1.5 px-2 rounded-lg">
            <FaMapMarkerAlt className="h-5 w-5 mr-3 text-dark-teal" />
            <span className="font-medium text-sm">{event.location}</span>
          </div>

          {event.price && (
            <div className="flex items-center bg-light-teal/10 py-1.5 px-2 rounded-lg">
              <FaMoneyBillWave className="h-5 w-5 mr-3 text-dark-teal" />
              <span className="font-medium text-sm">{event.price}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
