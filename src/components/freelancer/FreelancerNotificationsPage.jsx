"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CalendarClock,
  CheckCheck,
  CheckCircle2,
  Clock3,
  Filter,
  Handshake,
  Inbox,
  IndianRupee,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Star,
  UploadCloud,
  Wallet,
} from "lucide-react";

const notifications = [
  {
    id: "NOT-001",
    type: "INVITE",
    title: "New project invite received",
    message:
      "Rahul Mehta invited you to work on E-commerce Landing Page with an estimated budget of ₹18,000.",
    project: "E-commerce Landing Page",
    time: "2 hours ago",
    status: "UNREAD",
    priority: "HIGH",
    actionLabel: "View Invite",
  },
  {
    id: "NOT-002",
    type: "PAYMENT",
    title: "Milestone funded",
    message:
      "Backend API Integration milestone has been funded and is ready for submission.",
    project: "TrustOnes Client Portal",
    time: "4 hours ago",
    status: "UNREAD",
    priority: "HIGH",
    actionLabel: "Submit Work",
  },
  {
    id: "NOT-003",
    type: "DEADLINE",
    title: "Deadline approaching",
    message:
      "Backend API Integration milestone deadline is tomorrow. Submit your work before the due date.",
    project: "TrustOnes Client Portal",
    time: "Today",
    status: "UNREAD",
    priority: "MEDIUM",
    actionLabel: "Open Milestone",
  },
  {
    id: "NOT-004",
    type: "MESSAGE",
    title: "New message from client",
    message:
      "Cara Wilson sent a message regarding API endpoints and submission notes.",
    project: "TrustOnes Client Portal",
    time: "Today",
    status: "UNREAD",
    priority: "MEDIUM",
    actionLabel: "Open Chat",
  },
  {
    id: "NOT-005",
    type: "REVISION",
    title: "Revision requested",
    message:
      "MedLink Labs requested changes in Responsive Dashboard UI milestone.",
    project: "Healthcare Appointment UI",
    time: "Yesterday",
    status: "READ",
    priority: "MEDIUM",
    actionLabel: "Review Request",
  },
  {
    id: "NOT-006",
    type: "DISPUTE",
    title: "Dispute moved to admin review",
    message:
      "Your dispute for unclear revision request is now under admin review.",
    project: "Healthcare Appointment UI",
    time: "Yesterday",
    status: "READ",
    priority: "HIGH",
    actionLabel: "View Dispute",
  },
  {
    id: "NOT-007",
    type: "WALLET",
    title: "Milestone amount released",
    message:
      "₹7,500 was released to your sandbox wallet from Dashboard UI Polish milestone.",
    project: "TrustOnes Client Portal",
    time: "2 days ago",
    status: "READ",
    priority: "LOW",
    actionLabel: "Open Wallet",
  },
  {
    id: "NOT-008",
    type: "REVIEW",
    title: "New client review received",
    message:
      "Cara Wilson gave you a 5-star review for TrustOnes Client Portal.",
    project: "TrustOnes Client Portal",
    time: "3 days ago",
    status: "READ",
    priority: "LOW",
    actionLabel: "View Review",
  },
];

const filters = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Unread",
    value: "UNREAD",
  },
  {
    label: "Invites",
    value: "INVITE",
  },
  {
    label: "Payments",
    value: "PAYMENT",
  },
  {
    label: "Deadlines",
    value: "DEADLINE",
  },
  {
    label: "Disputes",
    value: "DISPUTE",
  },
  {
    label: "Messages",
    value: "MESSAGE",
  },
];

function notificationIcon(type) {
  const icons = {
    INVITE: Inbox,
    PAYMENT: IndianRupee,
    DEADLINE: CalendarClock,
    MESSAGE: MessageSquare,
    REVISION: UploadCloud,
    DISPUTE: ShieldAlert,
    WALLET: Wallet,
    REVIEW: Star,
  };

  return icons[type] || Bell;
}

function notificationTone(type) {
  const tones = {
    INVITE: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    PAYMENT: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    DEADLINE: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    MESSAGE: "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]",
    REVISION: "bg-[#fff7ed] text-[#b45309] border-[#f0d7c3]",
    DISPUTE: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
    WALLET: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    REVIEW: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
  };

  return tones[type] || tones.INVITE;
}

function PriorityBadge({ priority }) {
  const styles = {
    HIGH: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
    MEDIUM: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    LOW: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[priority] || styles.MEDIUM
      }`}
    >
      {priority}
    </span>
  );
}

function ReadBadge({ status }) {
  const isUnread = status === "UNREAD";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        isUnread
          ? "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]"
          : "border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]"
      }`}
    >
      {isUnread ? "Unread" : "Read"}
    </span>
  );
}

