"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Inbox,
  Handshake,
  MessageSquare,
  ListChecks,
  ShieldAlert,
  Wallet,
  Star,
  Bell,
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/freelancer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/freelancer/projects",
    icon: FolderKanban,
  },
  {
    label: "Invites",
    href: "/freelancer/invites",
    icon: Inbox,
    badge: "2",
  },
  {
    label: "Deal Rooms",
    href: "/freelancer/deal-rooms",
    icon: Handshake,
  },
  {
    label: "Messages",
    href: "/freelancer/messages",
    icon: MessageSquare,
    badge: "3",
  },
  {
    label: "Milestones",
    href: "/freelancer/milestones",
    icon: ListChecks,
  },
  {
    label: "Disputes",
    href: "/freelancer/disputes",
    icon: ShieldAlert,
  },
  {
    label: "Wallet",
    href: "/freelancer/wallet",
    icon: Wallet,
  },
  {
    label: "Reviews",
    href: "/freelancer/reviews",
    icon: Star,
  },
  {
    label: "Notifications",
    href: "/freelancer/notifications",
    icon: Bell,
    badge: "5",
  },
  {
    label: "Profile",
    href: "/freelancer/profile",
    icon: UserRound,
  },
  {
    label: "Settings",
    href: "/freelancer/settings",
    icon: Settings,
  },
];

export default function FreelancerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-[270px] border-r border-[#eadfd2] bg-[#fffaf3] px-4 py-5 lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#35170f] text-lg font-bold text-[#f8d6a3] shadow-lg shadow-[#35170f]/20">
          T
        </div>

        <div>
          <h2 className="text-base font-extrabold tracking-tight text-[#24130c]">
            TrustOnes
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
            Freelancer Portal
          </p>
        </div>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

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
                {item.label}
              </span>

              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    active
                      ? "bg-white/15 text-white"
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

      <button className="mt-5 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[#7a4a34] transition hover:bg-[#f3eadf]">
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}