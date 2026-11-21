"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  FileText,
  MessageSquare,
  ShieldAlert,
  Wallet,
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    type: "Payment",
    title: "Milestone funded",
    project: "Demo Secure Submission Project",
    description:
      "Funds are locked in escrow and the freelancer can begin work on this milestone.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    type: "Deadline",
    title: "Milestone deadline approaching",
    project: "Demo Secure Submission Project",
    description: "The next milestone is due in two days. Review progress soon.",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: 3,
    type: "Message",
    title: "New message from your freelancer",
    project: "Demo Secure Submission Project",
    description: "A preview link and delivery notes were shared in messages.",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 4,
    type: "Submission",
    title: "Work submitted for review",
    project: "Demo Secure Submission Project",
    description:
      "A milestone submission is waiting for your approval before funds release.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 5,
    type: "Dispute",
    title: "Dispute closed",
    project: "Portfolio Website",
    description: "Support resolved the case and released the agreed amount.",
    time: "3 days ago",
    unread: false,
  },
];

const tabs = ["All", "Unread", "Payment", "Deadline", "Message"];

const typeMeta = {
  Payment: {
    icon: Wallet,
    tone: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
  },
  Deadline: {
    icon: CalendarClock,
    tone: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
  },
  Message: {
    icon: MessageSquare,
    tone: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
  },
  Submission: {
    icon: FileText,
    tone: "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]",
  },
  Dispute: {
    icon: ShieldAlert,
    tone: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("All");

  const unreadCount = notifications.filter((item) => item.unread).length;

  const filtered = useMemo(() => {
    if (activeTab === "All") return notifications;
    if (activeTab === "Unread")
      return notifications.filter((item) => item.unread);

    return notifications.filter((item) => item.type === activeTab);
  }, [notifications, activeTab]);

  function markAllRead() {
    setNotifications((current) =>
      current.map((item) => ({ ...item, unread: false }))
    );
  }

  function markRead(id) {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7c6858]">
            Notifications
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#24130c]">
            Stay updated on your projects
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Invites, submissions, deadline reminders, payments, and disputes —
            all in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CheckCircle2 size={18} />
          Mark all as read
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
        <section className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-[#24130c]">
                Notification centre
              </h2>

              <p className="mt-1 text-sm font-semibold text-[#7c6858]">
                {unreadCount} unread alert{unreadCount === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const active = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-black transition ${
                      active
                        ? "bg-[#6f2e1c] text-white"
                        : "border border-[#eadfd2] bg-white text-[#7a4a34] hover:bg-[#fff7ed]"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {filtered.length === 0 && (
              <div className="rounded-[1.5rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-8 text-center">
                <p className="text-sm font-bold text-[#7c6858]">
                  Nothing here right now.
                </p>
              </div>
            )}

            {filtered.map((item) => {
              const meta = typeMeta[item.type] || typeMeta.Message;
              const Icon = meta.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => markRead(item.id)}
                  className={`flex w-full items-start gap-4 rounded-[1.5rem] border p-4 text-left transition ${
                    item.unread
                      ? "border-[#e7c9a8] bg-[#fffaf3] hover:bg-white"
                      : "border-[#eadfd2] bg-white hover:bg-[#fffaf3]"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${meta.tone}`}
                  >
                    <Icon size={17} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-[#24130c]">
                        {item.title}
                      </span>

                      {item.unread && (
                        <span className="rounded-full bg-[#6f2e1c] px-2 py-0.5 text-[10px] font-black text-white">
                          NEW
                        </span>
                      )}
                    </span>

                    <span className="mt-1 block truncate text-xs font-semibold text-[#806049]">
                      {item.project}
                    </span>

                    <span className="mt-2 block text-sm leading-6 text-[#5f4a3c]">
                      {item.description}
                    </span>
                  </span>

                  <span className="shrink-0 text-[11px] font-bold text-[#806049]">
                    {item.time}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#24130c]">
                Alert types
              </h2>

              <Bell size={18} className="text-[#806049]" />
            </div>

            <div className="mt-4 space-y-2">
              {Object.entries(typeMeta).map(([type, meta]) => {
                const Icon = meta.icon;
                const count = notifications.filter(
                  (item) => item.type === type
                ).length;

                return (
                  <div
                    key={type}
                    className="flex items-center justify-between rounded-2xl border border-[#eadfd2] bg-white px-4 py-3"
                  >
                    <span className="flex items-center gap-2 text-sm font-bold text-[#24130c]">
                      <Icon size={15} className="text-[#806049]" />
                      {type}
                    </span>

                    <span className="text-xs font-black text-[#806049]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f4b454]">
              Delivery
            </p>

            <h2 className="mt-3 text-xl font-black tracking-[-0.03em]">
              Choose how TrustOnes reaches you.
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/85">
              Email, push, and escrow alerts can be switched on or off any time
              from settings.
            </p>

            <Link
              href="/client/settings"
              className="mt-5 flex h-11 items-center justify-center rounded-2xl bg-white/15 text-sm font-black text-white transition hover:bg-white/25"
            >
              Open settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
