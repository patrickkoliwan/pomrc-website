import { csrfUtils } from "./csrf";
import { MembershipFormData } from "./types";

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 10; // Maximum requests per window

class RateLimiter {
  private requests: number[] = [];

  isAllowed(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(
      (time) => now - time < RATE_LIMIT_WINDOW
    );
    if (this.requests.length >= MAX_REQUESTS) {
      return false;
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
  async submitMembershipForm(data: MembershipFormData) {
    if (!rateLimiter.isAllowed()) {
      throw new ApiError(429, "Too many requests. Please try again later.");
    }

    try {
      const response = await fetch("/api/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfUtils.getToken(),
        },
        body: JSON.stringify(data),
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
    }
  },
};
