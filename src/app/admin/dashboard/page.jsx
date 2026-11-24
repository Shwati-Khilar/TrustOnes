import Link from "next/link";
import { requirePortal } from "@/lib/portal-session";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function AdminDashboardPage() {
  const user = await requirePortal("ADMIN");
  const [totalUsers, activeProjects] = await Promise.all([prisma.user.count(), prisma.project.count({where:{status:"ACTIVE"}})]);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-purple-600">
            ADMIN PANEL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-slate-600">
            Welcome, {user.name}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-5">
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="mt-2 text-3xl font-bold">{totalUsers}</p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-slate-500">Active Projects</p>
              <p className="mt-2 text-3xl font-bold">{activeProjects}</p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-slate-500">Open Disputes</p>
              <p className="mt-2 text-3xl font-bold">Unavailable</p>
            </div>
          </div>
          <Link href="/admin/support" className="my-5 block font-semibold text-purple-700 underline">Support requests</Link>
          <LogoutButton/>
        </div>
      </section>
    </main>
  );
}