export default function FreelancerNotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [items, setItems] = useState(notifications);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "ALL") return items;

    if (activeFilter === "UNREAD") {
      return items.filter((item) => item.status === "UNREAD");
    }

    return items.filter((item) => item.type === activeFilter);
  }, [activeFilter, items]);

  const unreadCount = items.filter((item) => item.status === "UNREAD").length;
  const highPriorityCount = items.filter(
    (item) => item.priority === "HIGH" && item.status === "UNREAD"
  ).length;
  const deadlineCount = items.filter((item) => item.type === "DEADLINE").length;
  const paymentCount = items.filter(
    (item) => item.type === "PAYMENT" || item.type === "WALLET"
  ).length;

  function markAllAsRead() {
    setItems((currentItems) =>
      currentItems.map((item) => ({
        ...item,
        status: "READ",
      }))
    );
  }

  function markOneAsRead(id) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "READ",
            }
          : item
      )
    );
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
            Notifications
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Stay updated on invites, deadlines, payments, and disputes.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Track all important freelancer actions from one notification center.
            Later, these alerts will be generated from project, milestone,
            payment, message, and dispute events.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
        >
          <CheckCheck size={18} />
          Mark all as read
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Unread Alerts",
            value: unreadCount,
            helper: "Need your attention",
            icon: Bell,
          },
          {
            label: "High Priority",
            value: highPriorityCount,
            helper: "Important active alerts",
            icon: AlertTriangle,
          },
          {
            label: "Deadline Alerts",
            value: deadlineCount,
            helper: "Upcoming milestone due dates",
            icon: CalendarClock,
          },
          {
            label: "Payment Updates",
            value: paymentCount,
            helper: "Funding and wallet changes",
            icon: IndianRupee,
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
                Notification Center
              </h2>

              <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                Filter alerts by type and open the related workspace.
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
            {filteredNotifications.map((notification) => {
              const Icon = notificationIcon(notification.type);

              return (
                <article
                  key={notification.id}
                  className={`rounded-[1.6rem] border p-5 transition hover:border-[#d7c3b2] hover:bg-white ${
                    notification.status === "UNREAD"
                      ? "border-[#d7c3b2] bg-[#fff7ed]"
                      : "border-[#eadfd2] bg-[#fffaf3]"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div className="flex gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${notificationTone(
                          notification.type
                        )}`}
                      >
                        <Icon size={20} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <ReadBadge status={notification.status} />
                          <PriorityBadge priority={notification.priority} />
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#9b7a64]">
                            {notification.type}
                          </span>
                        </div>

                        <h3 className="mt-4 text-xl font-black tracking-[-0.04em] text-[#24130c]">
                          {notification.title}
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-[#9b7a64]">
                          {notification.project}
                        </p>

                        <p className="mt-4 max-w-3xl text-sm leading-6 text-[#7c6858]">
                          {notification.message}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#b79d88]">
                          <Clock3 size={14} />
                          {notification.time}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-3 lg:flex-col">
                      <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]">
                        {notification.actionLabel}
                        <ArrowUpRight size={17} />
                      </button>

                      {notification.status === "UNREAD" && (
                        <button
                          onClick={() => markOneAsRead(notification.id)}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-white px-5 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
                        >
                          <CheckCircle2 size={17} />
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredNotifications.length === 0 && (
              <div className="rounded-[1.6rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
                  <Bell size={24} />
                </div>

                <h3 className="mt-4 text-lg font-black text-[#24130c]">
                  No notifications found
                </h3>

                <p className="mt-2 text-sm text-[#7c6858]">
                  Try switching filters or check again later.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              Action-first alerts.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Notifications should always guide the freelancer to the next
              correct action — accept invite, submit work, respond to revision,
              or open dispute.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Invites should be accepted quickly",
                "Funded milestones need submission",
                "Deadline alerts prevent delays",
                "Dispute updates need attention",
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
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                Alert Types
              </h2>

              <Filter size={20} className="text-[#6f2e1c]" />
            </div>

            <div className="space-y-3">
              {[
                {
                  type: "INVITE",
                  title: "Project invites",
                  text: "Client invites and accept/reject actions.",
                  icon: Inbox,
                },
                {
                  type: "PAYMENT",
                  title: "Payment updates",
                  text: "Funding, release, and wallet events.",
                  icon: IndianRupee,
                },
                {
                  type: "DEADLINE",
                  title: "Deadline reminders",
                  text: "Upcoming milestone and project due dates.",
                  icon: CalendarClock,
                },
                {
                  type: "DISPUTE",
                  title: "Dispute alerts",
                  text: "Admin review, decisions, and evidence updates.",
                  icon: ShieldAlert,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.type}
                    className="rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4"
                  >
                    <div className="flex gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${notificationTone(
                          item.type
                        )}`}
                      >
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
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Backend-ready Mapping
            </h2>

            <div className="mt-5 space-y-4">
              {[
                {
                  title: "ProjectInvitation",
                  text: "Creates invite notifications.",
                  icon: Handshake,
                },
                {
                  title: "Milestone",
                  text: "Creates deadline, funded, submitted, and revision alerts.",
                  icon: UploadCloud,
                },
                {
                  title: "PaymentTransaction",
                  text: "Creates funding and wallet notifications.",
                  icon: Wallet,
                },
                {
                  title: "Dispute",
                  text: "Creates dispute status and admin decision alerts.",
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
    </div>
  );
}