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
  price: string | null;
  members_free: boolean;
  image_url: string | null;
  display_order: number;
  published: boolean;
  updated_at: string;
};

export type JuniorProgramType = "tennis" | "squash" | "other";

export type JuniorProgramRecord = {
  id: string;
  title: string;
  program_type: JuniorProgramType;
  description: string;
  day_text: string;
  time_text: string;
  location: string;
  price: string;
  image_url: string | null;
  display_order: number;
  published: boolean;
  updated_at: string;
};

export type JuniorProgramNoticeSection =
  | "page"
  | JuniorProgramType;

export type JuniorProgramNoticeRecord = {
  id: string;
  message: string;
  section: JuniorProgramNoticeSection;
  enabled: boolean;
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

export type CommitteePositionRecord = {
  id: string;
  title: string;
  display_order: number;
  published: boolean;
  member_id: string | null;
  is_acting: boolean;
  updated_at: string;
};

export type CommitteePositionWithMember = CommitteePositionRecord & {
  member: CommitteeMemberRecord | null;
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
  | "junior_programs"
  | "junior_program_notice"
  | "committee_members"
  | "committee_positions"
  | "contact_routing";

export type CmsRecord =
  | SitePage
  | FacilityRecord
  | ClubEventRecord
  | JuniorProgramRecord
  | JuniorProgramNoticeRecord
  | CommitteeMemberRecord
  | CommitteePositionRecord
  | ContactRoutingRecord;
