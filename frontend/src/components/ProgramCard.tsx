import Image from "next/image";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";
import type { JuniorProgram } from "@/data/juniorPrograms";

interface ProgramCardProps {
  program: JuniorProgram;
  isPriority?: boolean;
}

export default function ProgramCard({
  program,
  isPriority = false,
}: ProgramCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative w-full h-48">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-teal/50 to-transparent z-10" />
        <Image
          src={program.imageUrl}
          alt={program.title}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={isPriority}
          loading={isPriority ? undefined : "lazy"}
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-dark-teal mb-3 group-hover:text-deep-red transition-colors duration-300">
          {program.title}
        </h3>

        <p className="text-gray-700 mb-4 min-h-[80px]">{program.description}</p>

        <div className="flex flex-col space-y-2 text-gray-700">
          <div className="flex items-center bg-light-teal/10 py-1.5 px-2 rounded-lg">
            <FaCalendarAlt className="h-5 w-5 mr-3 text-dark-teal" />
            <span className="font-medium text-sm">
              {program.isWeekly ? "Every " : ""}
              {program.date}
            </span>
          </div>

          <div className="flex items-center bg-light-teal/10 py-1.5 px-2 rounded-lg">
            <FaClock className="h-5 w-5 mr-3 text-dark-teal" />
            <span className="font-medium text-sm">{program.time}</span>
          </div>

          <div className="flex items-center bg-light-teal/10 py-1.5 px-2 rounded-lg">
            <FaMapMarkerAlt className="h-5 w-5 mr-3 text-dark-teal" />
            <span className="font-medium text-sm">{program.location}</span>
          </div>

          <div className="flex items-center bg-light-teal/10 py-1.5 px-2 rounded-lg">
            <FaMoneyBillWave className="h-5 w-5 mr-3 text-dark-teal" />
            <span className="font-medium text-sm">{program.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
