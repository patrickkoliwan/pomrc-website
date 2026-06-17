export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SitePageBodySection = {
  heading: string;
  content: string;
};

export type SitePage = {
  id: string;
  slug: string;
  title: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  body: SitePageBodySection[] | null;
  hero_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  updated_at: string;
};

export type FacilityRecord = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  image_url: string | null;
  features: Json | null;
  display_order: number;
  published: boolean;
  updated_at: string;
};

export type ClubEventRecord = {
  id: string;
  title: string;
  description: string | null;
  day: string | null;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  image_url: string | null;
  display_order: number;
  published: boolean;
  updated_at: string;
};

export type CommitteeMemberRecord = {
  id: string;
  name: string;
  title: string;
  photo_url: string | null;
  bio: string | null;
  email_alias: string | null;
  display_order: number;
  published: boolean;
  updated_at: string;
};

export type ContactRoutingRecord = {
  id: string;
  enquiry_type: string;
  label: string;
  recipient_email: string;
  cc_emails: string[] | null;
  active: boolean;
  updated_at: string;
};

export type CmsTable =
  | "site_pages"
  | "facilities"
  | "club_events"
  | "committee_members"
  | "contact_routing";

export type CmsRecord =
  | SitePage
  | FacilityRecord
  | ClubEventRecord
  | CommitteeMemberRecord
  | ContactRoutingRecord;
