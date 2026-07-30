"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Handshake,
  IndianRupee,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  UserRound,
} from "lucide-react";

function StatusBadge({ status }) {
  const styles = {
    ACTIVE: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    PAUSED: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    COMPLETED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    CANCELLED: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
    PENDING: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
    IN_PROGRESS: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    SUBMITTED: "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]",
    APPROVED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    REVISION_REQUESTED: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
  };

  const normalizedStatus = String(status || "PENDING");

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

function timelineIcon(type) {
  const icons = {
    PROJECT: Handshake,
    PROPOSAL: CheckCircle2,
    MILESTONE: FileText,
    SUBMISSION: UploadCloud,
    APPROVED: CheckCircle2,
    REVISION: ShieldAlert,
  };

  return icons[type] || FileText;
}

function EmptyMessageBox() {
  return (
    <div className="rounded-2xl bg-[#fffaf3] p-5 text-center">
      <MessageSquare className="mx-auto text-[#6f2e1c]" size={22} />

      <h3 className="mt-3 text-sm font-black text-[#24130c]">
        Messages not connected yet
      </h3>

      <p className="mt-2 text-sm leading-5 text-[#7c6858]">
        Chat will become dynamic after we add the messages backend.
      </p>
    </div>
  );
}

export default function FreelancerDealRoomDetail({ projectId }) {
  const [detailData, setDetailData] = useState({
    dealRoom: null,
    timeline: [],
    messages: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadDealRoomDetail() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch(
          `/api/freelancer/deal-rooms/${encodeURIComponent(projectId)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load deal room detail."
          );
        }

        if (!ignore) {
          setDetailData(result.data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || "Unable to load deal room detail.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (projectId) {
      loadDealRoomDetail();
    } else {
      setErrorMessage("Project id is missing.");
      setLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [projectId]);

  const project = detailData.dealRoom;
  const milestones = project?.milestones || [];
  const timeline = detailData.timeline || [];
  const messages = detailData.messages || [];

  const progressData = useMemo(() => {
    const total = milestones.length;
    const completed = milestones.filter(
      (milestone) => milestone.status === "APPROVED"
    ).length;

    return {
      total,
      completed,
      progress: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }, [milestones]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">
            Loading deal room detail...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage || !project) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <Link
          href="/freelancer/deal-rooms"
          className="inline-flex w-fit items-center gap-2 text-sm font-black text-[#6f2e1c]"
        >
          <ArrowLeft size={17} />
          Back to deal rooms
        </Link>

        <div className="rounded-[2rem] border border-[#fecaca] bg-[#fff7f7] p-8 shadow-sm">
          <h2 className="text-xl font-black text-[#24130c]">
            Unable to load deal room
          </h2>

          <p className="mt-2 text-sm font-semibold text-[#b91c1c]">
            {errorMessage || "Deal room not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col gap-4">
        <Link
          href="/freelancer/deal-rooms"
          className="inline-flex w-fit items-center gap-2 text-sm font-black text-[#6f2e1c]"
        >
          <ArrowLeft size={17} />
          Back to deal rooms
        </Link>

        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={project.status} />

                <span className="rounded-full border border-[#eadfd2] bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#9b7a64]">
                  {project.category}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
                {project.title}
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#7c6858]">
                {project.summary || project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/freelancer/messages"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#eadfd2] bg-white px-5 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
              >
                <MessageSquare size={18} />
                Message Client
              </Link>

              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]">
                <UploadCloud size={18} />
                Submit Work
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white p-4">
              <div className="mb-2 flex items-center gap-2 text-[#9b7a64]">
                <UserRound size={15} />

                <p className="text-[11px] font-black uppercase tracking-[0.16em]">
                  Client
                </p>
              </div>

              <p className="text-sm font-black text-[#24130c]">
                {project.client?.name || "Client"}
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-[#9b7a64]">
                Private client profile
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
                Total project estimate
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <div className="mb-2 flex items-center gap-2 text-[#9b7a64]">
                <CalendarDays size={15} />

                <p className="text-[11px] font-black uppercase tracking-[0.16em]">
                  Deadline
                </p>
              </div>

              <p className="text-sm font-black text-[#24130c]">
                {project.deadlineDisplay}
              </p>

              <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                Final delivery target
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <div className="mb-2 flex items-center gap-2 text-[#9b7a64]">
                <ShieldCheck size={15} />

                <p className="text-[11px] font-black uppercase tracking-[0.16em]">
                  Progress
                </p>
              </div>

              <p className="text-sm font-black text-[#24130c]">
                {progressData.completed}/{progressData.total} milestones
                approved
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eadfd2]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6f2e1c] to-[#f4b454]"
                  style={{ width: `${progressData.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Agreement Snapshot
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#7c6858]">
              {project.terms}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {(project.deliverables || []).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#eadfd2] bg-[#fffaf3] px-3 py-1.5 text-xs font-bold text-[#7c6858]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                  Milestones
                </h2>

                <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                  Submit work when a milestone is in progress or revision is
                  requested.
                </p>
              </div>

              <ListChecksIcon />
            </div>

            <div className="space-y-4">
              {milestones.map((milestone) => (
                <article
                  key={milestone.id}
                  className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <StatusBadge status={milestone.status} />

                      <h3 className="mt-3 text-lg font-black tracking-[-0.03em] text-[#24130c]">
                        {milestone.title}
                      </h3>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c6858]">
                        {milestone.description}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-lg font-black text-[#24130c]">
                        {milestone.amountDisplay}
                      </p>

                      <p className="mt-1 text-xs font-bold text-[#b45309]">
                        Due {milestone.dueDateShortDisplay}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {(milestone.status === "IN_PROGRESS" ||
                      milestone.status === "REVISION_REQUESTED") && (
                      <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]">
                        <UploadCloud size={17} />
                        Submit Work
                      </button>
                    )}

                    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-white px-5 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]">
                      View Details
                    </button>

                    {milestone.status !== "APPROVED" && (
                      <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-5 text-sm font-black text-[#b91c1c] transition hover:bg-[#fee2e2]">
                        <ShieldAlert size={17} />
                        Raise Dispute
                      </button>
                    )}
                  </div>
                </article>
              ))}

              {milestones.length === 0 && (
                <div className="rounded-[1.5rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-8 text-center">
                  <p className="text-sm font-bold text-[#7c6858]">
                    No milestones have been added yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Room Chat
            </h2>

            <div className="mt-5 space-y-3">
              {messages.length === 0 ? (
                <EmptyMessageBox />
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.mine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-5 ${
                        msg.mine
                          ? "bg-[#6f2e1c] text-white"
                          : "bg-[#fffaf3] text-[#24130c]"
                      }`}
                    >
                      <p>{msg.text}</p>

                      <p
                        className={`mt-1 text-[11px] font-bold ${
                          msg.mine ? "text-white/55" : "text-[#9b7a64]"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <h2 className="text-xl font-black tracking-[-0.03em]">
              Activity Timeline
            </h2>

            <div className="mt-5 space-y-5">
              {timeline.map((item) => {
                const Icon = timelineIcon(item.type);

                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
                      <Icon size={17} />
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-white">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-white/65">
                        {item.text}
                      </p>

                      <p className="mt-1 text-xs font-bold text-[#f4b454]">
                        {item.time}
                      </p>
                    </div>
                  </div>
                );
              })}

              {timeline.length === 0 && (
                <p className="text-sm font-semibold text-white/65">
                  No timeline activity yet.
                </p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function ListChecksIcon() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f0d7c3] bg-[#fff7ed] text-[#7c341d]">
      <FileText size={19} />
    </div>
  );
}