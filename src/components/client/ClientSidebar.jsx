"use client";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  Shield,
  Star,
  User,
  Settings,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

import UserAvatar from "./UserAvatar";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [

  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/client/dashboard",
  },
  {
    icon: FolderKanban,
    label: "Projects",
    href: "/client/projects",
    badge: "4",
  },
  {
    icon: FileText,
    label: "Applications",
    href: "/client/applications",
  },
  {
    icon: MessageSquare,
    label: "Messages",
    href: "/client/messages",
    badge: "3",
  },
  {
    icon: Shield,
    label: "Escrow",
    href: "/client/escrow",
  },
  {
    icon: Star,
    label: "Reviews",
    href: "/client/reviews",
  },
  {
    icon: User,
    label: "Profile",
    href: "/client/profile",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/client/settings",
  },
];


export default function ClientSidebar({ user }) {
  const pathname = usePathname();
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#FAF6F1] border-r border-[#E7DDD2] flex flex-col z-30 shadow-card">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-beige-200">
        <Link
    href="/"
    className="flex items-center gap-3 group"
  >
          <div className="w-9 h-9 rounded-xl bg-[#7A4A28] flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[17px] font-bold text-[#3D2414] tracking-tight">TrustOnes</span>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0bbe35]" />
              <span className="text-[10px]  text-[#0bbe35] font-bold uppercase tracking-wide">Client Portal</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin space-y-0.5">

  {navItems.map(({ icon: Icon, label, href, badge }) => {

    const active = pathname === href;

    return (
      <Link
        href={href}
        key={label}
        className={`
          w-full
          flex
          items-center
          gap-3
          px-3
          py-2.5
          rounded-xl
          text-sm
          font-medium
          transition-all
          duration-150
          group

          ${
            active
              ? "bg-[#7A4A28] text-white shadow-sm"
              : "text-[#3D2414] hover:bg-[#F2E8DE]"
          }
        `}
      >
        <Icon
          size={18}
          className={`flex-shrink-0 ${
            active
              ? "text-white"
              : "text-[#7A7068] group-hover:text-[#7A4A28]"
          }`}
        />

        <span className="flex-1 text-left">
          {label}
        </span>

        {badge && (
          <span
            className={`
              text-[10px]
              px-1.5
              py-0.5
              rounded-full

              ${
                active
                  ? "bg-white/20 text-white"
                  : "bg-[#EFE5DB] text-[#7A4A28]"
              }
            `}
          >
            {badge}
          </span>
        )}

        {!active && !badge && (
          <ChevronRight
            className="
              w-3.5
              h-3.5
              text-[#B88746]
              opacity-0
              group-hover:opacity-100
              transition-opacity
            "
          />
        )}
      </Link>
    );
  })}

</nav>

      {/* Trust score card */}
      <div className="px-3 pb-4">
        <div className="bg-gradient-to-br from-[#7A4A28] to-[#3D2414] rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-white/70 uppercase tracking-wide">Trust Score</span>
            <TrendingUp className="w-4 h-4 text-[#C89B3C]" />
          </div>
          <div className="text-3xl font-700 text-white mb-1">96</div>
          <div className="text-xs text-white/60 mb-3">Excellent standing</div>
          <div className="w-full bg-white/20 rounded-full h-1.5">
            <div className="bg-[#C89B3C] h-1.5 rounded-full" style={{ width: '96%' }} />
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-4 pt-1 border-t border-[#E7DDD2]">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F2E8DE] transition-colors group">
          <UserAvatar user={user} />
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-600 text-[#3D2414] truncate">{user?.name || "User"}</div>
            <div className="text-xs text-[#7A7068]">{user?.role === "CLIENT"
              ? "Client Account"
              : "Freelancer Account"}</div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#7A7068] flex-shrink-0" />
        </button>
      </div>
    </aside>
  );
}
