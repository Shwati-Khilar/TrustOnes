"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  Wallet,
} from "lucide-react";

const initialNotificationData = {
  stats: {
    totalNotifications: 0,
    unreadNotifications: 0,
    actionRequiredNotifications: 0,
    highPriorityNotifications: 0,
    proposalNotifications: 0,
    milestoneNotifications: 0,
  },
  notifications: [],
};

const filters = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Action Required",
    value: "ACTION_REQUIRED",
  },
  {
    label: "Proposals",
    value: "PROPOSAL",
  },
  {
    label: "Milestones",
    value: "MILESTONE",
  },
  {
    label: "Deal Rooms",
    value: "PROJECT",
  },
  {
    label: "High Priority",
    value: "HIGH",
  },
];

function toTitleCase(value) {
  return String(value || "")
    .split("_")
    .join(" ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function notificationIcon(notification) {
  if (notification.category === "PROPOSAL") return Handshake;
  if (notification.category === "PROJECT") return Inbox;

  if (notification.status === "APPROVED") return IndianRupee;
  if (notification.status === "REJECTED") return ShieldAlert;
  if (notification.status === "SUBMITTED") return Clock3;
  if (notification.status === "IN_PROGRESS") return UploadCloud;

  return Bell;
}

function notificationTone(notification) {
  if (notification.priority === "HIGH") {
    return "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]";
  }

  if (notification.category === "PROPOSAL") {
    return "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]";
  }

  if (notification.category === "PROJECT") {
    return "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]";
  }

  if (notification.status === "APPROVED") {
    return "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]";
  }

  if (notification.status === "REJECTED") {
    return "bg-[#fffbeb] text-[#b45309] border-[#fde68a]";
  }

  return "bg-[#fff7ed] text-[#b45309] border-[#f0d7c3]";
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
      {priority || "MEDIUM"}
    </span>
  );
}

