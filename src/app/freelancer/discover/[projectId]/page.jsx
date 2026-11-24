import { Listing } from "@/components/marketplace/MarketViews";
export default async function Page({ params }) {
  return <Listing projectId={(await params).projectId} />;
}
