"use client";

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

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const recommendedFreelancers = [
  {
    name: "Ada Chen",
    role: "Full-Stack Developer",
    score: 98,
    rating: 4.9,
    reviews: 142,
    badge: "TOP RATED",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  },
  {
    name: "Marco Rivera",
    role: "Brand & Visual Designer",
    score: 94,
    rating: 4.8,
    reviews: 97,
    badge: "VERIFIED PRO",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  },
  {
    name: "Priya Nair",
    role: "Mobile App Developer",
    score: 91,
    rating: 4.7,
    reviews: 63,
    badge: "RISING TALENT",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
  },
];

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
    (project) => project.status === "OPEN"
  ).length;

  const hiredFreelancers = new Set(
    projects
      .filter((project) => project.freelancer?.id)
      .map((project) => project.freelancer.id)
  ).size;

  const totalFunded = projects.reduce(
    (sum, project) => sum + Number(project.budget || 0),
    0
  );

  const totalReleased = projects.reduce(
    (sum, project) => sum + Number(project.spent || 0),
    0
  );

  const totalLocked = projects.reduce(
    (sum, project) => sum + Number(project.remainingBudget || 0),
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
      label: "Escrow Locked",
      value: formatCurrency(totalLocked),
      helper: "Protected in escrow",
      icon: Wallet,
      tone: "blue",
    },
  ];

  const fundedPercent =
    totalFunded === 0
      ? 0
      : Math.min(100, Math.round((totalReleased / totalFunded) * 100));

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
                  Welcome back, {firstName}. Hire trusted talent with protected
                  payments.
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-[#7c6858]">
                  Post projects, compare proposals, and release escrow only when
                  milestones are delivered and approved.
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

        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-black text-[#24130c]">Trust Score</p>

              <p className="mt-1 text-xs font-semibold text-[#7c6858]">
                Based on payments, reviews, and disputes
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#b45309]">
              <Star size={20} fill="currentColor" />
            </div>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <h2 className="text-5xl font-black tracking-[-0.06em] text-[#24130c]">
              96
            </h2>

            <p className="pb-2 text-sm font-bold text-[#7c6858]">/100</p>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#eadfd2]">
            <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-[#6f2e1c] to-[#f4b454]" />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-white p-3">
              <p className="text-sm font-black text-[#24130c]">4.9</p>

              <p className="text-[11px] font-semibold text-[#7c6858]">
                Rating
              </p>
            </div>

            <div className="rounded-2xl bg-white p-3">
              <p className="text-sm font-black text-[#24130c]">
                {projects.length}
              </p>

              <p className="text-[11px] font-semibold text-[#7c6858]">
                Projects
              </p>
            </div>

            <div className="rounded-2xl bg-white p-3">
              <p className="text-sm font-black text-[#24130c]">0</p>

              <p className="text-[11px] font-semibold text-[#7c6858]">
                Disputes
              </p>
            </div>
          </div>
        </div>
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
                      <StatusBadge status={project.status} />

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
                        {formatDate(project.deadline)}
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
                      {formatDate(milestone.dueDate)}
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

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                Escrow Snapshot
              </h2>

              <p className="mt-1 text-sm font-medium text-[#7c6858]">
                How your project money is distributed
              </p>
            </div>

            <ShieldCheck className="text-[#047857]" size={22} />
          </div>

          <div className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#806049]">
                  Total funded
                </p>

                <p className="mt-1 text-3xl font-black tracking-[-0.04em] text-[#24130c]">
                  {formatCurrency(totalFunded)}
                </p>
              </div>

              <p className="text-sm font-bold text-[#7c6858]">
                {fundedPercent}% released
              </p>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#eadfd2]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6f2e1c] to-[#f4b454]"
                style={{ width: `${fundedPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4">
              <div className="flex items-center gap-2 text-[#047857]">
                <CheckCircle2 size={15} />

                <p className="text-[11px] font-bold uppercase tracking-[0.14em]">
                  Released
                </p>
              </div>

              <p className="mt-2 text-lg font-black text-[#24130c]">
                {formatCurrency(totalReleased)}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <div className="flex items-center gap-2 text-[#b45309]">
                <Wallet size={15} />

                <p className="text-[11px] font-bold uppercase tracking-[0.14em]">
                  Locked
                </p>
              </div>

              <p className="mt-2 text-lg font-black text-[#24130c]">
                {formatCurrency(totalLocked)}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <div className="flex items-center gap-2 text-[#1d4ed8]">
                <IndianRupee size={15} />

                <p className="text-[11px] font-bold uppercase tracking-[0.14em]">
                  Projects
                </p>
              </div>

              <p className="mt-2 text-lg font-black text-[#24130c]">
                {projects.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f4b454]">
            Protected hiring
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">
            Review proposals and award the right freelancer.
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/85">
            Every project keeps funds in escrow until you approve the delivered
            work — you stay in control of every release.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              href="/client/freelancers"
              className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-black transition hover:bg-white/15"
            >
              <span className="flex items-center gap-2">
                <Users size={17} />
                Browse trusted talent
              </span>

              <ArrowUpRight size={16} />
            </Link>

            <Link
              href="/client/escrow"
              className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-black transition hover:bg-white/15"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} />
                Open escrow center
              </span>

              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Recommended Freelancers
            </h2>

            <p className="mt-1 text-sm font-medium text-[#7c6858]">
              Based on your project needs
            </p>
          </div>

          <Link
            href="/client/freelancers"
            className="hidden text-sm font-black text-[#6f2e1c] sm:block"
          >
            Browse talent →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recommendedFreelancers.map((freelancer) => (
            <div
              key={freelancer.name}
              className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={freelancer.image}
                    alt={freelancer.name}
                    className="h-12 w-12 rounded-2xl border border-[#eadfd2] object-cover"
                  />

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-black text-[#24130c]">
                      {freelancer.name}
                    </h3>

                    <p className="truncate text-xs font-semibold text-[#b45309]">
                      {freelancer.role}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-black tracking-wide text-[#8a4a1d]">
                  {freelancer.badge}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#8b5a2b]">
                  <span>Trust score</span>

                  <span>{freelancer.score}/100</span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eadfd2]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6f2e1c] to-[#f4b454]"
                    style={{ width: `${freelancer.score}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm font-bold text-[#b45309]">
                  <Star size={14} fill="currentColor" />

                  {freelancer.rating}

                  <span className="ml-1 text-xs font-semibold text-[#7c6858]">
                    ({freelancer.reviews})
                  </span>
                </div>

                <Link
                  href="/client/freelancers"
                  className="rounded-xl border border-[#eadfd2] bg-white px-4 py-2 text-xs font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
                >
                  View profile
                </Link>
              </div>
            </div>
          ))}
        </div>
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
