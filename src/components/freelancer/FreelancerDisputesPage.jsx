"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Gavel,
  Paperclip,
  Plus,
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";

const disputes = [
  {
    id: "DSP-001",
    title: "Revision request without clear reason",
    project: "Healthcare Appointment UI",
    milestone: "Responsive Dashboard UI",
    client: "MedLink Labs",
    status: "UNDER_REVIEW",
    priority: "Medium",
    raisedAt: "16 Jun 2026",
    amount: "₹6,000",
    reason:
      "Client requested multiple changes but did not provide a clear reason or acceptance criteria.",
    evidenceCount: 3,
    timeline: [
      {
        title: "Dispute raised",
        text: "You raised a dispute for unclear revision request.",
        time: "16 Jun, 10:30 AM",
      },
      {
        title: "Evidence submitted",
        text: "You attached screenshots and milestone notes.",
        time: "16 Jun, 10:40 AM",
      },
      {
        title: "Admin reviewing",
        text: "Admin started reviewing timeline and submission history.",
        time: "Today, 09:15 AM",
      },
    ],
  },
  {
    id: "DSP-002",
    title: "Payment release delayed",
    project: "Portfolio Website Redesign",
    milestone: "Wireframe Approval",
    client: "Ananya Studio",
    status: "RESOLVED",
    priority: "Low",
    raisedAt: "10 Jun 2026",
    amount: "₹4,000",
    reason:
      "Milestone was approved, but payment release status was delayed inside the workspace.",
    evidenceCount: 2,
    decision: "Freelancer favour",
    timeline: [
      {
        title: "Dispute raised",
        text: "You raised a payment delay dispute.",
        time: "10 Jun, 12:20 PM",
      },
      {
        title: "Admin checked payment record",
        text: "Webhook and milestone status were verified.",
        time: "10 Jun, 02:10 PM",
      },
      {
        title: "Dispute resolved",
        text: "Admin resolved dispute in freelancer favour.",
        time: "11 Jun, 11:00 AM",
      },
    ],
  },
  {
    id: "DSP-003",
    title: "Scope changed after acceptance",
    project: "TrustOnes Client Portal",
    milestone: "Backend API Integration",
    client: "Cara Wilson",
    status: "OPEN",
    priority: "High",
    raisedAt: "Today",
    amount: "₹8,500",
    reason:
      "Client added extra backend requirements after the milestone was already confirmed.",
    evidenceCount: 1,
    timeline: [
      {
        title: "Dispute raised",
        text: "You raised a scope change dispute.",
        time: "Today, 01:15 PM",
      },
    ],
  },
];

const filters = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Resolved", value: "RESOLVED" },
];

const projects = [
  "TrustOnes Client Portal",
  "Healthcare Appointment UI",
  "Portfolio Website Redesign",
];

const milestones = [
  "Backend API Integration",
  "Responsive Dashboard UI",
  "Wireframe Approval",
  "Final Deployment",
];

