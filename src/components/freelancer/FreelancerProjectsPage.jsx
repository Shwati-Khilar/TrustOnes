"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Handshake,
  IndianRupee,
  ListChecks,
  MessageSquare,
  Search,
  ShieldCheck,
  UploadCloud,
  UserRound,
} from "lucide-react";

const filters = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Paused", value: "PAUSED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function StatusBadge({ status }) {
  const normalizedStatus = String(status || "ACTIVE");

  const styles = {
    ACTIVE: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    PAUSED: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    COMPLETED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    CANCELLED: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
    OPEN: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[normalizedStatus] || styles.ACTIVE
      }`}
    >
      {normalizedStatus}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    HIGH: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
    MEDIUM: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    LOW: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[priority] || styles.MEDIUM
      }`}
    >
      {priority}
    </span>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-[1.7rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
        <FolderKanban size={24} />
      </div>

      <h3 className="mt-4 text-lg font-black text-[#24130c]">{title}</h3>

      <p className="mt-2 text-sm text-[#7c6858]">{text}</p>
    </div>
  );
}

function getPriority(project) {
  if (project.status === "CANCELLED" || project.status === "COMPLETED") {
    return "LOW";
  }

  if (!project.deadline) {
    return "MEDIUM";
  }

  const today = new Date();
  const deadline = new Date(project.deadline);

  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  if (diffDays <= 3) return "HIGH";
  if (diffDays <= 10) return "MEDIUM";

  return "LOW";
}

function mapApiProject(project) {
  return {
    id: project.id,
    title: project.title,
    client: project.client?.name || "Client",
    clientEmail: "Private client profile",
    category: project.category || "General",
    status: project.status || "ACTIVE",
    budget: project.budget || 0,
    budgetDisplay: project.budgetDisplay || formatCurrency(project.budget),
    activeAmountDisplay:
      project.milestoneSummary?.activeAmountDisplay || formatCurrency(0),
    approvedAmountDisplay:
      project.milestoneSummary?.approvedAmountDisplay || formatCurrency(0),
    deadline: project.deadlineDisplay || "No deadline",
    rawDeadline: project.deadline,
    progress: project.milestoneSummary?.progress || 0,
    completedMilestones: project.milestoneSummary?.completed || 0,
    totalMilestones: project.milestoneSummary?.total || 0,
    nextAction: project.nextAction || "Open deal room",
    description: project.description || "No project description available.",
    unreadMessages: 0,
    priority: getPriority(project),
  };
}

