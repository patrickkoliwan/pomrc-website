import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendVenueHireEmail } from '@/app/venue-hire/utils/email';

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

// Define a type for the global object to avoid using 'any'
declare global {
  // eslint-disable-next-line no-var
  var requestCount: number;
  // eslint-disable-next-line no-var
  var lastRequestTime: number;
}

export async function POST(request: Request) {
  try {
    // Basic rate limiting
    const now = Date.now();
    const requestCount = global.requestCount || 0;
    const lastRequestTime = global.lastRequestTime || 0;

    if (now - lastRequestTime < 1000 || requestCount > 10) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    global.requestCount = requestCount + 1;
    global.lastRequestTime = now;

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