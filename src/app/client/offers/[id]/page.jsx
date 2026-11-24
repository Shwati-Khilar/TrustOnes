import { Thread } from "@/components/marketplace/MarketViews";
export default async function Page({ params, searchParams }) {
  return <Thread portal="client" id={(await params).id} invitationSent={(await searchParams).sent === "invitation"} />;
}
