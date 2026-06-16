import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendVenueHireEmail } from '@/app/venue-hire/utils/email';
import { checkRateLimit, getClientIp } from '@/app/utils/rateLimit';

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 10; // Maximum requests per window

// Validation schemas
const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
});

const eventDetailsSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  expectedGuests: z
    .number()
    .min(1, "Number of guests is required")
    .max(200, "Maximum number of guests is 200"),
});

const venueSelectionSchema = z.object({
  selectedVenue: z.enum(["events-lawn", "squash-courtyard"], {
    required_error: "Please select a venue",
  }),
});

const formSchema = z.object({
  personalInfo: personalInfoSchema,
  eventDetails: eventDetailsSchema,
  venueSelection: venueSelectionSchema,
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    if (
      !checkRateLimit({
        key: `venue-hire:${ip}`,
        limit: MAX_REQUESTS,
        windowMs: RATE_LIMIT_WINDOW,
      })
    ) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const data = await request.json();
    
    // Validate the data
    const validatedData = formSchema.parse(data);

    // Send email
    await sendVenueHireEmail(validatedData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Venue hire form submission error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process venue hire request' },
      { status: 500 }
    );
  }
} 
