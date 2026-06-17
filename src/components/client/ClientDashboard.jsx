import StatsCards from "./DashboardContents/StatsCards";
import RecentProjects from "./DashboardContents/RecentProjects";
import EscrowOverview from "./DashboardContents/EscrowOverview";
import RecentActivity from "./DashboardContents/RecentActivity";
import ActionRequired from "./DashboardContents/ActionRequired";
import RecommendedFreelancers from "./DashboardContents/RecommendedFreelancers";

export default function ClientDashboard({ user }) {
  return (
    <div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#3D2414]">
          Welcome back, {user?.name}
        </h1>

        <p className="mt-3 text-[#7A7068] max-w-2xl">
          Manage projects, hire trusted freelancers and release
          payments securely through escrow protection.
        </p>
      </div>

      <StatsCards />

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <RecentProjects />
        <EscrowOverview />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <RecentActivity />
        <ActionRequired />
      </div>

      <div className="mt-8">
        <RecommendedFreelancers />
      </div>

    </div>
  );
}