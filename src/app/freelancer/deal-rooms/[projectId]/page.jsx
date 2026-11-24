import FreelancerPortalShell from "@/components/freelancer/FreelancerPortalShell";
import FreelancerDealRoomDetail from "@/components/freelancer/FreelancerDealRoomDetail";

export default async function DealRoomDetailPage({ params }) {
  const { projectId } = await params;
  return (
    <FreelancerPortalShell>
      <FreelancerDealRoomDetail projectId={projectId} />
    </FreelancerPortalShell>
  );
}