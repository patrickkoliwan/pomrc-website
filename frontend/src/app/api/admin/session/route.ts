import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionCookie } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const { idToken } = (await request.json()) as { idToken?: string };

    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    const sessionCookie = await createAdminSessionCookie(idToken);
    const response = NextResponse.json({ success: true });

    response.cookies.set(ADMIN_SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin session creation failed", error);
    return NextResponse.json(
      { error: "Admin access was not approved" },
      { status: 403 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
