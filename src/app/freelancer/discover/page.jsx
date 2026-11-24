import { Discovery } from "@/components/marketplace/MarketViews";
export default async function Page({ searchParams }) {
  return <Discovery portal="freelancer" query={await searchParams} />;
}
