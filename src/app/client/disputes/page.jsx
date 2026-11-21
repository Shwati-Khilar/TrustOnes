"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  ShieldAlert,
  X,
} from "lucide-react";

const initialDisputes = [
  {
    id: "DSP-001",
    project: "Airline Booking System",
    milestone: "Payment Gateway",
    freelancer: "Rahul Sharma",
    reason: "Incomplete Delivery",
    evidence: "invoice.pdf",
    status: "Open",
    date: "10 Jul 2026",
  },
  {
    id: "DSP-002",
    project: "OCR Medicine Scanner",
    milestone: "Dashboard UI",
    freelancer: "Aisha Khan",
    reason: "Poor Quality",
    evidence: "screenshots.zip",
    status: "Under Review",
    date: "08 Jul 2026",
  },
  {
    id: "DSP-003",
    project: "Portfolio Website",
    milestone: "Final Submission",
    freelancer: "John Smith",
    reason: "Delay",
    evidence: "chat.pdf",
    status: "Resolved",
    date: "01 Jul 2026",
  },
];

const statusStyles = {
  Open: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
  "Under Review": "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
  Resolved: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
};

const reasons = [
  "Incomplete Delivery",
  "Poor Quality",
  "Missed Deadline",
  "Scope Mismatch",
  "Other",
];

export default function DisputesPage() {
  const [disputes, setDisputes] = useState(initialDisputes);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    projectId: "",
    reason: "Incomplete Delivery",
    notes: "",
  });

  useEffect(() => {
    let ignore = false;

    async function loadProjects() {
      try {
        const response = await fetch("/api/projects", { cache: "no-store" });
        const data = await response.json();

        if (!ignore && response.ok) {
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("CLIENT_DISPUTES_PROJECTS_ERROR", error);
      }
    }

    loadProjects();

    return () => {
      ignore = true;
    };
  }, []);

  const openCount = disputes.filter((d) => d.status === "Open").length;
  const reviewCount = disputes.filter((d) => d.status === "Under Review").length;
  const resolvedCount = disputes.filter((d) => d.status === "Resolved").length;

  const stats = [
    {
      label: "Open Disputes",
      value: String(openCount),
      helper: "Waiting on freelancer",
      icon: ShieldAlert,
      tone: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
    },
    {
      label: "Under Review",
      value: String(reviewCount),
      helper: "With TrustOnes support",
      icon: Clock3,
      tone: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    },
    {
      label: "Resolved",
      value: String(resolvedCount),
      helper: "Closed successfully",
      icon: CheckCircle2,
      tone: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    },
  ];

  function handleSubmit(event) {
    event.preventDefault();

    const project = projects.find((item) => item.id === form.projectId);

    const newDispute = {
      id: `DSP-${String(disputes.length + 1).padStart(3, "0")}`,
      project: project?.title || "Untitled project",
      milestone: "Whole project",
      freelancer: project?.freelancer?.name || "Not assigned",
      reason: form.reason,
      evidence: form.notes ? "notes.pdf" : "No evidence",
      status: "Open",
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    setDisputes((current) => [newDispute, ...current]);
    setForm({ projectId: "", reason: "Incomplete Delivery", notes: "" });
    setShowForm(false);
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7c6858]">
            Disputes
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#24130c]">
            Disputes centre
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Raise and track project disputes with evidence submission and
            TrustOnes review. Escrow funds stay locked until a dispute is
            resolved.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Close" : "Raise Dispute"}
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-[#5f4a3c]">
                    {stat.label}
                  </p>

                  <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c]">
                    {stat.value}
                  </h3>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${stat.tone}`}
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

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-6 shadow-sm"
        >
          <h2 className="text-lg font-black text-[#24130c]">
            Raise a new dispute
          </h2>

          <p className="mt-1 text-sm font-semibold text-[#7c6858]">
            Keep evidence factual. Support reviews every dispute before funds
            move.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#806049]">
                Project
              </label>

              <select
                required
                value={form.projectId}
                onChange={(event) =>
                  setForm({ ...form, projectId: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
              >
                <option value="">Select a project</option>

                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#806049]">
                Reason
              </label>

              <select
                value={form.reason}
                onChange={(event) =>
                  setForm({ ...form, reason: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
              >
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#806049]">
              What went wrong
            </label>

            <textarea
              rows={4}
              value={form.notes}
              onChange={(event) =>
                setForm({ ...form, notes: event.target.value })
              }
              placeholder="Describe the issue, dates, and what was promised..."
              className="mt-2 w-full resize-none rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm font-medium text-[#24130c] outline-none placeholder:text-[#a99a88] focus:border-[#6f2e1c]"
            />
          </div>

          <button
            type="submit"
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]"
          >
            <AlertTriangle size={16} />
            Submit dispute
          </button>
        </form>
      )}

      <section className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
        <h2 className="text-lg font-black text-[#24130c]">
          Dispute history
        </h2>

        <p className="mt-1 text-sm font-semibold text-[#7c6858]">
          Every case with its evidence and current status.
        </p>

        <div className="mt-5 space-y-3">
          {disputes.map((dispute) => (
            <div
              key={dispute.id}
              className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-black tracking-wide ${
                      statusStyles[dispute.status]
                    }`}
                  >
                    {dispute.status}
                  </span>

                  <h3 className="mt-3 truncate text-base font-black text-[#24130c]">
                    {dispute.project}
                  </h3>

                  <p className="mt-1 text-xs font-semibold text-[#7c6858]">
                    Milestone: {dispute.milestone} • Freelancer:{" "}
                    {dispute.freelancer}
                  </p>
                </div>

                <div className="text-right text-xs font-bold text-[#806049]">
                  <p>{dispute.id}</p>
                  <p className="mt-1">{dispute.date}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#806049]">
                    Reason
                  </p>

                  <p className="mt-1 text-sm font-black text-[#24130c]">
                    {dispute.reason}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#806049]">
                    Evidence
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-sm font-black text-[#24130c]">
                    <FileText size={14} className="text-[#806049]" />
                    {dispute.evidence}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/client/projects"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl border border-[#eadfd2] bg-white px-5 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
        >
          Back to projects
        </Link>
      </section>
    </div>
  );
}
