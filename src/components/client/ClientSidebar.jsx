"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth.client.service";
import { useState } from "react";
import {
  Bell,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  ShieldAlert,
  Star,
  UserRound,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/client/projects", icon: FolderKanban },
  { label: "Notifications", href: "/client/notifications", icon: Bell },
  { label: "Messages", href: "/client/messages", icon: MessageSquare },
  { label: "Disputes", href: "/client/disputes", icon: ShieldAlert },
  { label: "Escrow", href: "/client/escrow", icon: Shield },
  { label: "Reviews", href: "/client/reviews", icon: Star },
  { label: "Profile", href: "/client/profile", icon: UserRound },
  { label: "Settings", href: "/client/settings", icon: Settings },
];

function isActivePath(pathname, href) {
  if (!pathname) return false;
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

function getInitial(name, email) {
  const value = name || email || "C";
  return value.charAt(0).toUpperCase();
}

export default function ClientSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await logoutUser();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("CLIENT_LOGOUT_ERROR", error);
      setLoggingOut(false);
    }
  }

  return (
    <aside className="hidden min-h-screen w-[270px] shrink-0 border-r border-[#eadfd2] bg-[#fffaf3] px-4 py-5 lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <Link
          href="/client/dashboard"
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#35170f] text-lg font-bold text-[#f8d6a3] shadow-lg shadow-[#35170f]/20"
        >
          T
        </Link>

        <div>
          <Link
            href="/client/dashboard"
            className="text-base font-extrabold tracking-tight text-[#24130c]"
          >
            TrustOnes
          </Link>

          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7c6858]">
            Client Portal
          </p>
        </div>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
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
                  className={active ? "text-white" : "text-[#7c6858]"}
                />

                <span>{item.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-3xl bg-gradient-to-br from-[#3a170e] to-[#7c341d] p-5 text-white shadow-xl shadow-[#7c341d]/20">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f4b454]">
          Trust Score
        </p>

        <p className="mt-3 text-lg font-black text-white">Unrated</p>
        <p className="mt-2 text-xs text-white/75">No reputation score available.</p>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#eadfd2] bg-white/70 px-3 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#35170f] text-sm font-black text-[#f8d6a3]">
          {getInitial(user?.name, user?.email)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-[#24130c]">
            {user?.name || "Client"}
          </p>

          <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c6858]">
            Client account
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-4 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[#7a4a34] transition hover:bg-[#f3eadf] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut size={18} />
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </aside>
  );
}
