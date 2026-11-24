import { MarketSummary } from "@/components/marketplace/MarketViews";
import ClientDashboard from "@/components/client/ClientDashboard";
import { requirePortal } from "@/lib/portal-session";

export default async function DashboardPage() {
  const user = await requirePortal("CLIENT");
  return <><ClientDashboard user={user} /><MarketSummary role="CLIENT"/></>;
}
