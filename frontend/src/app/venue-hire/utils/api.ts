import { csrfUtils } from "./csrf";
import { FormData } from "../page";

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
  async submitVenueHireForm(data: FormData) {
    try {
      const response = await fetch("/api/venue-hire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
