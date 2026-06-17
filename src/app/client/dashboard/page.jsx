import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import ClientSidebar from "../../../components/client/ClientSidebar";
import ClientTopNav from "../../../components/client/ClientTopNav";
import ClientDashboard from "../../../components/client/ClientDashboard";

export default async function ClientDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "CLIENT") {
    redirect("/unauthorized");
  }

  return (
    <>
      <ClientSidebar user={session.user} />
      <ClientTopNav user={session.user} />

      <main className="ml-64 pt-16 min-h-screen bg-[#F7F3EE]">
        <div className="p-8">
          <ClientDashboard user={session.user} />
        </div>
      </main>
    </>
  );
}