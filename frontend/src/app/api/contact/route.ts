import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendContactEmail } from '@/app/contact/utils/email';

// Validation schema with strict requirements
const contactFormSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s\-']+$/, "Name contains invalid characters"),
  
  contact: z.string()
    .min(1, "Contact information is required")
    .max(100, "Contact information is too long")
    .regex(
      /^(\+?[\d\s-]+|\w+@\w+\.\w{2,3})$/,
      "Please enter a valid phone number or email address"
    ),
  
  enquiry: z.string()
    .min(1, "Enquiry is required")
    .max(1000, "Enquiry is too long")
    .regex(/^[^<>]*$/, "Enquiry contains invalid characters"), // Basic XSS prevention
});

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 3; // Maximum 3 requests per minute
const requestLog = new Map<string, { count: number; timestamp: number }>();

// Clean up old rate limit entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestLog.entries()) {
    if (now - data.timestamp > RATE_LIMIT_WINDOW) {
      requestLog.delete(ip);
    }
  }
}, 3600000); // Clean up every hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requestData = requestLog.get(ip) || { count: 0, timestamp: now };

  // Reset count if window has passed
  if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
    requestData.count = 1;
    requestData.timestamp = now;
  } else {
    requestData.count++;
  }

  requestLog.set(ip, requestData);
  return requestData.count <= MAX_REQUESTS;
}

export async function POST(request: Request) {
  try {
    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const data = await request.json();

    // Validate the data
    const validatedData = contactFormSchema.parse(data);

    // Additional security checks
    if (data.honeypot) {
      // If honeypot field is filled, silently reject but return success
      return NextResponse.json({ success: true });
    }

    // Send email
    await sendContactEmail(validatedData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form submission error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process contact form submission' },
      { status: 500 }
    );
  }
} 