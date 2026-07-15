"use client";

import Link from "next/link";
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

const project = {
  id: "trustones-client-portal",
  title: "TrustOnes Client Portal",
  client: "Cara Wilson",
  clientEmail: "cara@trustones.demo",
  status: "ACTIVE",
  budget: "₹42,000",
  deadline: "30 Jun 2026",
  category: "Full-stack Development",
  summary:
    "Build a premium client portal with project creation, milestones, funding status, and client-side review workflow.",
  terms:
    "Work will be completed milestone-wise. Freelancer can submit work only after the milestone is funded. Revisions must include a clear reason.",
  deliverables: [
    "Client dashboard UI",
    "Project creation flow",
    "Milestone management section",
    "Submission review interface",
  ],
};

const milestones = [
  {
    id: "MS-001",
    title: "Dashboard UI Polish",
    amount: "₹7,500",
    deadline: "18 Jun",
    status: "RELEASED",
    description: "Final polish for client dashboard cards and layout.",
  },
  {
    id: "MS-002",
    title: "Backend API Integration",
    amount: "₹8,500",
    deadline: "Tomorrow",
    status: "FUNDED",
    description: "Connect dashboard with project and milestone APIs.",
  },
  {
    id: "MS-003",
    title: "Submission Review Flow",
    amount: "₹9,000",
    deadline: "24 Jun",
    status: "PENDING",
    description: "Create client review, approval, and revision interface.",
  },
  {
    id: "MS-004",
    title: "Final Deployment",
    amount: "₹6,000",
    deadline: "30 Jun",
    status: "PENDING",
    description: "Deploy and test the complete client-side workflow.",
  },
];

const timeline = [
  {
    id: 1,
    title: "Project accepted",
    text: "You accepted Cara Wilson's project invitation.",
    time: "5 days ago",
    icon: Handshake,
  },
  {
    id: 2,
    title: "Milestone created",
    text: "Client added Backend API Integration milestone.",
    time: "3 days ago",
    icon: FileText,
  },
  {
    id: 3,
    title: "Payment verified",
    text: "Backend API Integration was marked as funded.",
    time: "2 hours ago",
    icon: IndianRupee,
  },
];

const messages = [
  {
    id: 1,
    sender: "Cara",
    text: "Please prioritize backend API integration before the submission review flow.",
    time: "10:30 AM",
    mine: false,
  },
  {
    id: 2,
    sender: "You",
    text: "Sure, I’ll submit the API integration milestone first.",
    time: "10:35 AM",
    mine: true,
  },
];

function StatusBadge({ status }) {
  const styles = {
    ACTIVE: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    FUNDED: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    PENDING: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
    RELEASED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    SUBMITTED: "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]",
    REVISION_REQUESTED: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    DISPUTED: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[status] || styles.PENDING
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function FreelancerDealRoomDetail({ projectId }) {
  const completed = milestones.filter((m) => m.status === "RELEASED").length;
  const progress = Math.round((completed / milestones.length) * 100);

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
                {project.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#eadfd2] bg-white px-5 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]">
                <MessageSquare size={18} />
                Message Client
              </button>

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
                {project.budget}
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
                {project.deadline}
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
                {completed}/{milestones.length} milestones released
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eadfd2]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6f2e1c] to-[#f4b454]"
                  style={{ width: `${progress}%` }}
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
              {project.deliverables.map((item) => (
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
                  Submit work only when a milestone is funded.
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
                        {milestone.amount}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#b45309]">
                        Due {milestone.deadline}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {milestone.status === "FUNDED" && (
                      <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]">
                        <UploadCloud size={17} />
                        Submit Work
                      </button>
                    )}

                    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-white px-5 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]">
                      View Details
                    </button>

                    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-5 text-sm font-black text-[#b91c1c] transition hover:bg-[#fee2e2]">
                      <ShieldAlert size={17} />
                      Raise Dispute
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Room Chat
            </h2>

            <div className="mt-5 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}
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
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <input
                type="text"
                placeholder="Type message..."
                className="h-12 flex-1 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
              />
              <button className="h-12 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white">
                Send
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <h2 className="text-xl font-black tracking-[-0.03em]">
              Activity Timeline
            </h2>

            <div className="mt-5 space-y-5">
              {timeline.map((item) => {
                const Icon = item.icon;

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