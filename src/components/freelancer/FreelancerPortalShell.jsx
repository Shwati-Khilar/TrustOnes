import FreelancerSidebar from "./FreelancerSidebar";
import FreelancerTopbar from "./FreelancerTopbar";

export default function FreelancerPortalShell({ children }) {
  return (
    <main className="min-h-screen bg-[#f8f4ed] text-[#1f130d]">
      <div className="flex min-h-screen">
        <FreelancerSidebar />

        <section className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
          <FreelancerTopbar />

          <div className="flex-1 px-5 py-5 sm:px-7 lg:px-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}