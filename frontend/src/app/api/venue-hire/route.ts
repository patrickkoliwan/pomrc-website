import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendVenueHireEmail } from '@/app/venue-hire/utils/email';
import { checkRateLimit, getClientIp } from '@/app/utils/rateLimit';
import {
  createVenueHireApplication,
  updateVenueHireApplicationEmailStatus,
} from '@/lib/venue-applications/venue-hire';

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
    const application = await createVenueHireApplication(validatedData);

    try {
      await sendVenueHireEmail(validatedData);
      try {
        await updateVenueHireApplicationEmailStatus(application.id, {
          email_status: 'sent',
        });
      } catch (statusError) {
        console.error('Venue hire email status update error:', statusError);
      }
    } catch (emailError) {
      console.error('Venue hire email notification error:', emailError);
      try {
        await updateVenueHireApplicationEmailStatus(application.id, {
          email_status: 'failed',
          email_error:
            emailError instanceof Error
              ? emailError.message
              : 'Failed to send venue hire email',
        });
      } catch (statusError) {
        console.error('Venue hire email status update error:', statusError);
      }
    }

    return NextResponse.json({ success: true, applicationId: application.id });
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
