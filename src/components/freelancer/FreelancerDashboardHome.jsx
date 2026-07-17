import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Handshake,
  IndianRupee,
  Inbox,
  ListChecks,
  ShieldCheck,
  Star,
  UploadCloud,
  Wallet,
} from "lucide-react";

const stats = [
  {
    label: "Active Projects",
    value: "4",
    helper: "2 require updates this week",
    icon: Handshake,
    tone: "brown",
  },
  {
    label: "Pending Invites",
    value: "2",
    helper: "Awaiting your response",
    icon: Inbox,
    tone: "amber",
  },
  {
    label: "Funded Milestones",
    value: "3",
    helper: "Ready for submission",
    icon: ListChecks,
    tone: "green",
  },
  {
    label: "Wallet Balance",
    value: "₹12,400",
    helper: "Sandbox released earnings",
    icon: Wallet,
    tone: "blue",
  },
];

const projectInvites = [
  {
    id: 1,
    title: "E-commerce Landing Page",
    client: "Rahul Mehta",
    budget: "₹18,000",
    deadline: "28 Jun",
    summary: "Frontend landing page with payment CTA and admin preview.",
    status: "New Invite",
  },
  {
    id: 2,
    title: "Portfolio Website Redesign",
    client: "Ananya Studio",
    budget: "₹12,500",
    deadline: "02 Jul",
    summary: "Modern portfolio revamp with responsive animations.",
    status: "Review Terms",
  },
];

const activeProjects = [
  {
    id: 1,
    title: "TrustOnes Client Portal",
    client: "Cara Wilson",
    budget: "₹42,000",
    progress: 68,
    completed: 3,
    total: 5,
    next: "Submit dashboard polish",
    status: "Active",
  },
  {
    id: 2,
    title: "Healthcare Appointment UI",
    client: "MedLink Labs",
    budget: "₹30,000",
    progress: 42,
    completed: 2,
    total: 6,
    next: "Waiting for milestone funding",
    status: "Accepted",
  },
];

const milestones = [
  {
    id: 1,
    title: "Backend API Integration",
    project: "TrustOnes Client Portal",
    amount: "₹8,500",
    due: "Tomorrow",
    status: "FUNDED",
  },
  {
    id: 2,
    title: "Responsive Dashboard UI",
    project: "Healthcare Appointment UI",
    amount: "₹6,000",
    due: "21 Jun",
    status: "REVISION_REQUESTED",
  },
  {
    id: 3,
    title: "Final Deployment",
    project: "Portfolio Website Redesign",
    amount: "₹4,500",
    due: "24 Jun",
    status: "PENDING",
  },
];

const activities = [
  {
    id: 1,
    title: "Milestone funded",
    description: "Backend API Integration funded by Cara Wilson.",
    time: "2 hours ago",
    icon: IndianRupee,
  },
  {
    id: 2,
    title: "New project invite",
    description: "Rahul Mehta invited you to E-commerce Landing Page.",
    time: "Yesterday",
    icon: Inbox,
  },
  {
    id: 3,
    title: "Revision requested",
    description: "Client requested changes in Responsive Dashboard UI.",
    time: "2 days ago",
    icon: FileText,
  },
  {
    id: 4,
    title: "Submission approved",
    description: "Wireframe milestone approved successfully.",
    time: "3 days ago",
    icon: CheckCircle2,
  },
];

function toneClasses(tone) {
  const tones = {
    brown: "bg-[#fff7ed] text-[#7c341d] border-[#f0d7c3]",
    amber: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    green: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    blue: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
  };

  return tones[tone] || tones.brown;
}

