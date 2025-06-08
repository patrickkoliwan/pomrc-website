import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendMembershipEmail } from '@/app/membership/utils/email';

// Validation schema
const membershipFormSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    surname: z.string().min(1, "Surname is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().optional(),
  }),
  membershipStatus: z.enum(["new", "renewal"]),
  membershipType: z.enum(["FAMILY", "SINGLE_ADULT", "JUNIORS", "SOCIAL"]),
  familyDetails: z.object({
    spouse: z.object({
      name: z.string(),
      gender: z.string(),
      playingLevel: z.enum(["A_GRADE", "B_GRADE", "SOCIAL", "BEGINNER"]),
    }).optional(),
    children: z.array(z.object({
      name: z.string(),
      gender: z.string(),
      dateOfBirth: z.string(),
      playingLevel: z.enum(["A_GRADE", "B_GRADE", "SOCIAL", "BEGINNER", "JUNIOR"]),
    })).optional(),
  }).optional(),
  endorsements: z.object({
    firstEndorser: z.object({
      name: z.string().min(1, "Endorser name is required"),
      contact: z.string().min(1, "Endorser contact is required"),
    }),
    secondEndorser: z.object({
      name: z.string().min(1, "Endorser name is required"),
      contact: z.string().min(1, "Endorser contact is required"),
    }),
  }).optional(),
  clubInvolvement: z.object({
    interestedInClubOfficer: z.boolean(),
    skills: z.string().optional(),
  }),
  declaration: z.boolean(),
}).refine(data => {
  if (data.membershipStatus === "new" && !data.endorsements) {
    return false;
  }
  return true;
}, {
  message: "New members must provide endorsements",
  path: ["endorsements"],
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