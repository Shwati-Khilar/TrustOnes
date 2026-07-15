import Link from "next/link";
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

const dealRooms = [
  {
    id: "trustones-client-portal",
    title: "TrustOnes Client Portal",
    client: "Cara Wilson",
    status: "ACTIVE",
    budget: "₹42,000",
    deadline: "30 Jun 2026",
    milestonesDone: 3,
    milestonesTotal: 5,
    fundedAmount: "₹18,500",
    nextAction: "Submit Backend API Integration",
    unreadMessages: 2,
  },
  {
    id: "healthcare-dashboard-ui",
    title: "Healthcare Dashboard UI",
    client: "MedLink Labs",
    status: "ACCEPTED",
    budget: "₹30,000",
    deadline: "10 Jul 2026",
    milestonesDone: 1,
    milestonesTotal: 4,
    fundedAmount: "₹6,000",
    nextAction: "Confirm milestone structure",
    unreadMessages: 1,
  },
  {
    id: "portfolio-redesign",
    title: "Portfolio Website Redesign",
    client: "Ananya Studio",
    status: "NEGOTIATING",
    budget: "₹12,500",
    deadline: "02 Jul 2026",
    milestonesDone: 0,
    milestonesTotal: 3,
    fundedAmount: "₹0",
    nextAction: "Waiting for client milestone confirmation",
    unreadMessages: 0,
  },
];

function StatusBadge({ status }) {
  const styles = {
    ACTIVE: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    ACCEPTED: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    NEGOTIATING: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    DISPUTED: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[status] || styles.ACCEPTED
      }`}
    >
      {status}
    </span>
  );
}

export default function FreelancerDealRoomsPage() {
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
            value: "3",
            icon: Handshake,
          },
          {
            label: "Funded Value",
            value: "₹24,500",
            icon: IndianRupee,
          },
          {
            label: "Open Milestones",
            value: "7",
            icon: ListChecks,
          },
          {
            label: "Unread Messages",
            value: "3",
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
              const progress = Math.round(
                (room.milestonesDone / room.milestonesTotal) * 100
              );

              return (
                <article
                  key={room.id}
                  className="rounded-[1.7rem] border border-[#eadfd2] bg-[#fffaf3] p-5 transition hover:border-[#d7c3b2] hover:bg-white"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={room.status} />

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
                          Funded
                        </p>
                      </div>
                      <p className="text-sm font-black text-[#24130c]">
                        {room.fundedAmount}
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
                  title: "Invite accepted",
                  text: "Project enters deal discussion mode.",
                },
                {
                  step: "02",
                  title: "Milestones confirmed",
                  text: "Client and freelancer agree on deliverables.",
                },
                {
                  step: "03",
                  title: "Payment verified",
                  text: "Milestone becomes funded after webhook verification.",
                },
                {
                  step: "04",
                  title: "Work submitted",
                  text: "Submission history and timeline evidence are created.",
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