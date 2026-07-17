"use client";

import { Bell, Search, Plus, HelpCircle } from "lucide-react";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientTopNav({ user }) {
  const router = useRouter();
  

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-[#FAF6F1]/90 backdrop-blur-md border-b border-[#E7DDD2] z-20 flex items-center px-6 gap-4">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7068]" />
          <input
            type="text"
            placeholder="Search projects, freelancers..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border-[#E7DDD2] rounded-xl text-[#3D2414] placeholder:text-[#7A7068] focus:outline-none focus:ring-2 focus:ring-[#C89B3C] focus:border-[#C89B3C] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Create Project CTA */}
        <button
          type="button"
          onClick={() => router.push("/client/projects/create")}
          className="flex items-center gap-2 px-4 py-2 bg-[#7A4A28] hover:bg-[#5F381D] text-white text-sm font-600 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>

        {/* Help */}
        <button className="p-2 rounded-xl text-[#7A7068] hover:text-[#7A4A28] hover:bg-[#F2E8DE] transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}

        <Link href="/client/notifications">
          <button className="relative p-2 rounded-xl text-[#8B6A53] hover:bg-[#F3ECE4]">
            <Bell className="w-5 h-5" />

            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
          </button>
        </Link>

        {/* Avatar */}
        <UserAvatar user={user} />
      </div>
    </header>
  );
}
