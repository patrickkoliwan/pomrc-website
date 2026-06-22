"use client";

import { useState } from "react";
import Image from "next/image";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import type { Event } from "@/data/events";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type EventCardVariant = "card" | "list";

interface EventCardProps {
  event: Event;
  variant?: EventCardVariant;
}

function formatEventPricing(event: Event): string | null {
  const parts: string[] = [];

  if (event.price) {
    parts.push(event.price);
  }

  if (event.membersFree) {
    parts.push("Members free");
  }

  return parts.length > 0 ? parts.join(" · ") : null;
}

function EventMeta({ event, className = "mt-1" }: { event: Event; className?: string }) {
  const dateLabel = event.isWeekly ? `Every ${event.date}` : event.date;
  const pricing = formatEventPricing(event);
  const trailing = [event.location, pricing].filter(Boolean).join(" · ");

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-dark-teal/70 ${className}`}
    >
      <span className="inline-flex items-center gap-1.5">
        <FaCalendarAlt className="h-3.5 w-3.5 shrink-0 text-muted-teal" aria-hidden />
        {dateLabel}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <FaClock className="h-3.5 w-3.5 shrink-0 text-muted-teal" aria-hidden />
        {event.time}
      </span>
      {trailing && <span>{trailing}</span>}
    </div>
  );
}

const DESCRIPTION_TRUNCATE_LENGTH = 120;

function EventDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);

  if (!description) {
    return null;
  }

  if (description.length <= DESCRIPTION_TRUNCATE_LENGTH) {
    return (
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-dark-teal/80">
        {description}
      </p>
    );
  }

  return (
    <div className="mt-2">
      <p
        className={`whitespace-pre-line text-sm leading-relaxed text-dark-teal/80 ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {description}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="mt-1 inline-block text-sm font-medium text-deep-red hover:text-muted-teal"
        aria-expanded={expanded}
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </div>
  );
}

function EventPosterModal({
  open,
  onOpenChange,
  imageUrl,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  title: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95dvh] w-[calc(100%-2rem)] max-w-none overflow-y-auto border-muted-teal/30 bg-light-cream p-4 sm:max-w-3xl sm:rounded-lg">
        <DialogTitle className="pr-8 text-lg font-bold text-dark-teal">
          {title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Full event poster for {title}
        </DialogDescription>
        <div className="flex justify-center overflow-auto">
          <Image
            src={imageUrl}
            alt={title}
            width={900}
            height={1200}
            className="h-auto max-h-[85dvh] w-auto max-w-full object-contain"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EventListRow({ event }: { event: Event }) {
  const [posterOpen, setPosterOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-dark-teal">{event.title}</h3>
        <EventMeta event={event} />
        <EventDescription description={event.description} />
      </div>
      {event.imageUrl && (
        <>
          <button
            type="button"
            onClick={() => setPosterOpen(true)}
            className={
              event.isWeekly
                ? "relative shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-teal focus-visible:ring-offset-2"
                : "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-light-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-teal focus-visible:ring-offset-2"
            }
            aria-label={`View full poster for ${event.title}`}
          >
            <Image
              src={event.imageUrl}
              alt={event.title}
              width={event.isWeekly ? 80 : 64}
              height={64}
              className={
                event.isWeekly
                  ? "h-16 w-auto max-w-[6rem] object-contain"
                  : "h-full w-full object-contain p-1"
              }
              sizes={event.isWeekly ? "96px" : "64px"}
            />
          </button>
          <EventPosterModal
            open={posterOpen}
            onOpenChange={setPosterOpen}
            imageUrl={event.imageUrl}
            title={event.title}
          />
        </>
      )}
    </div>
  );
}

function EventPosterCard({ event }: { event: Event }) {
  const [posterOpen, setPosterOpen] = useState(false);

  return (
    <article className="overflow-hidden rounded-xl bg-white ring-1 ring-dark-teal/10 shadow-sm">
      {event.imageUrl && (
        <>
          <button
            type="button"
            onClick={() => setPosterOpen(true)}
            className="event-card-poster group/poster relative block w-full cursor-pointer bg-light-teal transition-colors hover:bg-light-teal/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-teal focus-visible:ring-offset-2"
            style={{ height: "9rem" }}
            aria-label={`View full poster for ${event.title}`}
          >
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-contain p-2 transition-transform duration-300 group-hover/poster:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
            />
          </button>
          <EventPosterModal
            open={posterOpen}
            onOpenChange={setPosterOpen}
            imageUrl={event.imageUrl}
            title={event.title}
          />
        </>
      )}

      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-bold text-dark-teal sm:text-xl">
          {event.title}
        </h3>
        <EventMeta event={event} className="mt-2" />
        <EventDescription description={event.description} />
      </div>
    </article>
  );
}

export default function EventCard({ event, variant = "card" }: EventCardProps) {
  if (variant === "list") {
    return <EventListRow event={event} />;
  }

  return <EventPosterCard event={event} />;
}
