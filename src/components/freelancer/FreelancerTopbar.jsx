import {
  Bell,
  Search,
  Wallet,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

export default function FreelancerTopbar() {
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
          <button className="hidden h-11 items-center gap-2 rounded-2xl border border-[#eadfd2] bg-white/80 px-4 text-sm font-bold text-[#6f2e1c] shadow-sm transition hover:bg-white sm:flex">
            <Wallet size={17} />
            ₹12,400
          </button>

          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadfd2] bg-white/80 text-[#6f2e1c] shadow-sm transition hover:bg-white">
            <MessageSquare size={18} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6f2e1c] px-1 text-[10px] font-black text-white">
              3
            </span>
          </button>

          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadfd2] bg-white/80 text-[#6f2e1c] shadow-sm transition hover:bg-white">
            <Bell size={18} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f4b454] px-1 text-[10px] font-black text-[#32180e]">
              5
            </span>
          </button>

          <button className="flex items-center gap-3 rounded-2xl border border-[#eadfd2] bg-white/80 px-3 py-2 shadow-sm transition hover:bg-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#35170f] text-sm font-black text-[#f8d6a3]">
              K
            </div>

            <div className="hidden text-left lg:block">
              <p className="text-sm font-extrabold text-[#24130c]">
                Kushaagra
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b7a64]">
                Freelancer
              </p>
            </div>

            <ChevronDown size={16} className="hidden text-[#9b7a64] lg:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
