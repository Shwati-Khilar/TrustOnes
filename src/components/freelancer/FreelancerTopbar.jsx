"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Search,
  Wallet,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

function getInitial(name, email) {
  const value = name || email || "F";
  return value.charAt(0).toUpperCase();
}

function getFirstName(name, email) {
  if (name) return name.split(" ")[0];
  if (email) return email.split("@")[0];
  return "Freelancer";
}

export default function FreelancerTopbar() {
  const [user, setUser] = useState(null);
  const [topbarData, setTopbarData] = useState({
    walletBalance: "₹0",
    messageCount: 0,
    notificationCount: 0,
  });

  useEffect(() => {
    let ignore = false;

    async function loadTopbarData() {
      try {
        const [userResponse, dashboardResponse] = await Promise.all([
          fetch("/api/user/me", {
            method: "GET",
            cache: "no-store",
          }),
          fetch("/api/freelancer/dashboard", {
            method: "GET",
            cache: "no-store",
          }),
        ]);

        const userResult = await userResponse.json();
        const dashboardResult = await dashboardResponse.json();

        if (!ignore && userResponse.ok && userResult?.user) {
          setUser(userResult.user);
        }

        if (!ignore && dashboardResponse.ok && dashboardResult?.success) {
          const stats = dashboardResult.data?.stats || {};

          const notificationCount =
            Number(stats.pendingProposals || 0) +
            Number(stats.activeMilestones || 0);

          setTopbarData({
            walletBalance: stats.approvedEarnings || "₹0",
            messageCount: 0,
            notificationCount,
          });
        }
      } catch (error) {
        console.error("FREELANCER_TOPBAR_ERROR", error);
      }
    }

    loadTopbarData();

    return () => {
      ignore = true;
    };
  }, []);

  const displayName = useMemo(() => {
    return getFirstName(user?.name, user?.email);
  }, [user]);

  const initial = useMemo(() => {
    return getInitial(user?.name, user?.email);
  }, [user]);

  return (
    <header className="sticky top-0 z-20 border-b border-[#eadfd2]/80 bg-[#f8f4ed]/85 px-5 py-4 backdrop-blur-xl sm:px-7 lg:px-8">
      <div className="flex items-center justify-between gap-5">
        <div className="hidden min-w-[280px] max-w-xl flex-1 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-white/80 px-4 py-3 shadow-sm md:flex">
          <Search size={18} className="text-[#9b7a64]" />

          <input
            type="text"
            placeholder="Search projects, clients, milestones..."
            className="w-full bg-transparent text-sm font-medium text-[#2b1810] outline-none placeholder:text-[#b79d88]"
          />
        </div>

        <div className="flex flex-1 items-center justify-between md:hidden">
          <h1 className="text-lg font-black text-[#24130c]">Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/freelancer/wallet"
            className="hidden h-11 items-center gap-2 rounded-2xl border border-[#eadfd2] bg-white/80 px-4 text-sm font-bold text-[#6f2e1c] shadow-sm transition hover:bg-white sm:flex"
          >
            <Wallet size={17} />
            {topbarData.walletBalance}
          </Link>

          <Link
            href="/freelancer/messages"
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadfd2] bg-white/80 text-[#6f2e1c] shadow-sm transition hover:bg-white"
          >
            <MessageSquare size={18} />

            {topbarData.messageCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6f2e1c] px-1 text-[10px] font-black text-white">
                {topbarData.messageCount}
              </span>
            )}
          </Link>

          <Link
            href="/freelancer/notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadfd2] bg-white/80 text-[#6f2e1c] shadow-sm transition hover:bg-white"
          >
            <Bell size={18} />

            {topbarData.notificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f4b454] px-1 text-[10px] font-black text-[#32180e]">
                {topbarData.notificationCount}
              </span>
            )}
          </Link>

          <Link
            href="/freelancer/profile"
            className="flex items-center gap-3 rounded-2xl border border-[#eadfd2] bg-white/80 px-3 py-2 shadow-sm transition hover:bg-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#35170f] text-sm font-black text-[#f8d6a3]">
              {initial}
            </div>

            <div className="hidden text-left lg:block">
              <p className="text-sm font-extrabold text-[#24130c]">
                {displayName}
              </p>

              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b7a64]">
                Freelancer
              </p>
            </div>

            <ChevronDown size={16} className="hidden text-[#9b7a64] lg:block" />
          </Link>
        </div>
      </div>
    </header>
  );
}