import FreelancerPortalShell from "@/components/freelancer/FreelancerPortalShell";
import FreelancerDealRoomDetail from "@/components/freelancer/FreelancerDealRoomDetail";

export default function DealRoomDetailPage({ params }) {
  return (
    <FreelancerPortalShell>
      <FreelancerDealRoomDetail projectId={params.projectId} />
    </FreelancerPortalShell>
  );
}