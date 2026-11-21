import { requirePortal } from "@/lib/portal-session";
import ClientSidebar from "@/components/client/ClientSidebar";
import ClientTopNav from "@/components/client/ClientTopNav";

export default async function ClientLayout({ children }) {
  const user = await requirePortal("CLIENT");

  return (
    <>
      <ClientSidebar user={user} />
      <ClientTopNav user={user} />

      <main className="ml-64 pt-20 min-h-screen bg-[#F8F4EF]">
        <div className="p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </>
  );
}