function StatusBadge({ status }) {
  const styles = {
    FUNDED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    REVISION_REQUESTED: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    PENDING: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
    ACTIVE: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-black tracking-wide ${
        styles[status] || styles.PENDING
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function FreelancerDashboardHome() {
  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="grid gap-5 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="overflow-hidden rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] shadow-sm">
          <div className="relative p-6 sm:p-7">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#f4b454]/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-[#6f2e1c]/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
                  Freelancer Workspace
                </p>

                <h1 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] text-[#24130c] sm:text-4xl">
                  Welcome back, Kushaagra. Your secure deals are moving forward.
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-[#7c6858]">
                  Track invites, funded milestones, deadlines, submissions, and
                  client actions from one trusted workspace.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[340px]">
                <button className="rounded-2xl bg-[#6f2e1c] px-5 py-4 text-left text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]">
                  View Invites
                  <span className="mt-1 block text-xs font-semibold text-white/65">
                    2 pending responses
                  </span>
                </button>

                <button className="rounded-2xl border border-[#eadfd2] bg-white px-5 py-4 text-left text-sm font-black text-[#6f2e1c] shadow-sm transition hover:bg-[#fff7ed]">
                  Open Deal Room
                  <span className="mt-1 block text-xs font-semibold text-[#9b7a64]">
                    Continue negotiation
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-black text-[#24130c]">Trust Score</p>
              <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                Based on client reviews, delivery, and disputes
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#b45309]">
              <Star size={20} fill="currentColor" />
            </div>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <h2 className="text-5xl font-black tracking-[-0.06em] text-[#24130c]">
              94
            </h2>
            <p className="pb-2 text-sm font-bold text-[#9b7a64]">/100</p>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#eadfd2]">
            <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-[#6f2e1c] to-[#f4b454]" />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-white p-3">
              <p className="text-sm font-black text-[#24130c]">4.8</p>
              <p className="text-[11px] font-semibold text-[#9b7a64]">
                Rating
              </p>
            </div>

            <div className="rounded-2xl bg-white p-3">
              <p className="text-sm font-black text-[#24130c]">18</p>
              <p className="text-[11px] font-semibold text-[#9b7a64]">
                Jobs
              </p>
            </div>

            <div className="rounded-2xl bg-white p-3">
              <p className="text-sm font-black text-[#24130c]">0</p>
              <p className="text-[11px] font-semibold text-[#9b7a64]">
                Disputes
              </p>
            </div>
          </div>
        </div>
      </section>

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

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${toneClasses(
                    stat.tone
                  )}`}
                >
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

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                Pending Project Invites
              </h2>
              <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                Accept or reject client invitations
              </p>
            </div>

            <button className="hidden text-sm font-black text-[#6f2e1c] sm:block">
              View all →
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {projectInvites.map((invite) => (
              <div
                key={invite.id}
                className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <StatusBadge status="PENDING" />
                    <h3 className="mt-4 text-lg font-black tracking-[-0.03em] text-[#24130c]">
                      {invite.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-[#9b7a64]">
                      Client: {invite.client}
                    </p>
                  </div>

                  <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#6f2e1c] shadow-sm">
                    <ArrowUpRight size={18} />
                  </button>
                </div>

                <p className="mt-4 text-sm leading-6 text-[#7c6858]">
                  {invite.summary}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#b79d88]">
                      Budget
                    </p>
                    <p className="mt-1 text-sm font-black text-[#24130c]">
                      {invite.budget}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#b79d88]">
                      Deadline
                    </p>
                    <p className="mt-1 text-sm font-black text-[#24130c]">
                      {invite.deadline}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button className="h-11 flex-1 rounded-xl bg-[#6f2e1c] text-sm font-black text-white transition hover:bg-[#5b2416]">
                    Accept
                  </button>
                  <button className="h-11 flex-1 rounded-xl border border-[#eadfd2] bg-white text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                Upcoming Deadlines
              </h2>
              <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                Your nearest project commitments
              </p>
            </div>

            <CalendarClock className="text-[#6f2e1c]" size={22} />
          </div>

          <div className="space-y-3">
            {milestones.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-[#24130c]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                      {item.project}
                    </p>
                  </div>

                  <p className="text-xs font-black text-[#b45309]">
                    {item.due}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge status={item.status} />
                  <p className="text-sm font-black text-[#24130c]">
                    {item.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                Active Projects
              </h2>
              <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                Current work progress and next actions
              </p>
            </div>

            <button className="text-sm font-black text-[#6f2e1c]">
              All projects →
            </button>
          </div>

          <div className="space-y-4">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-5"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <StatusBadge status="ACTIVE" />
                    <h3 className="mt-3 text-lg font-black tracking-[-0.03em] text-[#24130c]">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-[#9b7a64]">
                      Client: {project.client} • Budget: {project.budget}
                    </p>
                  </div>

                  <button className="rounded-xl border border-[#eadfd2] bg-white px-4 py-2 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]">
                    Open Deal Room
                  </button>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#9b7a64]">
                    <span>
                      Milestones {project.completed}/{project.total} completed
                    </span>
                    <span>{project.progress}%</span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#eadfd2]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6f2e1c] to-[#f4b454]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3">
                  <Clock3 size={16} className="text-[#b45309]" />
                  <p className="text-sm font-semibold text-[#7c6858]">
                    Next action:{" "}
                    <span className="font-black text-[#24130c]">
                      {project.next}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                Recent Activity
              </h2>
              <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                Latest timeline events
              </p>
            </div>

            <ShieldCheck className="text-[#047857]" size={22} />
          </div>

          <div className="space-y-5">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#6f2e1c]">
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-[#24130c]">
                      {activity.title}
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-[#7c6858]">
                      {activity.description}
                    </p>
                    <p className="mt-1 text-xs font-bold text-[#b79d88]">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f4b454]">
              Ready for submission
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">
              You have 3 funded milestones waiting for work submission.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              Submit funded milestones with notes, file links, GitHub links, or
              demo URLs. Each submission will later become part of the audit
              timeline.
            </p>
          </div>

          <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#f4b454] px-5 text-sm font-black text-[#2b1810] transition hover:bg-[#ffd28c]">
            <UploadCloud size={18} />
            Submit Work
          </button>
        </div>
      </section>
    </div>
  );
}