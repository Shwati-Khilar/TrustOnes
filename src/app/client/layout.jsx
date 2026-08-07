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
    <>
      <ClientSidebar user={session.user} />
      <ClientTopNav user={session.user} />

      <main className="ml-64 pt-20 min-h-screen bg-[#F8F4EF]">
        <div className="p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </>
  );
}