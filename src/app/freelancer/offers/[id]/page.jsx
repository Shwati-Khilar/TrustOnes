import { Thread } from "@/components/marketplace/MarketViews";
export default async function Page({ params }) {
  return <Thread portal="freelancer" id={(await params).id} />;
}
