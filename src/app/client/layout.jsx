import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

import ClientSidebar from "@/components/client/ClientSidebar";
import ClientTopNav from "@/components/client/ClientTopNav";

export default async function ClientLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "CLIENT") {
    redirect("/unauthorized");
  }

  return (
    <main className="min-h-screen bg-[#f8f4ed] text-[#1f130d]">
      <div className="flex min-h-screen">
        <ClientSidebar user={session.user} />

        <section className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
          <ClientTopNav user={session.user} />

          <div className="flex-1 px-5 py-5 sm:px-7 lg:px-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