function ReadBadge({ isRead }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        !isRead
          ? "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]"
          : "border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]"
      }`}
    >
      {!isRead ? "Unread" : "Read"}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[1.6rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
        <Bell size={24} />
      </div>

      <h3 className="mt-4 text-lg font-black text-[#24130c]">
        No notifications found
      </h3>

      <p className="mt-2 text-sm text-[#7c6858]">
        Alerts will appear here when proposals, milestones, and deal rooms are
        created.
      </p>
    </div>
  );
}

export default function FreelancerNotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [notificationData, setNotificationData] = useState(
    initialNotificationData
  );
  const [readIds, setReadIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadNotifications() {
      try {
        setLoading(true);
        setErrorMessage("");

        const searchParams = new URLSearchParams();

        if (activeFilter === "ACTION_REQUIRED") {
          searchParams.set("actionRequired", "true");
        } else if (activeFilter === "HIGH") {
          searchParams.set("priority", "HIGH");
        } else if (["PROPOSAL", "MILESTONE", "PROJECT"].includes(activeFilter)) {
          searchParams.set("type", activeFilter);
        }

        const query = searchParams.toString();

        const response = await fetch(
          `/api/freelancer/notifications${query ? `?${query}` : ""}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load freelancer notifications."
          );
        }

        if (!ignore) {
          setNotificationData(result.data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error.message || "Unable to load freelancer notifications."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      ignore = true;
    };
  }, [activeFilter]);

  const stats = notificationData.stats || {};
  const notifications = notificationData.notifications || [];

  const unreadCount = useMemo(() => {
    return Math.max(Number(stats.totalNotifications || 0) - readIds.size, 0);
  }, [stats.totalNotifications, readIds]);

  const statCards = useMemo(
    () => [
      {
        label: "Total Alerts",
        value: stats.totalNotifications || 0,
        helper: "Generated from project activity",
        icon: Bell,
      },
      {
        label: "Unread Alerts",
        value: unreadCount,
        helper: "Local read state for now",
        icon: AlertTriangle,
      },
      {
        label: "Action Required",
        value: stats.actionRequiredNotifications || 0,
        helper: "Needs freelancer action",
        icon: ShieldAlert,
      },
      {
        label: "High Priority",
        value: stats.highPriorityNotifications || 0,
        helper: "Important active alerts",
        icon: CalendarClock,
      },
    ],
    [stats, unreadCount]
  );

  function markAllAsRead() {
    setReadIds((current) => {
      const updated = new Set(current);

      for (const notification of notifications) {
        updated.add(notification.id);
      }

      return updated;
    });
  }

  function markOneAsRead(id) {
    setReadIds((current) => {
      const updated = new Set(current);
      updated.add(id);
      return updated;
    });
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">
            Loading freelancer notifications...
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
            Unable to load notifications
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
            Notifications
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Stay updated on proposals, milestones, and deal rooms.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            These alerts are generated from existing proposal, milestone, and
            project data. Read/unread state is local until we add a real
            Notification table.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          disabled={notifications.length === 0}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CheckCheck size={18} />
          Mark visible as read
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
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
                Filter alerts and open the related freelancer workspace.
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
            {notifications.map((notification) => {
              const Icon = notificationIcon(notification);
              const isRead = readIds.has(notification.id);

              return (
                <article
                  key={notification.id}
                  className={`rounded-[1.6rem] border p-5 transition hover:border-[#d7c3b2] hover:bg-white ${
                    !isRead
                      ? "border-[#d7c3b2] bg-[#fff7ed]"
                      : "border-[#eadfd2] bg-[#fffaf3]"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div className="flex gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${notificationTone(
                          notification
                        )}`}
                      >
                        <Icon size={20} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <ReadBadge isRead={isRead} />

                          <PriorityBadge priority={notification.priority} />

                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#9b7a64]">
                            {notification.category}
                          </span>

                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#9b7a64]">
                            {toTitleCase(notification.status)}
                          </span>
                        </div>

                        <h3 className="mt-4 text-xl font-black tracking-[-0.04em] text-[#24130c]">
                          {notification.title}
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-[#9b7a64]">
                          {notification.amountDisplay}
                        </p>

                        <p className="mt-4 max-w-3xl text-sm leading-6 text-[#7c6858]">
                          {notification.message}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#b79d88]">
                          <Clock3 size={14} />
                          {notification.relativeTime ||
                            notification.createdAtDisplay}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-3 lg:flex-col">
                      <Link
                        href={notification.actionUrl || "/freelancer/dashboard"}
                        onClick={() => markOneAsRead(notification.id)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]"
                      >
                        {notification.actionLabel || "Open"}
                        <ArrowUpRight size={17} />
                      </Link>

                      {!isRead && (
                        <button
                          type="button"
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

            {notifications.length === 0 && <EmptyState />}
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
              correct action — view proposal, submit work, revise milestone, or
              open wallet.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Accepted proposals open deal rooms",
                "In-progress milestones need submission",
                "Rejected milestones need revision",
                "Approved milestones update wallet",
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
                Alert Sources
              </h2>

              <Filter size={20} className="text-[#6f2e1c]" />
            </div>

            <div className="space-y-3">
              {[
                {
                  type: "PROPOSAL",
                  title: "Proposal alerts",
                  text: "Pending, accepted, rejected, and withdrawn proposal updates.",
                  icon: Handshake,
                },
                {
                  type: "MILESTONE",
                  title: "Milestone alerts",
                  text: "In-progress, submitted, approved, and revision states.",
                  icon: UploadCloud,
                },
                {
                  type: "PROJECT",
                  title: "Deal room alerts",
                  text: "Active assigned projects visible in deal rooms.",
                  icon: Inbox,
                },
                {
                  type: "WALLET",
                  title: "Wallet impact",
                  text: "Approved milestones are reflected in wallet earnings.",
                  icon: Wallet,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.type}
                    className="rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#f0d7c3] bg-white text-[#6f2e1c]">
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
              Later Upgrade
            </h2>

            <div className="mt-5 space-y-4">
              {[
                {
                  title: "Notification table",
                  text: "Needed for persistent read/unread status.",
                  icon: Bell,
                },
                {
                  title: "Message alerts",
                  text: "Needs Message model before real chat notifications.",
                  icon: Inbox,
                },
                {
                  title: "Payment alerts",
                  text: "Needs PaymentTransaction model for escrow events.",
                  icon: IndianRupee,
                },
                {
                  title: "Dispute alerts",
                  text: "Needs Dispute model for admin review updates.",
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