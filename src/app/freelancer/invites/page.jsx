import { Threads } from "@/components/marketplace/MarketViews";
export default async function Page({ searchParams }) {
  return <Threads portal="freelancer" query={await searchParams} />;
}
