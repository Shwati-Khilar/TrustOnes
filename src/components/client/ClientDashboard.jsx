"use client";

import { projectDate } from "@/lib/project-presentation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Handshake,
  IndianRupee,
  Inbox,
  ListChecks,
  ShieldCheck,
  Star,
  Users,
  Wallet,
} from "lucide-react";

function toneClasses(tone) {
  const tones = {
    brown: "bg-[#fff7ed] text-[#7c341d] border-[#f0d7c3]",
    amber: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    green: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    blue: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
  };

  return tones[tone] || tones.brown;
}

function StatusBadge({ status }) {
  const normalizedStatus = String(status || "OPEN");

  const styles = {
    OPEN: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    ACTIVE: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    PAUSED: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    COMPLETED: "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]",
    CANCELLED: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
    PENDING: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
    IN_PROGRESS: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    SUBMITTED: "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-black tracking-wide ${
        styles[normalizedStatus] || styles.OPEN
      }`}
    >
      {normalizedStatus.split("_").join(" ")}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-6 text-center">
      <p className="text-sm font-bold text-[#7c6858]">{message}</p>
    </div>
  );
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}


export default function ClientDashboard({ user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProjects() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch("/api/projects", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to load projects.");
        }

        if (!ignore) {
          setProjects(result.projects || []);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || "Unable to load dashboard.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      ignore = true;
    };
  }, []);

  const firstName = user?.name?.split(" ")[0] || "there";

  const activeProjects = projects.filter(
    (project) => project.status === "ACTIVE"
  ).length;

  const openProjects = projects.filter(
    (project) => project.status === "OPEN" && project.publishedAt
  ).length;

  const hiredFreelancers = new Set(
    projects
      .filter((project) => project.freelancer?.id)
      .map((project) => project.freelancer.id)
  ).size;

  const totalProjectBudget = projects.reduce(
    (sum, project) => sum + Number(project.budget || 0),
    0
  );

  const pendingMilestones = projects.flatMap((project) =>
    (project.milestones || [])
      .filter((milestone) =>
        ["PENDING", "IN_PROGRESS", "SUBMITTED"].includes(milestone.status)
      )
      .map((milestone) => ({
        ...milestone,
        projectTitle: project.title,
        projectId: project.id,
      }))
  );

  const recentProjects = projects.slice(0, 4);

  const dashboardStats = [
    {
      label: "Active Projects",
      value: String(activeProjects),
      helper: "Work in progress",
      icon: Handshake,
      tone: "brown",
    },
    {
      label: "Open Projects",
      value: String(openProjects),
      helper: "Awaiting proposals",
      icon: Inbox,
      tone: "amber",
    },
    {
      label: "Hired Freelancers",
      value: String(hiredFreelancers),
      helper: "Trusted professionals",
      icon: Users,
      tone: "green",
    },
    {
      label: "Project budgets",
      value: formatCurrency(totalProjectBudget),
      helper: "Listing and agreed values",
      icon: Wallet,
      tone: "blue",
    },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">
            Loading client dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#fecaca] bg-[#fff7f7] p-8 shadow-sm">
          <h2 className="text-xl font-black text-[#24130c]">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm font-semibold text-[#b91c1c]">
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="grid gap-5 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="overflow-hidden rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] shadow-sm">
          <div className="relative p-6 sm:p-7">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#f4b454]/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-[#6f2e1c]/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7c6858]">
                  Client Workspace
                </p>

                <h1 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] text-[#24130c] sm:text-4xl">
                  Welcome back, {firstName}.
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-[#7c6858]">
                  Post projects, compare proposals, and agree terms with a freelancer.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[340px]">
                <Link
                  href="/client/projects/create"
                  className="rounded-2xl bg-[#6f2e1c] px-5 py-4 text-left text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
                >
                  Post a Project
                  <span className="mt-1 block text-xs font-semibold text-white/85">
                    {openProjects} open listing
                    {openProjects === 1 ? "" : "s"}
                  </span>
                </Link>

                <Link
                  href="/client/projects"
                  className="rounded-2xl border border-[#eadfd2] bg-white px-5 py-4 text-left text-sm font-black text-[#6f2e1c] shadow-sm transition hover:bg-[#fff7ed]"
                >
                  My Projects
                  <span className="mt-1 block text-xs font-semibold text-[#7c6858]">
                    {activeProjects} active
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-3 rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-6 shadow-sm">
          <h2 className="font-bold">Reputation</h2><p>Unrated</p>
          <Link className="font-bold text-[#6f2e1c] underline" href="/client/freelancers">Find freelancers</Link>
        </aside>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-[#7c6858]">
                    {stat.label}
                  </p>

                  <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c]">
                    {stat.value}
                  </h3>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${toneClasses(
                    stat.tone
                  )}`}
                >
                  <Icon size={19} />
                </div>
              </div>

              <p className="mt-3 text-xs font-semibold text-[#7c6858]">
                {stat.helper}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                Recent Projects
              </h2>

              <p className="mt-1 text-sm font-medium text-[#7c6858]">
                Your latest postings and their progress
              </p>
            </div>

            <Link
              href="/client/projects"
              className="text-sm font-black text-[#6f2e1c]"
            >
              View all →
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <EmptyState message="No projects yet. Post your first project to get started." />
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-5"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <StatusBadge status={project.status === "OPEN" && !project.publishedAt ? "DRAFT" : project.status} />

                      <h3 className="mt-3 truncate text-lg font-black tracking-[-0.03em] text-[#24130c]">
                        {project.title}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-[#7c6858]">
                        {project.freelancer?.name || "No freelancer hired yet"} •{" "}
                        Budget {formatCurrency(project.budget)}
                      </p>
                    </div>

                    <Link
                      href={`/client/projects/${project.id}`}
                      className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl border border-[#eadfd2] bg-white px-4 py-2 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
                    >
                      Open
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#7c6858]">
                      <span>
                        Milestones {project.completedMilestones || 0}/
                        {project.totalMilestones || 0} completed
                      </span>

                      <span>{project.progress || 0}%</span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-[#eadfd2]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6f2e1c] to-[#f4b454]"
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3">
                    <Clock3 size={16} className="text-[#b45309]" />

                    <p className="text-sm font-semibold text-[#7c6858]">
                      Deadline:{" "}
                      <span className="font-black text-[#24130c]">
                        {projectDate(project.deadline)}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                Action Required
              </h2>

              <p className="mt-1 text-sm font-medium text-[#7c6858]">
                Milestones waiting on you
              </p>
            </div>

            <ListChecks className="text-[#b45309]" size={22} />
          </div>

          {pendingMilestones.length === 0 ? (
            <EmptyState message="Nothing needs your attention right now." />
          ) : (
            <div className="space-y-3">
              {pendingMilestones.slice(0, 4).map((milestone) => (
                <Link
                  key={milestone.id}
                  href={`/client/projects/${milestone.projectId}`}
                  className="block rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4 transition hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-black text-[#24130c]">
                        {milestone.title}
                      </h3>

                      <p className="mt-1 truncate text-xs font-semibold text-[#7c6858]">
                        {milestone.projectTitle}
                      </p>
                    </div>

                    <p className="shrink-0 text-xs font-black text-[#b45309]">
                      {projectDate(milestone.dueDate)}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <StatusBadge status={milestone.status} />

                    <p className="text-sm font-black text-[#24130c]">
                      {formatCurrency(milestone.amount)}
                    </p>
                  </div>
                </Link>
              ))}

              {pendingMilestones.length > 4 && (
                <Link
                  href="/client/projects"
                  className="block rounded-2xl border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-4 text-center text-sm font-black text-[#6f2e1c] transition hover:bg-white"
                >
                  View {pendingMilestones.length - 4} more
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6">
        <h2 className="text-xl font-bold">Funding history</h2>
        <Link className="font-bold underline" href="/client/escrow">View simulated funding records</Link>
      </section>
      <section className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7c6858]">
              Ready to hire
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#24130c]">
              You have {openProjects} open project
              {openProjects === 1 ? "" : "s"} and {activeProjects} in progress.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c6858]">
              Keep momentum by reviewing proposals and funding the next
              milestone before work starts.
            </p>
          </div>

          <Link
            href="/client/projects"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]"
          >
            <FolderKanban size={18} />
            Manage Projects
          </Link>
        </div>
      </section>
    </div>
  );
}
