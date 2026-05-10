import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/auth/LogoutButton";
import { logoutUser } from '@/services/auth.client.service';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const totalUsers = await prisma.user.count();

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
            Welcome, {session.user.name}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-5">
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="mt-2 text-3xl font-bold">{totalUsers}</p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-slate-500">Active Projects</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-slate-500">Open Disputes</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>
          </div>
          <LogoutButton/>
        </div>
      </section>
    </main>
  );
}