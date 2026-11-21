"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  IndianRupee,
  ListChecks,
  MessageSquare,
  ShieldAlert,
  UploadCloud,
} from "lucide-react";
import FreelancerSubmitWorkModal from "@/components/freelancer/FreelancerSubmitWorkModal";

const filters = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Revision", value: "REVISION_REQUESTED" },
  { label: "Approved", value: "APPROVED" },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function StatusBadge({ status }) {
  const normalizedStatus = String(status || "PENDING");

  const styles = {
    PENDING: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
    IN_PROGRESS: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    SUBMITTED: "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]",
    REVISION_REQUESTED: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    APPROVED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    REJECTED: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[normalizedStatus] || styles.PENDING
      }`}
    >
      {normalizedStatus.split("_").join(" ")}
    </span>
  );
}

function statusIcon(status) {
  const icons = {
    PENDING: Clock3,
    IN_PROGRESS: IndianRupee,
    SUBMITTED: UploadCloud,
    REVISION_REQUESTED: AlertTriangle,
    APPROVED: CheckCircle2,
    REJECTED: AlertTriangle,
  };

  return icons[status] || Clock3;
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-[1.6rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
        <ListChecks size={24} />
      </div>

      <h3 className="mt-4 text-lg font-black text-[#24130c]">{title}</h3>

      <p className="mt-2 text-sm text-[#7c6858]">{text}</p>
    </div>
  );
}

function canSubmitMilestone(milestone) {
  return ["IN_PROGRESS", "REVISION_REQUESTED", "REJECTED"].includes(
    milestone?.status
  );
}

export default function FreelancerMilestonesPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [milestoneData, setMilestoneData] = useState({
    stats: {
      totalMilestones: 0,
      pendingMilestones: 0,
      inProgressMilestones: 0,
      submittedMilestones: 0,
      approvedMilestones: 0,
      revisionRequestedMilestones: 0,
      approvedAmount: 0,
      approvedAmountDisplay: "₹0",
      activeAmount: 0,
      activeAmountDisplay: "₹0",
    },
    milestones: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const loadMilestones = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const params = new URLSearchParams();

      if (activeFilter && activeFilter !== "ALL") {
        params.set("status", activeFilter);
      }

      const query = params.toString();

      const response = await fetch(
        `/api/freelancer/milestones${query ? `?${query}` : ""}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load milestones.");
      }

      setMilestoneData(result.data);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load milestones.");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadMilestones();
  }, [loadMilestones]);

  const milestones = milestoneData.milestones || [];
  const stats = milestoneData.stats || {};

  const readyToSubmit = Number(stats.inProgressMilestones || 0);
  const revisionCount = Number(stats.revisionRequestedMilestones || 0);

  const activeAmountDisplay = stats.activeAmountDisplay || formatCurrency(0);
  const approvedAmountDisplay = stats.approvedAmountDisplay || formatCurrency(0);

  const filteredMilestones = useMemo(() => milestones, [milestones]);

  function openSubmitModal(milestone) {
    if (!canSubmitMilestone(milestone)) {
      setNotice({
        type: "error",
        text: "Only in-progress or revision-requested milestones can be submitted.",
      });
      return;
    }

    setNotice({ type: "", text: "" });
    setSelectedMilestone(milestone);
    setSubmitModalOpen(true);
  }

  function openFirstSubmitableMilestone() {
    const milestone = milestones.find(canSubmitMilestone);

    if (!milestone) {
      setNotice({
        type: "error",
        text: "No milestone is ready for submission. Milestone must be funded and in progress first.",
      });
      return;
    }

    openSubmitModal(milestone);
  }

  async function handleSubmitted() {
    await loadMilestones();
    setNotice({
      type: "success",
      text: "Work submitted successfully. Milestone status has been refreshed.",
    });
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">
            Loading freelancer milestones...
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
            Unable to load milestones
          </h2>

          <p className="mt-2 text-sm font-semibold text-[#b91c1c]">
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[1480px] space-y-6">
        <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
              Milestone Center
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
              Track every pending, submitted, and approved milestone.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
              Submit secure preview proof, keep final delivery locked, and
              preserve every milestone submission version.
            </p>
          </div>

          <button
            type="button"
            onClick={openFirstSubmitableMilestone}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
          >
            <UploadCloud size={18} />
            Submit Work
          </button>
        </section>

        {notice.text && (
          <section
            className={`rounded-2xl border p-4 text-sm font-bold ${
              notice.type === "error"
                ? "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]"
                : "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]"
            }`}
          >
            {notice.text}
          </section>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Ready to Submit",
              value: readyToSubmit,
              helper: "In-progress milestones",
              icon: UploadCloud,
            },
            {
              label: "Active Amount",
              value: activeAmountDisplay,
              helper: "In-progress or submitted value",
              icon: IndianRupee,
            },
            {
              label: "Approved Earnings",
              value: approvedAmountDisplay,
              helper: "Approved milestone value",
              icon: CheckCircle2,
            },
            {
              label: "Revision Requests",
              value: revisionCount,
              helper: "Needs your response",
              icon: AlertTriangle,
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
                  All Milestones
                </h2>

                <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                  Filter by status and take action on active or revision
                  milestones.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                  const active = activeFilter === filter.value;

                  return (
                    <button
                      type="button"
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
              {filteredMilestones.map((milestone) => {
                const Icon = statusIcon(milestone.status);
                const dealRoomHref = milestone.project?.id
                  ? `/freelancer/deal-rooms/${milestone.project.id}`
                  : "/freelancer/deal-rooms";

                return (
                  <article
                    key={milestone.id}
                    className="rounded-[1.6rem] border border-[#eadfd2] bg-[#fffaf3] p-5 transition hover:border-[#d7c3b2] hover:bg-white"
                  >
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f2e1c] shadow-sm">
                          <Icon size={20} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={milestone.status} />

                            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#9b7a64]">
                              {milestone.id}
                            </span>
                          </div>

                          <h3 className="mt-4 text-xl font-black tracking-[-0.04em] text-[#24130c]">
                            {milestone.title}
                          </h3>

                          <p className="mt-1 text-sm font-semibold text-[#9b7a64]">
                            {milestone.project?.title || "Project"} • Client:{" "}
                            {milestone.client?.name || "Client"}
                          </p>

                          <p className="mt-4 max-w-3xl text-sm leading-6 text-[#7c6858]">
                            {milestone.description}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 rounded-2xl bg-white p-4 text-left lg:text-right">
                        <p className="text-lg font-black text-[#24130c]">
                          {milestone.amountDisplay}
                        </p>

                        <p className="mt-1 text-xs font-bold text-[#b45309]">
                          {milestone.due}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                          {milestone.dueDateDisplay}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#eadfd2] bg-white p-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarClock size={16} className="text-[#b45309]" />

                        <p className="text-sm font-semibold text-[#7c6858]">
                          Next action:{" "}
                          <span className="font-black text-[#24130c]">
                            {milestone.nextAction}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {canSubmitMilestone(milestone) && (
                          <button
                            type="button"
                            onClick={() => openSubmitModal(milestone)}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]"
                          >
                            <UploadCloud size={17} />
                            Submit Work
                          </button>
                        )}

                        <Link
                          href={dealRoomHref}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-[#fffaf3] px-5 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
                        >
                          <ArrowUpRight size={17} />
                          Open Room
                        </Link>

                        {milestone.status !== "APPROVED" && (
                          <button
                            type="button"
                            disabled
                            title="Dispute API will be added after dispute model."
                            className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-5 text-sm font-black text-[#b91c1c]/60"
                          >
                            <ShieldAlert size={17} />
                            Dispute Later
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}

              {filteredMilestones.length === 0 && (
                <EmptyState
                  title="No milestones found"
                  text="Try changing the filter or wait until a client creates milestones."
                />
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
                <ListChecks size={24} />
              </div>

              <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
                Milestone rule.
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/65">
                Submit work only when the milestone is active or revision has
                been requested. This protects your proof trail and keeps the
                project state clean.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  "Pending means not started yet",
                  "In progress means freelancer can work",
                  "Submitted means waiting for client review",
                  "Approved means milestone is completed",
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
                Submission Checklist
              </h2>

              <div className="mt-5 space-y-4">
                {[
                  {
                    title: "Add delivery notes",
                    text: "Explain what you completed clearly.",
                    icon: FileText,
                  },
                  {
                    title: "Attach preview proof",
                    text: "Use safe preview links, demo URLs, or watermarked assets.",
                    icon: UploadCloud,
                  },
                  {
                    title: "Lock final delivery",
                    text: "Final source/export should remain locked until approval.",
                    icon: ShieldAlert,
                  },
                  {
                    title: "Message client",
                    text: "Notify them after submitting work.",
                    icon: MessageSquare,
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

            <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                  Status Meaning
                </h2>

                <Filter size={20} className="text-[#6f2e1c]" />
              </div>

              <div className="space-y-3">
                {[
                  ["PENDING", "Waiting to begin or be confirmed."],
                  ["IN_PROGRESS", "Freelancer can work and submit."],
                  ["SUBMITTED", "Work submitted and awaiting client review."],
                  ["REVISION_REQUESTED", "Client asked for changes."],
                  ["APPROVED", "Milestone completed and approved."],
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
          </aside>
        </section>
      </div>

      <FreelancerSubmitWorkModal
        open={submitModalOpen}
        milestone={selectedMilestone}
        onClose={() => {
          setSubmitModalOpen(false);
          setSelectedMilestone(null);
        }}
        onSubmitted={handleSubmitted}
      />
    </>
  );
}