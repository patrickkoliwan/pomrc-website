import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendMembershipEmail } from '@/app/membership/utils/email';
import { membershipFormSchema } from '@/app/membership/utils/schema';
import { checkRateLimit, getClientIp } from '@/app/utils/rateLimit';

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 10; // Maximum requests per window

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    if (
      !checkRateLimit({
        key: `membership:${ip}`,
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
    const validatedData = membershipFormSchema.parse(data);

    // Send email
    await sendMembershipEmail(validatedData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Membership form submission error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process membership application' },
      { status: 500 }
    );
  }
} 
