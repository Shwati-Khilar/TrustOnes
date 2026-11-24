import { Professional } from "@/components/marketplace/MarketViews";
export default async function Page({ params }) {
  return <Professional workerId={(await params).workerId} />;
}
