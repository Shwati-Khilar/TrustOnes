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
import { useState } from "react";

const inviteStats = [
  {
    label: "Pending Invites",
    value: "2",
    helper: "Awaiting your response",
    icon: Mail,
  },
  {
    label: "Accepted This Month",
    value: "5",
    helper: "Projects moved to deal room",
    icon: CheckCircle2,
  },
  {
    label: "Avg Response Time",
    value: "3.4h",
    helper: "Faster replies improve trust",
    icon: Clock3,
  },
];

const invites = [
  {
    id: "INV-001",
    title: "E-commerce Landing Page",
    client: "Rahul Mehta",
    clientEmail: "rahul@mehtadigital.com",
    category: "Frontend Development",
    budget: "₹18,000",
    deadline: "28 Jun 2026",
    receivedAt: "2 hours ago",
    status: "NEW",
    summary:
      "Build a premium landing page for an e-commerce product with responsive sections, payment CTA, and admin preview-ready UI.",
    terms:
      "Work will be divided into UI implementation, responsive polish, and final deployment support.",
    deliverables: [
      "Responsive landing page",
      "Product hero section",
      "CTA and pricing section",
      "Deployment-ready frontend",
    ],
  },
  {
    id: "INV-002",
    title: "Portfolio Website Redesign",
    client: "Ananya Studio",
    clientEmail: "hello@ananyastudio.in",
    category: "UI/UX + Frontend",
    budget: "₹12,500",
    deadline: "02 Jul 2026",
    receivedAt: "Yesterday",
    status: "REVIEW_TERMS",
    summary:
      "Redesign an existing creative portfolio with smoother layout, better typography, animations, and improved mobile experience.",
    terms:
      "Client wants milestone confirmation before project activation. Revision cycles should be clearly defined.",
    deliverables: [
      "Homepage redesign",
      "Project showcase section",
      "Mobile responsive layout",
      "Animation polish",
    ],
  },
  {
    id: "INV-003",
    title: "Healthcare Dashboard UI",
    client: "MedLink Labs",
    clientEmail: "ops@medlinklabs.com",
    category: "Dashboard Design",
    budget: "₹30,000",
    deadline: "10 Jul 2026",
    receivedAt: "3 days ago",
    status: "ACCEPTED",
    summary:
      "Design and implement a clean healthcare dashboard for appointments, patient history, and documents.",
    terms:
      "Accepted. Deal room is ready for milestone discussion and payment setup.",
    deliverables: [
      "Dashboard overview",
      "Appointment history",
      "Document cards",
      "Chat panel layout",
    ],
  },
];

const filters = [
  { label: "All", value: "ALL" },
  { label: "New", value: "NEW" },
  { label: "Review Terms", value: "REVIEW_TERMS" },
  { label: "Accepted", value: "ACCEPTED" },
];

function statusBadge(status) {
  const styles = {
    NEW: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    REVIEW_TERMS: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    ACCEPTED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    REJECTED: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
  };

  const labels = {
    NEW: "New Invite",
    REVIEW_TERMS: "Review Terms",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[status] || styles.NEW
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

export default function FreelancerInvitesPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredInvites =
    activeFilter === "ALL"
      ? invites
      : invites.filter((invite) => invite.status === activeFilter);

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
            Freelancer Invites
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Project invitations waiting for your decision.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Review client project requests, check terms, understand deliverables,
            and accept only when the scope feels clear.
          </p>
        </div>

        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]">
          <Handshake size={18} />
          Open Deal Rooms
        </button>
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
                Invite Requests
              </h2>
              <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                Review project details before accepting.
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
            {filteredInvites.map((invite) => (
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

                  <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f2e1c] shadow-sm transition hover:bg-[#fff7ed]">
                    <ArrowUpRight size={18} />
                  </button>
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
                        Budget
                      </p>
                    </div>
                    <p className="text-sm font-black text-[#24130c]">
                      {invite.budget}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                      Estimated project value
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
                      Received {invite.receivedAt}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#9b7a64]">
                      <BriefcaseBusiness size={15} />
                      <p className="text-[11px] font-black uppercase tracking-[0.16em]">
                        Scope
                      </p>
                    </div>
                    <p className="text-sm font-black text-[#24130c]">
                      {invite.deliverables.length} deliverables
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                      Milestones will be discussed
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#eadfd2] bg-white p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-[#6f2e1c]" />
                    <p className="text-sm font-black text-[#24130c]">
                      Terms summary
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
                    Accepting will move this project into your deal room for
                    milestone and payment confirmation.
                  </p>

                  {invite.status !== "ACCEPTED" ? (
                    <div className="flex gap-3">
                      <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]">
                        <CheckCircle2 size={17} />
                        Accept
                      </button>

                      <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-white px-5 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]">
                        <XCircle size={17} />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#047857] px-5 text-sm font-black text-white transition hover:bg-[#036c4d]">
                      <Handshake size={17} />
                      Open Deal Room
                    </button>
                  )}
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
              Accept only clear work.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Before accepting, check budget, deadline, deliverables, and
              revision expectations. Clear scope keeps your trust score strong.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Review project terms carefully",
                "Confirm milestone structure",
                "Check payment/funding expectations",
                "Avoid vague deliverables",
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
              Invite Flow
            </h2>

            <div className="mt-5 space-y-4">
              {[
                {
                  step: "01",
                  title: "Client sends invite",
                  text: "You receive it on dashboard, email, and notifications.",
                },
                {
                  step: "02",
                  title: "Review project",
                  text: "Check budget, scope, deadline, and deliverables.",
                },
                {
                  step: "03",
                  title: "Accept or reject",
                  text: "Accepted invites move into deal room.",
                },
                {
                  step: "04",
                  title: "Set milestones",
                  text: "Both sides confirm payment and milestone structure.",
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