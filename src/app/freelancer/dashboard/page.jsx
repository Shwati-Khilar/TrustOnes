import { MarketSummary } from "@/components/marketplace/MarketViews";
import FreelancerPortalShell from "@/components/freelancer/FreelancerPortalShell";
import FreelancerDashboardHome from "@/components/freelancer/FreelancerDashboardHome";

export default function FreelancerDashboardPage() {
  return (
    <FreelancerPortalShell>
      <FreelancerDashboardHome /><MarketSummary role="FREELANCER"/>
    </FreelancerPortalShell>
  );
}