import { csrfUtils } from "./csrf";

// Input sanitization utility
const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") return "";
  return input.replace(/<[^>]*>/g, "");
};

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 10; // Maximum requests per window

class RateLimiter {
  private requests: number[] = [];
  private readonly limit: number = 10;
  private readonly interval: number = 60000; // 1 minute

  check(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.interval);

    if (this.requests.length >= this.limit) {
      throw new Error("Too many requests. Please try again later.");
    }

    this.requests.push(now);
    return true;
  }
}

const rateLimiter = new RateLimiter();

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  async submitVenueHireForm(data: any) {
    // Rate limiting check
    rateLimiter.check();

    // Sanitize input data
    const sanitizedData = {
      personalInfo: {
        name: sanitizeInput(data.personalInfo.name),
        email: sanitizeInput(data.personalInfo.email),
        phone: sanitizeInput(data.personalInfo.phone),
      },
      eventDetails: {
        eventType: sanitizeInput(data.eventDetails.eventType),
        expectedGuests: Number(data.eventDetails.expectedGuests),
      },
      venueSelection: {
        venue: sanitizeInput(data.venueSelection.venue),
      },
      termsAccepted: Boolean(data.termsAccepted),
    };

    // Setup request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch("/api/venue-hire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfUtils.getToken() || "",
        },
        body: JSON.stringify(sanitizedData),
        signal: controller.signal,
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new ApiError(response.status, await response.text());
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500,
        "An unexpected error occurred. Please try again."
      );
    } finally {
      clearTimeout(timeoutId);
    }
  },
};
