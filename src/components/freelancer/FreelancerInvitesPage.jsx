"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Handshake,
  IndianRupee,
  Mail,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const filters = [
  { label: "All", value: "ALL" },
  { label: "Awaiting Client", value: "PENDING" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
];

function statusBadge(status) {
  const styles = {
    PENDING: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    ACCEPTED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    REJECTED: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
    WITHDRAWN: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
  };

  const labels = {
    PENDING: "Awaiting Client",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[status] || styles.PENDING
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[1.6rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
        <Mail size={24} />
      </div>

      <h3 className="mt-4 text-lg font-black text-[#24130c]">
        No proposal responses found
      </h3>

      <p className="mt-2 text-sm text-[#7c6858]">
        Once you submit proposals or clients respond, they will appear here.
      </p>
    </div>
  );
}

function mapApiProposal(proposal) {
  const project = proposal.project || {};
  const client = proposal.client || {};

  return {
    id: proposal.id,
    title: project.title || "Untitled Project",
    projectId: project.id,
    client: client.name || "Client",
    clientEmail: "Private client profile",
    category: project.category || "General",
    budget: proposal.bidAmountDisplay || "₹0",
    projectBudget: project.budgetDisplay || "Not specified",
    deadline: project.deadlineDisplay || "No deadline",
    receivedAt: proposal.createdAtDisplay || "No date",
    status: proposal.status || "PENDING",
    summary: project.description || "No project description available.",
    terms: proposal.coverLetter || "No proposal note available.",
    nextAction: proposal.nextAction || "View details",
    estimatedDays: proposal.estimatedDays || 0,
    deliverables: [
      `Your bid: ${proposal.bidAmountDisplay || "₹0"}`,
      `Estimated delivery: ${proposal.estimatedDays || 0} days`,
      `Project budget: ${project.budgetDisplay || "Not specified"}`,
    ],
  };
}

export default function FreelancerInvitesPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [inviteData, setInviteData] = useState({
    stats: {
      totalProposals: 0,
      pendingProposals: 0,
      acceptedProposals: 0,
      rejectedProposals: 0,
      withdrawnProposals: 0,
      pendingValueDisplay: "₹0",
      acceptedValueDisplay: "₹0",
    },
    proposals: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadInvites() {
      try {
        setLoading(true);
        setErrorMessage("");

        const params = new URLSearchParams();

        if (activeFilter) {
          params.set("status", activeFilter);
        }

        const response = await fetch(`/api/freelancer/invites?${params}`, {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load proposal responses."
          );
        }

        if (!ignore) {
          setInviteData(result.data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error.message || "Unable to load proposal responses."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInvites();

    return () => {
      ignore = true;
    };
  }, [activeFilter]);

  const invites = useMemo(() => {
    return (inviteData.proposals || []).map(mapApiProposal);
  }, [inviteData.proposals]);

  const stats = inviteData.stats || {};

  const inviteStats = [
    {
      label: "Awaiting Client",
      value: stats.pendingProposals || 0,
      helper: "Proposals waiting for response",
      icon: Mail,
    },
    {
      label: "Accepted Proposals",
      value: stats.acceptedProposals || 0,
      helper: "Moved to active project flow",
      icon: CheckCircle2,
    },
    {
      label: "Accepted Value",
      value: stats.acceptedValueDisplay || "₹0",
      helper: "Accepted bid value",
      icon: IndianRupee,
    },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">
            Loading proposal responses...
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
            Unable to load proposal responses
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
            Freelancer Proposals
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Track client responses to your project proposals.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Review proposals you sent, check client response status, bid value,
            project scope, and next action from one place.
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

      <section className="grid gap-4 md:grid-cols-3">
        {inviteStats.map((stat) => {
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
                Proposal Responses
              </h2>

              <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                Review your submitted proposals and current client response.
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
            {invites.map((invite) => (
              <article
                key={invite.id}
                className="rounded-[1.6rem] border border-[#eadfd2] bg-[#fffaf3] p-5 transition hover:border-[#d7c3b2] hover:bg-white"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {statusBadge(invite.status)}

                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#9b7a64]">
                        {invite.id}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-black tracking-[-0.04em] text-[#24130c]">
                      {invite.title}
                    </h3>

                    <p className="mt-2 text-sm font-semibold text-[#9b7a64]">
                      {invite.category}
                    </p>

                    <p className="mt-4 max-w-3xl text-sm leading-6 text-[#7c6858]">
                      {invite.summary}
                    </p>
                  </div>

                  <Link
                    href={
                      invite.status === "ACCEPTED" && invite.projectId
                        ? `/freelancer/deal-rooms/${invite.projectId}`
                        : "/freelancer/projects"
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f2e1c] shadow-sm transition hover:bg-[#fff7ed]"
                  >
                    <ArrowUpRight size={18} />
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
                      {invite.client}
                    </p>

                    <p className="mt-1 truncate text-xs font-semibold text-[#9b7a64]">
                      {invite.clientEmail}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#9b7a64]">
                      <IndianRupee size={15} />

                      <p className="text-[11px] font-black uppercase tracking-[0.16em]">
                        Your Bid
                      </p>
                    </div>

                    <p className="text-sm font-black text-[#24130c]">
                      {invite.budget}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                      Project budget {invite.projectBudget}
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
                      {invite.deadline}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                      Submitted {invite.receivedAt}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#9b7a64]">
                      <BriefcaseBusiness size={15} />

                      <p className="text-[11px] font-black uppercase tracking-[0.16em]">
                        Delivery
                      </p>
                    </div>

                    <p className="text-sm font-black text-[#24130c]">
                      {invite.estimatedDays} days
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                      Estimated by freelancer
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#eadfd2] bg-white p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-[#6f2e1c]" />

                    <p className="text-sm font-black text-[#24130c]">
                      Proposal note
                    </p>
                  </div>

                  <p className="text-sm leading-6 text-[#7c6858]">
                    {invite.terms}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {invite.deliverables.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#eadfd2] bg-[#fffaf3] px-3 py-1.5 text-xs font-bold text-[#7c6858]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-semibold text-[#9b7a64]">
                    Current action:{" "}
                    <span className="font-black text-[#24130c]">
                      {invite.nextAction}
                    </span>
                  </p>

                  {invite.status === "ACCEPTED" ? (
                    <Link
                      href={`/freelancer/deal-rooms/${invite.projectId}`}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#047857] px-5 text-sm font-black text-white transition hover:bg-[#036c4d]"
                    >
                      <Handshake size={17} />
                      Open Deal Room
                    </Link>
                  ) : invite.status === "PENDING" ? (
                    <button
                      type="button"
                      disabled
                      className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#6f2e1c]/70 px-5 text-sm font-black text-white"
                    >
                      <Clock3 size={17} />
                      Waiting for Client
                    </button>
                  ) : invite.status === "REJECTED" ? (
                    <button
                      type="button"
                      disabled
                      className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-5 text-sm font-black text-[#b91c1c]"
                    >
                      <XCircle size={17} />
                      Rejected
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-white px-5 text-sm font-black text-[#7c6858]"
                    >
                      <XCircle size={17} />
                      Withdrawn
                    </button>
                  )}
                </div>
              </article>
            ))}

            {invites.length === 0 && <EmptyState />}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              Proposal responses matter.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              In the current MVP, this page tracks proposals submitted by the
              freelancer. Client-side invite creation can be added later as a
              separate flow.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Pending means waiting for client decision",
                "Accepted means project can move to deal room",
                "Rejected means client declined the proposal",
                "Withdrawn means freelancer removed the proposal",
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
              Current Flow
            </h2>

            <div className="mt-5 space-y-4">
              {[
                {
                  step: "01",
                  title: "Freelancer submits proposal",
                  text: "Proposal stores bid amount, cover letter, and estimated days.",
                },
                {
                  step: "02",
                  title: "Client reviews proposal",
                  text: "Client can accept or reject from client-side workflow.",
                },
                {
                  step: "03",
                  title: "Accepted proposal",
                  text: "Project gets assigned to the freelancer.",
                },
                {
                  step: "04",
                  title: "Deal room opens",
                  text: "Milestones and project execution continue from deal room.",
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