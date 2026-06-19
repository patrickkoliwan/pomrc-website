import { NextResponse } from "next/server";
import { z } from "zod";
import { sendFilmingPublicityEmail } from "@/app/venue-hire/utils/filmingPublicityEmail";
import { filmingPublicitySchema } from "@/app/venue-hire/utils/filmingPublicitySchema";
import { checkRateLimit, getClientIp } from "@/app/utils/rateLimit";

const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 10;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    if (
      !checkRateLimit({
        key: `filming-publicity:${ip}`,
        limit: MAX_REQUESTS,
        windowMs: RATE_LIMIT_WINDOW,
      })
    ) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const data = await request.json();
    const validatedData = filmingPublicitySchema.parse(data);

    await sendFilmingPublicityEmail(validatedData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Filming/publicity form submission error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to process filming and publicity application" },
      { status: 500 }
    );
  }
}
