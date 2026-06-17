import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendContactEmail } from '@/app/contact/utils/email';
import { isValidPhoneOrEmail } from '@/app/utils/contactValidation';
import { getEmailConfig } from '@/app/utils/email';
import { checkRateLimit, getClientIp } from '@/app/utils/rateLimit';
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from '@/lib/supabase/server';

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 3; // Maximum 3 requests per minute

// Validation schema with strict requirements
const contactFormSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s\-']+$/, "Name contains invalid characters"),
  
  contact: z.string()
    .min(1, "Contact information is required")
    .max(100, "Contact information is too long")
    .refine(
      isValidPhoneOrEmail,
      "Please enter a valid phone number or email address"
    ),

  enquiryType: z.string()
    .min(1, "Enquiry type is required")
    .max(120, "Enquiry type is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid enquiry type"),
  
  enquiry: z.string()
    .min(1, "Enquiry is required")
    .max(1000, "Enquiry is too long")
    .regex(/^[^<>]*$/, "Enquiry contains invalid characters"), // Basic XSS prevention
});

async function resolveRecipient(enquiryType: string) {
  if (hasSupabaseAdminConfig()) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("contact_routing")
      .select("recipient_email,cc_emails")
      .eq("enquiry_type", enquiryType)
      .eq("active", true)
      .maybeSingle();

    if (!error && data?.recipient_email) {
      return {
        to: data.recipient_email as string,
        cc: Array.isArray(data.cc_emails) ? (data.cc_emails as string[]) : [],
      };
    }
  }

  return { to: getEmailConfig().defaultTo, cc: [] };
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    
    // Check rate limit
    if (
      !checkRateLimit({
        key: `contact:${ip}`,
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
    const validatedData = contactFormSchema.parse(data);

    // Additional security checks
    if (data.honeypot) {
      // If honeypot field is filled, silently reject but return success
      return NextResponse.json({ success: true });
    }

    // Send email
    await sendContactEmail(
      validatedData,
      await resolveRecipient(validatedData.enquiryType)
    );

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
