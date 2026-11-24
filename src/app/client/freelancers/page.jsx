import { Discovery } from "@/components/marketplace/MarketViews";
export default async function Page({ searchParams }) {
  return <Discovery portal="client" query={await searchParams} />;
}
