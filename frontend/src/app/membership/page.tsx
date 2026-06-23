import { getMembershipPricing } from "@/lib/membership/pricing";
import MembershipPageClient from "./MembershipPageClient";

export default async function MembershipPage() {
  const pricing = await getMembershipPricing();

  return <MembershipPageClient pricing={pricing} />;
}
