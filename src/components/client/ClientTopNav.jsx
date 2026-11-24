"use client";

import MobileMarketNav from "@/components/marketplace/MobileMarketNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, MessageSquare, Plus, Search } from "lucide-react";

function getInitial(name, email) {
  const value = name || email || "C";
  return value.charAt(0).toUpperCase();
}

function getFirstName(name, email) {
  if (name) return name.split(" ")[0];
  if (email) return email.split("@")[0];
  return "Client";
}

const pageTitles = [
  ["/client/freelancers", "Freelancers"],
  ["/client/offers", "Offers"],
  ["/client/projects/create", "Post a Project"],
  ["/client/projects", "Projects"],
  ["/client/notifications", "Notifications"],
  ["/client/messages", "Messages"],
  ["/client/disputes", "Disputes"],
  ["/client/escrow", "Escrow"],
  ["/client/reviews", "Reviews"],
  ["/client/profile", "Profile"],
  ["/client/settings", "Settings"],
];

export default function ClientTopNav({ user }) {
  const pathname = usePathname();

  const pageTitle =
    pageTitles.find(([href]) => pathname?.startsWith(href))?.[1] || "Dashboard";

  return (
    <header className="sticky top-0 z-20 border-b border-[#eadfd2]/80 bg-[#f8f4ed]/85 px-5 py-4 backdrop-blur-xl sm:px-7 lg:px-8">
      <div className="flex items-center justify-between gap-5">
        <MobileMarketNav portal="client" />
        {pathname !== "/client/freelancers" && <form action="/client/freelancers" className="hidden min-w-[280px] max-w-xl flex-1 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-white/80 px-4 py-3 shadow-sm md:flex">
          <Search size={18} className="text-[#7c6858]" />

          <input
            type="search" name="q" aria-label="Search directory"
            placeholder="Search freelancers..."
            className="w-full bg-transparent text-sm font-medium text-[#2b1810] outline-none placeholder:text-[#806049]"
          />
        </form>}

        <div className="flex flex-1 items-center justify-between md:hidden">
          <p className="text-lg font-black text-[#24130c]">{pageTitle}</p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/client/projects/create"
            className="hidden h-11 items-center gap-2 rounded-2xl bg-[#6f2e1c] px-4 text-sm font-bold text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416] sm:flex"
          >
            <Plus size={17} />
            Post a Project
          </Link>

          <Link
            href="/client/messages"
            aria-label="Messages"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadfd2] bg-white/80 text-[#6f2e1c] shadow-sm transition hover:bg-white"
          >
            <MessageSquare size={18} />
          </Link>

          <Link
            href="/client/notifications"
            aria-label="Notifications"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadfd2] bg-white/80 text-[#6f2e1c] shadow-sm transition hover:bg-white"
          >
            <Bell size={18} />
          </Link>

          <Link
            href="/client/profile"
            className="flex items-center gap-3 rounded-2xl border border-[#eadfd2] bg-white/80 px-3 py-2 shadow-sm transition hover:bg-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#35170f] text-sm font-black text-[#f8d6a3]">
              {getInitial(user?.name, user?.email)}
            </div>

            <div className="hidden text-left lg:block">
              <p className="text-sm font-extrabold text-[#24130c]">
                {getFirstName(user?.name, user?.email)}
              </p>

              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c6858]">
                Client
              </p>
            </div>

            <ChevronDown size={16} className="hidden text-[#7c6858] lg:block" />
          </Link>
        </div>
      </div>
    </header>
  );
}
