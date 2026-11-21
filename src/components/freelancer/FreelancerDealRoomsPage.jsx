"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Handshake,
  IndianRupee,
  ListChecks,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

function StatusBadge({ status }) {
  const styles = {
    ACTIVE: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    PAUSED: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    COMPLETED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    CANCELLED: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[status] || styles.ACTIVE
      }`}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[1.7rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
        <Handshake size={24} />
      </div>

      <h3 className="mt-4 text-lg font-black text-[#24130c]">
        No deal rooms found
      </h3>

      <p className="mt-2 text-sm text-[#7c6858]">
        Accepted projects assigned to you will appear here.
      </p>
    </div>
  );
}

function mapApiRoom(room) {
  return {
    id: room.id,
    title: room.title,
    client: room.client?.name || "Client",
    status: room.status || "ACTIVE",
    budget: room.budgetDisplay || "₹0",
    deadline: room.deadlineDisplay || "No deadline",
    milestonesDone: room.milestoneSummary?.approved || 0,
    milestonesTotal: room.milestoneSummary?.total || 0,
    fundedAmount: room.milestoneSummary?.activeAmountDisplay || "₹0",
    approvedAmount: room.milestoneSummary?.approvedAmountDisplay || "₹0",
    nextAction: room.nextAction || "Open deal room",
    unreadMessages: 0,
    health: room.health || "READY",
  };
}

export default function FreelancerDealRoomsPage() {
  const [dealRoomData, setDealRoomData] = useState({
    stats: {
      totalDealRooms: 0,
      activeDealRooms: 0,
      pausedDealRooms: 0,
      completedDealRooms: 0,
      actionRequiredMilestones: 0,
      submittedMilestones: 0,
      approvedAmountDisplay: "₹0",
    },
    dealRooms: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadDealRooms() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch("/api/freelancer/deal-rooms", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load deal rooms.");
        }

        if (!ignore) {
          setDealRoomData(result.data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || "Unable to load deal rooms.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDealRooms();

    return () => {
      ignore = true;
    };
  }, []);

  const dealRooms = useMemo(() => {
    return (dealRoomData.dealRooms || []).map(mapApiRoom);
  }, [dealRoomData.dealRooms]);

  const stats = dealRoomData.stats || {};

  if (loading) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">
            Loading freelancer deal rooms...
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
            Unable to load deal rooms
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
            Deal Rooms
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Manage your secure client workspaces.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Each deal room keeps project terms, milestones, payment funding,
            submissions, messages, and timeline evidence in one place.
          </p>
        </div>

        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]">
          <Handshake size={18} />
          View Active Deals
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: "Active Rooms",
            value: stats.activeDealRooms || 0,
            icon: Handshake,
          },
          {
            label: "Approved Value",
            value: stats.approvedAmountDisplay || "₹0",
            icon: IndianRupee,
          },
          {
            label: "Action Required",
            value: stats.actionRequiredMilestones || 0,
            icon: ListChecks,
          },
          {
            label: "Submitted Work",
            value: stats.submittedMilestones || 0,
            icon: MessageSquare,
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
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Your Deal Rooms
            </h2>

            <p className="mt-1 text-sm font-medium text-[#9b7a64]">
              Open a room to manage milestones, terms, submissions, and timeline.
            </p>
          </div>

          <div className="space-y-4">
            {dealRooms.map((room) => {
              const progress =
                room.milestonesTotal === 0
                  ? 0
                  : Math.round((room.milestonesDone / room.milestonesTotal) * 100);

              return (
                <article
                  key={room.id}
                  className="rounded-[1.7rem] border border-[#eadfd2] bg-[#fffaf3] p-5 transition hover:border-[#d7c3b2] hover:bg-white"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={room.status} />

                        {room.health === "NEEDS_ATTENTION" && (
                          <span className="rounded-full border border-[#fecaca] bg-[#fef2f2] px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#b91c1c]">
                            Needs attention
                          </span>
                        )}

                        {room.health === "WAITING_CLIENT" && (
                          <span className="rounded-full border border-[#ddd6fe] bg-[#f5f3ff] px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#6d28d9]">
                            Waiting client
                          </span>
                        )}

                        {room.unreadMessages > 0 && (
                          <span className="rounded-full border border-[#f0d7c3] bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#7c341d]">
                            {room.unreadMessages} messages
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-xl font-black tracking-[-0.04em] text-[#24130c]">
                        {room.title}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-[#9b7a64]">
                        Client: {room.client}
                      </p>
                    </div>

                    <Link
                      href={`/freelancer/deal-rooms/${room.id}`}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]"
                    >
                      Open Room
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white p-4">
                      <div className="mb-2 flex items-center gap-2 text-[#9b7a64]">
                        <IndianRupee size={15} />
                        <p className="text-[11px] font-black uppercase tracking-[0.16em]">
                          Budget
                        </p>
                      </div>

                      <p className="text-sm font-black text-[#24130c]">
                        {room.budget}
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
                        {room.fundedAmount}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                        Approved {room.approvedAmount}
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
                        {room.deadline}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#9b7a64]">
                      <span>
                        Milestones {room.milestonesDone}/{room.milestonesTotal}
                      </span>

                      <span>{progress}%</span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-[#eadfd2]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6f2e1c] to-[#f4b454]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3">
                    <Clock3 size={16} className="text-[#b45309]" />

                    <p className="text-sm font-semibold text-[#7c6858]">
                      Next action:{" "}
                      <span className="font-black text-[#24130c]">
                        {room.nextAction}
                      </span>
                    </p>
                  </div>
                </article>
              );
            })}

            {dealRooms.length === 0 && <EmptyState />}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              Proof-first collaboration.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Keep every payment, milestone, revision, and submission inside the
              room so both sides have a clean proof trail.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Confirm accepted terms",
                "Track milestone states",
                "Submit work only after funding",
                "Use timeline as dispute evidence",
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
              Room Lifecycle
            </h2>

            <div className="mt-5 space-y-4">
              {[
                {
                  step: "01",
                  title: "Proposal accepted",
                  text: "Project gets assigned to the freelancer.",
                },
                {
                  step: "02",
                  title: "Milestones created",
                  text: "Client and freelancer track deliverables.",
                },
                {
                  step: "03",
                  title: "Work submitted",
                  text: "Freelancer submits milestone work.",
                },
                {
                  step: "04",
                  title: "Work approved",
                  text: "Milestone becomes approved and counted as completed.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff7ed] text-sm font-black text-[#6f2e1c]">
                    {item.step}
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
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}