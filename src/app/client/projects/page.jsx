"use client";

import Link from "next/link";
import { projectDate, projectPreview, projectMoney } from "@/lib/project-presentation";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  FolderKanban,
  IndianRupee,
  Plus,
  Search,
  UserRound,
} from "lucide-react";

const statusFilters = ["All", "Draft", "Open", "Active", "Paused", "Completed", "Cancelled"];

function listingStatus(project) {
  return project.status === "OPEN" && !project.publishedAt ? "DRAFT" : project.status;
}

const statusStyles = {
  OPEN: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
  ACTIVE: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
  PAUSED: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
  COMPLETED: "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]",
  CANCELLED: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
};

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-black tracking-wide ${
        statusStyles[status] || statusStyles.OPEN
      }`}
    >
      {String(status || "OPEN").split("_").join(" ")}
    </span>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  useEffect(() => {
    let ignore = false;

    async function fetchProjects() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/projects", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch projects.");
        }

        if (!ignore) {
          setProjects(data.projects || []);
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message || "Unable to fetch projects.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !term ||
        project.title?.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term) ||
        project.category?.toLowerCase().includes(term);

      const matchesStatus =
        activeStatus === "All" || listingStatus(project) === activeStatus.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, activeStatus]);

  const totalBudget = projects.reduce(
    (sum, project) => sum + Number(project.budget || 0),
    0
  );

  const stats = [
    {
      label: "Total Projects",
      value: String(projects.length),
      helper: "Across all statuses",
      icon: FolderKanban,
    },
    {
      label: "Open",
      value: String(projects.filter((p) => listingStatus(p) === "OPEN").length),
      helper: "Published open projects",
      icon: Plus,
    },
    {
      label: "Active",
      value: String(projects.filter((p) => p.status === "ACTIVE").length),
      helper: "Work in progress",
      icon: CheckCircle2,
    },
    {
      label: "Total Budget",
      value: formatCurrency(totalBudget),
      helper: "Across listed projects",
      icon: IndianRupee,
    },
  ];

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7c6858]">
            Projects
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#24130c]">
            Your projects
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Track milestones, freelancers, and escrow progress from one place.
          </p>
        </div>

        <Link
          href="/client/projects/create"
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
        >
          <Plus size={18} />
          Post a Project
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
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

              <p className="mt-3 text-xs font-semibold text-[#7c6858]">
                {stat.helper}
              </p>
            </div>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-white/80 px-4 py-3">
            <Search size={18} className="shrink-0 text-[#7c6858]" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search projects, categories..."
              className="w-full bg-transparent text-sm font-medium text-[#2b1810] outline-none placeholder:text-[#806049]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {statusFilters.map((status) => {
              const active = activeStatus === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatus(status)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-[#6f2e1c] text-white shadow-lg shadow-[#6f2e1c]/20"
                      : "border border-[#eadfd2] bg-white/80 text-[#7a4a34] hover:bg-white"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          <p className="text-sm font-bold text-[#7c6858]">
            {filteredProjects.length} shown
          </p>
        </div>
      </section>

      {loading && (
        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">
            Loading projects...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-[2rem] border border-[#fecaca] bg-[#fff7f7] p-8 shadow-sm">
          <p className="text-sm font-semibold text-[#b91c1c]">{error}</p>
        </div>
      )}

      {!loading && !error && filteredProjects.length === 0 && (
        <div className="rounded-[2rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-10 text-center shadow-sm">
          <h2 className="text-lg font-black text-[#24130c]">
            No projects match this view
          </h2>

          <p className="mt-2 text-sm font-semibold text-[#7c6858]">
            Try a different status filter, or post a new project to get started.
          </p>

          <Link
            href="/client/projects/create"
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]"
          >
            <Plus size={16} />
            Post a Project
          </Link>
        </div>
      )}

      {!loading && !error && filteredProjects.length > 0 && (
        <section className="grid gap-5 xl:grid-cols-2">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <StatusBadge status={listingStatus(project)} />

                  <h2 className="mt-3 [overflow-wrap:anywhere] text-xl font-black tracking-[-0.03em] text-[#24130c]">
                    {project.title}
                  </h2>

                  <p className="mt-1 text-xs font-semibold text-[#7c6858]">
                    {project.category}
                  </p>
                </div>


              </div>

              <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#7c6858]">
                {projectPreview(project.description)}
              </p>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#7c6858]">
                  <span>
                    Milestones {project.completedMilestones || 0}/
                    {project.totalMilestones || 0} approved
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

              <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4 text-center">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#806049]">
                    {project.acceptedOfferId ? "Contract value" : project.status === "OPEN" ? "Listed budget" : "Project budget"}
                  </p>

                  <p className="mt-1 text-sm font-black text-[#24130c]">
                    {formatCurrency(project.budget)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#806049]">
                    Approved work value
                  </p>

                  <p className="mt-1 text-sm font-black text-[#24130c]">
                    {formatCurrency(project.spent)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#806049]">
                    Milestone allocation
                  </p>

                  <p className="mt-1 text-sm font-black text-[#047857]">
                    {projectMoney(project.milestones.reduce((sum, m) => sum + Number(m.amount), 0))}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <UserRound size={16} className="shrink-0 text-[#7c6858]" />

                  <p className="truncate text-sm font-semibold text-[#7c6858]">
                    {project.freelancer?.name || "No freelancer hired yet"}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-[#7c6858]">
                  <CalendarClock size={14} />
                  {project.acceptedOfferId ? "Agreed delivery" : "Deadline"} · {projectDate(project.deadline)}
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Link
                  href={`/client/projects/${project.id}`}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[#6f2e1c] text-sm font-black text-white transition hover:bg-[#5b2416]"
                >
                  View details
                </Link>

                {project.status === "OPEN" && !project._count?.proposals && <Link
                  href={`/client/projects/${project.id}/edit`}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-[#eadfd2] bg-white text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
                >
                  Edit
                </Link>}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