function StatusBadge({ status }) {
  const styles = {
    OPEN: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
    UNDER_REVIEW: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    RESOLVED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    CANCELLED: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
  };

  const labels = {
    OPEN: "Open",
    UNDER_REVIEW: "Under Review",
    RESOLVED: "Resolved",
    CANCELLED: "Cancelled",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[status] || styles.OPEN
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
    Medium: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    Low: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[priority] || styles.Medium
      }`}
    >
      {priority}
    </span>
  );
}

export default function FreelancerDisputesPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);

  const filteredDisputes = useMemo(() => {
    if (activeFilter === "ALL") return disputes;
    return disputes.filter((item) => item.status === activeFilter);
  }, [activeFilter]);

  const openCount = disputes.filter((item) => item.status === "OPEN").length;
  const reviewCount = disputes.filter(
    (item) => item.status === "UNDER_REVIEW"
  ).length;
  const resolvedCount = disputes.filter(
    (item) => item.status === "RESOLVED"
  ).length;

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
            Dispute Center
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Raise and track project disputes with proof.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Submit disputes for payment delays, unclear revisions, rejected work,
            or scope changes. Every dispute should be backed by timeline evidence.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
        >
          <Plus size={18} />
          Raise Dispute
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Open Disputes",
            value: openCount,
            helper: "Waiting for admin pickup",
            icon: ShieldAlert,
          },
          {
            label: "Under Review",
            value: reviewCount,
            helper: "Admin is checking evidence",
            icon: Gavel,
          },
          {
            label: "Resolved",
            value: resolvedCount,
            helper: "Completed dispute cases",
            icon: CheckCircle2,
          },
          {
            label: "Evidence Files",
            value: "6",
            helper: "Attached across disputes",
            icon: Paperclip,
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
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                Your Disputes
              </h2>
              <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                Track dispute progress and admin review status.
              </p>
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

          <div className="space-y-4">
            {filteredDisputes.map((dispute) => (
              <article
                key={dispute.id}
                className="rounded-[1.7rem] border border-[#eadfd2] bg-[#fffaf3] p-5 transition hover:border-[#d7c3b2] hover:bg-white"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={dispute.status} />
                      <PriorityBadge priority={dispute.priority} />
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#9b7a64]">
                        {dispute.id}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-black tracking-[-0.04em] text-[#24130c]">
                      {dispute.title}
                    </h3>

                    <p className="mt-2 text-sm font-semibold text-[#9b7a64]">
                      {dispute.project} • {dispute.milestone}
                    </p>

                    <p className="mt-4 max-w-3xl text-sm leading-6 text-[#7c6858]">
                      {dispute.reason}
                    </p>
                  </div>

                  <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f2e1c] shadow-sm transition hover:bg-[#fff7ed]">
                    <ArrowUpRight size={18} />
                  </button>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b79d88]">
                      Client
                    </p>
                    <p className="mt-1 text-sm font-black text-[#24130c]">
                      {dispute.client}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b79d88]">
                      Amount
                    </p>
                    <p className="mt-1 text-sm font-black text-[#24130c]">
                      {dispute.amount}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b79d88]">
                      Raised
                    </p>
                    <p className="mt-1 text-sm font-black text-[#24130c]">
                      {dispute.raisedAt}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b79d88]">
                      Evidence
                    </p>
                    <p className="mt-1 text-sm font-black text-[#24130c]">
                      {dispute.evidenceCount} files/links
                    </p>
                  </div>
                </div>

                {dispute.decision && (
                  <div className="mt-5 rounded-2xl border border-[#a7f3d0] bg-[#ecfdf5] p-4">
                    <p className="text-sm font-black text-[#047857]">
                      Admin Decision: {dispute.decision}
                    </p>
                  </div>
                )}

                <div className="mt-5 rounded-2xl border border-[#eadfd2] bg-white p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <CalendarClock size={16} className="text-[#6f2e1c]" />
                    <p className="text-sm font-black text-[#24130c]">
                      Dispute Timeline
                    </p>
                  </div>

                  <div className="space-y-4">
                    {dispute.timeline.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#6f2e1c]" />

                        <div>
                          <h4 className="text-sm font-black text-[#24130c]">
                            {item.title}
                          </h4>
                          <p className="mt-1 text-sm leading-5 text-[#7c6858]">
                            {item.text}
                          </p>
                          <p className="mt-1 text-xs font-bold text-[#b79d88]">
                            {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              Evidence wins disputes.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Add screenshots, submission links, milestone notes, revision
              requests, and chat proof. Admins resolve better when evidence is
              structured.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Attach clear screenshots",
                "Mention project and milestone",
                "Explain the exact issue",
                "Keep tone factual and professional",
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
              Raise Dispute When
            </h2>

            <div className="mt-5 space-y-4">
              {[
                {
                  title: "Payment issue",
                  text: "Funding or release status is incorrect or delayed.",
                  icon: Clock3,
                },
                {
                  title: "Unclear revision",
                  text: "Client requested changes without a clear reason.",
                  icon: FileText,
                },
                {
                  title: "Scope change",
                  text: "New work was added after agreement.",
                  icon: AlertTriangle,
                },
                {
                  title: "Rejected work conflict",
                  text: "Work was rejected despite matching deliverables.",
                  icon: ShieldAlert,
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

      {showModal && <RaiseDisputeModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function RaiseDisputeModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#120905]/55 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
              New Dispute
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#24130c]">
              Raise a dispute for admin review
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#7c6858]">
              Select the project, milestone, reason, and attach evidence. This
              will be visible to admin during resolution.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f2e1c] shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        <form className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-black text-[#24130c]">
                Project
              </span>
              <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
                <option>Select project</option>
                {projects.map((project) => (
                  <option key={project}>{project}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-black text-[#24130c]">
                Milestone
              </span>
              <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
                <option>Select milestone</option>
                {milestones.map((milestone) => (
                  <option key={milestone}>{milestone}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-black text-[#24130c]">
              Dispute Type
            </span>
            <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
              <option>Payment issue</option>
              <option>Unclear revision request</option>
              <option>Scope change after agreement</option>
              <option>Rejected work conflict</option>
              <option>Other issue</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-black text-[#24130c]">
              Reason
            </span>
            <textarea
              rows={5}
              placeholder="Explain the issue clearly. Mention what happened, when it happened, and what evidence supports your claim."
              className="mt-2 w-full resize-none rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
            />
          </label>

          <div className="rounded-2xl border border-dashed border-[#d7c3b2] bg-white p-5">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#6f2e1c]">
                <UploadCloud size={22} />
              </div>

              <h3 className="mt-3 text-sm font-black text-[#24130c]">
                Upload evidence
              </h3>

              <p className="mt-1 max-w-sm text-sm leading-5 text-[#7c6858]">
                Add screenshots, PDF, document, submission proof, or payment
                related evidence.
              </p>

              <button
                type="button"
                className="mt-4 rounded-xl border border-[#eadfd2] bg-[#fffaf3] px-5 py-2.5 text-sm font-black text-[#6f2e1c]"
              >
                Choose files
              </button>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-2xl border border-[#eadfd2] bg-white px-5 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
            >
              Cancel
            </button>

            <button
              type="button"
              className="h-12 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
            >
              Submit Dispute
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}