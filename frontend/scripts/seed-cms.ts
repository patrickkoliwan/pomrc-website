import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { facilities } from "../src/data/facilities";
import { weeklyEvents, upcomingEvents } from "../src/data/events";

const committeeMembers = [
  { name: "Robin Fleming", title: "Club President", photo_url: "/images/committee/robin-fleming.jpg" },
  { name: "Philip Tabuchi", title: "Vice President", photo_url: "/images/committee/philip-tabuchi.jpg" },
  { name: "Andrew Langley", title: "Treasurer", photo_url: "/images/committee/andrew-langley.jpg" },
  { name: "Brett Cox", title: "Assistant Treasurer", photo_url: "/images/committee/brett-cox.jpg" },
  { name: "Kathlyne Tabuchi", title: "Secretary", photo_url: "/images/committee/kathlyne-resson-tabuchi.jpg" },
  { name: "Adelaide Senior", title: "Assistant Secretary", photo_url: "/images/committee/adelaide-senior.webp" },
  { name: "Diana Hakena", title: "Publicity Officer", photo_url: "" },
  { name: "Toby Davis", title: "Social Director", photo_url: "" },
  { name: "Iain Kaiulo", title: "Technical Director", photo_url: "/images/committee/iain-kaiulo.jpg" },
  { name: "William Aisi", title: "Tennis Director", photo_url: "/images/committee/william-aisi.jpg" },
  { name: "Anna Togolo", title: "Squash Director", photo_url: "/images/committee/anna-togolo.jpg" },
  { name: "Barbara Stubbings", title: "Ex Officio", photo_url: "/images/committee/barbara-stubbings.jpg" },
];

function loadEnvFile(path: string) {
  if (!existsSync(path)) {
    return;
  }

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").replace(/^["']|["']$/g, "");
    process.env[key] ||= value;
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function must<T>(operation: PromiseLike<{ error: T | null }>) {
  const result = await operation;

  if (result.error) {
    throw result.error;
  }
}

async function upsertData() {
  await must(
    supabase.from("site_pages").upsert(
      {
        slug: "about",
        title: "About POMRC",
        hero_title: "About POMRC",
        hero_subtitle: "Where competition meets community in the heart of Port Moresby",
        hero_image_url: "/clubhouse.jpg",
        body: [
          {
            heading: "Our Legacy",
            content:
              "Established through the 2015 Pacific Games Legacy Agreement, POMRC brings international-standard tennis and squash facilities together with a clubhouse built for members, guests, and the wider Port Moresby community.",
          },
          {
            heading: "Championship Tradition",
            content:
              "The POMRC Open has grown into Papua New Guinea's flagship racquets tournament—drawing competitive players, supporting national talent pathways, and welcoming spectators to world-class sport on home soil.",
          },
        ],
        published: true,
      },
      { onConflict: "slug" }
    )
  );

  await must(
    supabase.from("facilities").upsert(
      facilities.map((facility, index) => ({
        name: facility.title,
        slug: facility.id,
        description: facility.description,
        image_url: facility.imageUrl,
        features: [],
        display_order: index,
        published: true,
      })),
      { onConflict: "slug" }
    )
  );

  await must(
    supabase.from("club_events").upsert(
      [...weeklyEvents, ...upcomingEvents].map((event, index) => ({
        title: event.title,
        description: event.description,
        day: event.isWeekly ? event.date : null,
        event_date: event.isWeekly ? null : event.date,
        start_time: event.time,
        end_time: null,
        image_url: null,
        display_order: index,
        published: true,
      }))
    )
  );

  await must(
    supabase.from("committee_members").upsert(
      committeeMembers.map((member, index) => ({
        ...member,
        display_order: index,
        published: true,
      }))
    )
  );

  await must(
    supabase.from("contact_routing").upsert(
      [
        {
          enquiry_type: "general",
          label: "General enquiry",
          recipient_email: process.env.ZOHO_DEFAULT_TO || "info@example.com",
          cc_emails: [],
          active: true,
        },
        {
          enquiry_type: "membership",
          label: "Membership",
          recipient_email: process.env.ZOHO_DEFAULT_TO || "info@example.com",
          cc_emails: [],
          active: true,
        },
        {
          enquiry_type: "venue-hire",
          label: "Venue hire",
          recipient_email: process.env.ZOHO_DEFAULT_TO || "info@example.com",
          cc_emails: [],
          active: true,
        },
      ],
      { onConflict: "enquiry_type" }
    )
  );
}

upsertData()
  .then(() => {
    console.log("CMS seed complete.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
