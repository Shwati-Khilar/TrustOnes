"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  FolderKanban,
  Handshake,
  Inbox,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MessageSquare,
  Settings,
  ShieldAlert,
  Star,
  UserRound,
  Wallet,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/freelancer/dashboard",
    icon: LayoutDashboard,
    badgeKey: null,
  },
  {
    label: "Projects",
    href: "/freelancer/projects",
    icon: FolderKanban,
    badgeKey: null,
  },
  {
    label: "Invites",
    href: "/freelancer/invites",
    icon: Inbox,
    badgeKey: "invites",
  },
  {
    label: "Deal Rooms",
    href: "/freelancer/deal-rooms",
    icon: Handshake,
    badgeKey: null,
  },
  {
    label: "Messages",
    href: "/freelancer/messages",
    icon: MessageSquare,
    badgeKey: "messages",
  },
  {
    label: "Milestones",
    href: "/freelancer/milestones",
    icon: ListChecks,
    badgeKey: "milestones",
  },
  {
    label: "Disputes",
    href: "/freelancer/disputes",
    icon: ShieldAlert,
    badgeKey: "disputes",
  },
  {
    label: "Wallet",
    href: "/freelancer/wallet",
    icon: Wallet,
    badgeKey: null,
  },
  {
    label: "Reviews",
    href: "/freelancer/reviews",
    icon: Star,
    badgeKey: null,
  },
  {
    label: "Notifications",
    href: "/freelancer/notifications",
    icon: Bell,
    badgeKey: "notifications",
  },
  {
    label: "Profile",
    href: "/freelancer/profile",
    icon: UserRound,
    badgeKey: null,
  },
  {
    label: "Settings",
    href: "/freelancer/settings",
    icon: Settings,
    badgeKey: null,
  },
];

function isActivePath(pathname, href) {
  if (!pathname) return false;
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

function formatBadge(value) {
  const count = Number(value || 0);

  if (count <= 0) return "";
  if (count > 99) return "99+";

  return String(count);
}

export default function FreelancerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [badgeCounts, setBadgeCounts] = useState({
    invites: 0,
    milestones: 0,
    notifications: 0,
    messages: 0,
    disputes: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let ignore = false;

    async function loadSidebarCounts() {
      try {
        const [dashboardResult, notificationsResult] = await Promise.allSettled([
          fetch("/api/freelancer/dashboard", {
            method: "GET",
            cache: "no-store",
          }),
          fetch("/api/freelancer/notifications", {
            method: "GET",
            cache: "no-store",
          }),
        ]);

        let pendingProposals = 0;
        let activeMilestones = 0;
        let actionRequiredNotifications = 0;

        if (dashboardResult.status === "fulfilled") {
          const dashboardResponse = dashboardResult.value;
          const dashboardJson = await dashboardResponse.json();

          if (dashboardResponse.ok && dashboardJson?.success) {
            const stats = dashboardJson.data?.stats || {};
            pendingProposals = Number(stats.pendingProposals || 0);
            activeMilestones = Number(stats.activeMilestones || 0);
          }
        }

        if (notificationsResult.status === "fulfilled") {
          const notificationsResponse = notificationsResult.value;
          const notificationsJson = await notificationsResponse.json();

          if (notificationsResponse.ok && notificationsJson?.success) {
            const stats = notificationsJson.data?.stats || {};
            actionRequiredNotifications = Number(
              stats.actionRequiredNotifications || 0
            );
          }
        }

        if (!ignore) {
          setBadgeCounts({
            invites: pendingProposals,
            milestones: activeMilestones,
            notifications: actionRequiredNotifications,
            messages: 0,
            disputes: 0,
          });
        }
      } catch (error) {
        console.error("FREELANCER_SIDEBAR_COUNTS_ERROR", error);
      }
    }

    loadSidebarCounts();

    return () => {
      ignore = true;
    };
  }, [mounted]);

  const navItemsWithBadges = useMemo(() => {
    return navItems.map((item) => ({
      ...item,
      badge:
        mounted && item.badgeKey ? formatBadge(badgeCounts[item.badgeKey]) : "",
    }));
  }, [badgeCounts, mounted]);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await signOut({
        redirect: false,
        callbackUrl: "/login",
      });

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("FREELANCER_LOGOUT_ERROR", error);
      setLoggingOut(false);
    }
  }

  return (
    <aside className="hidden min-h-screen w-[270px] shrink-0 border-r border-[#eadfd2] bg-[#fffaf3] px-4 py-5 lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <Link
          href="/freelancer/dashboard"
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#35170f] text-lg font-bold text-[#f8d6a3] shadow-lg shadow-[#35170f]/20"
        >
          T
        </Link>

        <div>
          <Link
            href="/freelancer/dashboard"
            className="text-base font-extrabold tracking-tight text-[#24130c]"
          >
            TrustOnes
          </Link>

          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
            Freelancer Portal
          </p>
        </div>
      </div>

      <nav className="space-y-1.5">
        {navItemsWithBadges.map((item) => {
          const Icon = item.icon;
          const active = mounted && isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-[#6f2e1c] text-white shadow-lg shadow-[#6f2e1c]/20"
                  : "text-[#6f5a4c] hover:bg-[#f3eadf] hover:text-[#2b1810]"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon
                  size={18}
                  strokeWidth={2.1}
                  className={active ? "text-white" : "text-[#9b7a64]"}
                />

                <span>{item.label}</span>
              </span>

              {item.badge && (
                <span
                  className={`flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-black ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-[#eadfd2] text-[#7a4a34]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-3xl bg-gradient-to-br from-[#3a170e] to-[#7c341d] p-5 text-white shadow-xl shadow-[#7c341d]/20">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
          Trust Score
        </p>

        <div className="mt-3 flex items-end justify-between">
          <h3 className="text-4xl font-black tracking-tight">94</h3>

          <span className="rounded-full bg-[#f4b454]/15 px-2 py-1 text-xs font-bold text-[#ffd28c]">
            +4%
          </span>
        </div>

        <p className="mt-2 text-xs font-medium text-white/65">
          Excellent freelancer standing
        </p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-[94%] rounded-full bg-[#f4b454]" />
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-5 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[#7a4a34] transition hover:bg-[#f3eadf] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut size={18} />
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </aside>
  );
}