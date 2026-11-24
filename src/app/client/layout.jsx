import { requirePortal } from "@/lib/portal-session";
import ClientSidebar from "@/components/client/ClientSidebar";
import ClientTopNav from "@/components/client/ClientTopNav";

export default async function ClientLayout({ children }) {
  const user = await requirePortal("CLIENT");

  return (
    <main className="min-h-screen bg-[#f8f4ed] text-[#1f130d]">
      <div className="flex min-h-screen">
        <ClientSidebar user={user} />

        <section className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
          <ClientTopNav user={user} />

          <div className="flex-1 px-5 py-5 sm:px-7 lg:px-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
