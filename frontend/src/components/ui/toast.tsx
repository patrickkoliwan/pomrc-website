"use client";

import { useEffect } from "react";

import { cn } from "@/lib/utils";

export function Toast({
  message,
  open,
  onClose,
  duration = 3000,
}: {
  message: string;
  open: boolean;
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [open, onClose, duration]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-md bg-dark-teal px-4 py-3 text-sm font-medium text-light-cream shadow-lg",
        "animate-in fade-in slide-in-from-bottom-2 duration-200"
      )}
    >
      {message}
    </div>
  );
}
