import { NextResponse } from "next/server";
import {
  getSupabaseAdminClient,
  hasSupabaseAdminConfig,
} from "@/lib/supabase/server";

const fallbackOptions = [
  { value: "general", label: "General enquiry" },
  { value: "membership", label: "Membership" },
  { value: "venue-hire", label: "Venue hire" },
  { value: "junior-programs", label: "Junior programs" },
];

export async function GET() {
  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ data: fallbackOptions });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contact_routing")
    .select("enquiry_type,label")
    .eq("active", true)
    .order("label", { ascending: true });

  if (error || !data?.length) {
    return NextResponse.json({ data: fallbackOptions });
  }

  return NextResponse.json({
    data: data.map((item) => ({
      value: item.enquiry_type,
      label: item.label,
    })),
  });
}
