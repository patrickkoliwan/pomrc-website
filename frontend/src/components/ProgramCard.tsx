import Image from "next/image";
import type { ReactNode } from "react";
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

function FormattedText({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex}>
          {lineIndex > 0 && <br />}
          {formatBoldSegments(line)}
        </span>
      ))}
    </>
  );
}

function formatBoldSegments(text: string) {
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const start = remaining.indexOf("**");

    if (start === -1) {
      parts.push(remaining);
      break;
    }

    const end = remaining.indexOf("**", start + 2);

    if (end === -1) {
      parts.push(remaining);
      break;
    }

    if (start > 0) {
      parts.push(remaining.slice(0, start));
    }

    parts.push(
      <strong key={key} className="font-bold">
        {remaining.slice(start + 2, end)}
      </strong>
    );
    key += 1;
    remaining = remaining.slice(end + 2);
  }

  return parts;
}

export default function ProgramCard({
  program,
  isPriority = false,
}: ProgramCardProps) {
  const timeText = program.time.replaceAll(" | ", "\n");

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
          <FormattedText text={program.title} />
        </h3>

        <div className="text-gray-700 mb-4 min-h-[80px]">
          <FormattedText text={program.description} />
        </div>

        <div className="flex flex-col space-y-2 text-gray-700">
          <div className="flex items-start bg-light-teal/10 py-1.5 px-2 rounded-lg">
            <FaCalendarAlt className="h-5 w-5 mr-3 text-dark-teal" />
            <span className="font-medium text-sm">
              {program.isWeekly ? "Every " : ""}
              <FormattedText text={program.date} />
            </span>
          </div>

          <div className="flex items-start bg-light-teal/10 py-1.5 px-2 rounded-lg">
            <FaClock className="h-5 w-5 mr-3 text-dark-teal mt-0.5" />
            <div className="font-medium text-sm">
              <FormattedText text={timeText} />
            </div>
          </div>

          <div className="flex items-start bg-light-teal/10 py-1.5 px-2 rounded-lg">
            <FaMapMarkerAlt className="h-5 w-5 mr-3 text-dark-teal mt-0.5" />
            <span className="font-medium text-sm">
              <FormattedText text={program.location} />
            </span>
          </div>

          <div className="flex items-start bg-light-teal/10 py-1.5 px-2 rounded-lg">
            <FaMoneyBillWave className="h-5 w-5 mr-3 text-dark-teal mt-0.5" />
            <span className="font-medium text-sm">
              <FormattedText text={program.price} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