export default function FreelancerProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [projectsData, setProjectsData] = useState({
    stats: {
      totalProjects: 0,
      activeProjects: 0,
      pausedProjects: 0,
      completedProjects: 0,
    },
    projects: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProjects() {
      try {
        setLoading(true);
        setErrorMessage("");

        const params = new URLSearchParams();

        if (activeFilter) {
          params.set("status", activeFilter);
        }

        if (searchTerm.trim()) {
          params.set("search", searchTerm.trim());
        }

        const response = await fetch(`/api/freelancer/projects?${params}`, {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load projects.");
        }

        if (!ignore) {
          setProjectsData(result.data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || "Unable to load projects.");
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
  }, [activeFilter, searchTerm]);

  const projects = useMemo(() => {
    return (projectsData.projects || []).map(mapApiProject);
  }, [projectsData.projects]);

  const totalActiveValue = projects.reduce((sum, project) => {
    const activeValue = Number(
      String(project.activeAmountDisplay || "0").replace(/[₹,\s]/g, "")
    );

    return sum + (Number.isFinite(activeValue) ? activeValue : 0);
  }, 0);

  const activeCount = projectsData.stats?.activeProjects || 0;
  const pausedCount = projectsData.stats?.pausedProjects || 0;
  const completedCount = projectsData.stats?.completedProjects || 0;

  if (loading) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">
            Loading freelancer projects...
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
            Unable to load projects
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
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
            Projects
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Manage every client project from one place.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Track project status, client details, milestone progress, deadlines,
            and next actions across your freelancer work.
          </p>
        </div>

        <Link
          href="/freelancer/deal-rooms"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
        >
          <Handshake size={18} />
          Open Deal Rooms
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Active Projects",
            value: activeCount,
            helper: "Currently running",
            icon: FolderKanban,
          },
          {
            label: "Paused Projects",
            value: pausedCount,
            helper: "Temporarily stopped",
            icon: Clock3,
          },
          {
            label: "Active Value",
            value: formatCurrency(totalActiveValue),
            helper: "In-progress or submitted milestones",
            icon: IndianRupee,
          },
          {
            label: "Completed Projects",
            value: completedCount,
            helper: "Finished client projects",
            icon: CheckCircle2,
          },
        ].map((stat) => {
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

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f0d7c3] bg-[#fff7ed] text-[#7c341d]">
                  <Icon size={19} />
                </div>
              </div>

              <p className="mt-3 text-xs font-semibold text-[#9b7a64]">
                {stat.helper}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                Project List
              </h2>

              <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                Search, filter, and open project workspaces.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex h-11 min-w-[260px] items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4">
                <Search size={17} className="text-[#9b7a64]" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search projects..."
                  className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                  const active = activeFilter === filter.value;

                  return (
                    <button
                      key={filter.value}
                      onClick={() => setActiveFilter(filter.value)}
                      className={`rounded-full px-4 py-2 text-xs font-black transition ${
                        active
                          ? "bg-[#6f2e1c] text-white"
                          : "border border-[#eadfd2] bg-[#fffaf3] text-[#7c6858] hover:bg-[#fff7ed]"
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-[1.7rem] border border-[#eadfd2] bg-[#fffaf3] p-5 transition hover:border-[#d7c3b2] hover:bg-white"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={project.status} />
                      <PriorityBadge priority={project.priority} />

                      {project.unreadMessages > 0 && (
                        <span className="rounded-full border border-[#ddd6fe] bg-[#f5f3ff] px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#6d28d9]">
                          {project.unreadMessages} messages
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-xl font-black tracking-[-0.04em] text-[#24130c]">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm font-semibold text-[#9b7a64]">
                      {project.category}
                    </p>

                    <p className="mt-4 max-w-3xl text-sm leading-6 text-[#7c6858]">
                      {project.description}
                    </p>
                  </div>

                  <Link
                    href={`/freelancer/deal-rooms/${project.id}`}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]"
                  >
                    Open Room
                    <ArrowUpRight size={17} />
                  </Link>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#9b7a64]">
                      <UserRound size={15} />
                      <p className="text-[11px] font-black uppercase tracking-[0.16em]">
                        Client
                      </p>
                    </div>

                    <p className="text-sm font-black text-[#24130c]">
                      {project.client}
                    </p>

                    <p className="mt-1 truncate text-xs font-semibold text-[#9b7a64]">
                      {project.clientEmail}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#9b7a64]">
                      <IndianRupee size={15} />
                      <p className="text-[11px] font-black uppercase tracking-[0.16em]">
                        Budget
                      </p>
                    </div>

                    <p className="text-sm font-black text-[#24130c]">
                      {project.budgetDisplay}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                      Estimated total
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#9b7a64]">
                      <ShieldCheck size={15} />
                      <p className="text-[11px] font-black uppercase tracking-[0.16em]">
                        Active Value
                      </p>
                    </div>

                    <p className="text-sm font-black text-[#24130c]">
                      {project.activeAmountDisplay}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                      Approved {project.approvedAmountDisplay}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#9b7a64]">
                      <CalendarClock size={15} />
                      <p className="text-[11px] font-black uppercase tracking-[0.16em]">
                        Deadline
                      </p>
                    </div>

                    <p className="text-sm font-black text-[#24130c]">
                      {project.deadline}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                      Final delivery
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#9b7a64]">
                    <span>
                      Milestones {project.completedMilestones}/
                      {project.totalMilestones}
                    </span>
                    <span>{project.progress}%</span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#eadfd2]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6f2e1c] to-[#f4b454]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#eadfd2] bg-white p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <Clock3 size={16} className="text-[#b45309]" />

                    <p className="text-sm font-semibold text-[#7c6858]">
                      Next action:{" "}
                      <span className="font-black text-[#24130c]">
                        {project.nextAction}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {project.status === "ACTIVE" && (
                      <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] px-4 text-xs font-black text-white transition hover:bg-[#5b2416]">
                        <UploadCloud size={15} />
                        Submit Work
                      </button>
                    )}

                    <Link
                      href="/freelancer/messages"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-xs font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
                    >
                      <MessageSquare size={15} />
                      Message
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            {projects.length === 0 && (
              <EmptyState
                title="No projects found"
                text="Try changing the filter or search term."
              />
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
              <FolderKanban size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              Project status matters.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Each project status decides what actions are allowed. This will
              later be enforced by backend validation, not just UI.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Active projects allow milestone progress",
                "Paused projects should not accept new work",
                "Completed projects become read-only",
                "Cancelled projects should stay locked",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="text-[#f4b454]" />
                  <p className="text-sm font-semibold text-white/78">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Project Status Guide
            </h2>

            <div className="mt-5 space-y-3">
              {[
                ["ACTIVE", "Work is running. Milestones can be progressed."],
                ["PAUSED", "Project is temporarily stopped."],
                ["COMPLETED", "All work is completed and closed."],
                ["CANCELLED", "Project was cancelled and should be read-only."],
              ].map(([status, text]) => (
                <div
                  key={status}
                  className="rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4"
                >
                  <StatusBadge status={status} />
                  <p className="mt-2 text-sm leading-5 text-[#7c6858]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Backend Mapping
            </h2>

            <div className="mt-5 space-y-4">
              {[
                {
                  title: "Project",
                  text: "Stores title, client, freelancer, budget, deadline, and status.",
                  icon: FolderKanban,
                },
                {
                  title: "Proposal",
                  text: "Shows accepted proposal details for the assigned freelancer.",
                  icon: Handshake,
                },
                {
                  title: "Milestone",
                  text: "Tracks progress and work state per project.",
                  icon: ListChecks,
                },
                {
                  title: "Secure Filtering",
                  text: "API returns only projects assigned to the logged-in freelancer.",
                  icon: ShieldCheck,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#6f2e1c]">
                      <Icon size={17} />
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-[#24130c]">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-[#7c6858]">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}