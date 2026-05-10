import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function FreelancerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "FREELANCER") {
    redirect("/unauthorized");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-emerald-600">
            FREELANCER PANEL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Freelancer Dashboard
          </h1>

          <p className="mt-3 text-slate-600">
            Welcome, {session.user.name}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-5">
              <p className="text-sm text-slate-500">Project Invitations</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-slate-500">Active Projects</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-slate-500">Pending Submissions</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>
          </div>
          <LogoutButton/>
        </div>
      </section>
    </main>
  );
}