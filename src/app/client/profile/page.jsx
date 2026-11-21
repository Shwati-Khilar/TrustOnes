import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserAvatar from "@/components/client/UserAvatar";
import { BadgeCheck, Mail, ShieldCheck, Star, Settings } from "lucide-react";
import Link from "next/link";

export default async function ClientProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const details = [
    {
      label: "Full name",
      value: user?.name || "Not set",
      icon: BadgeCheck,
    },
    {
      label: "Email address",
      value: user?.email || "Not set",
      icon: Mail,
    },
    {
      label: "Account type",
      value: user?.role === "CLIENT" ? "Client account" : "Freelancer account",
      icon: ShieldCheck,
    },
  ];

  const metrics = [
    { label: "Trust score", value: "96", suffix: "/100" },
    { label: "Projects posted", value: "5", suffix: "" },
    { label: "Avg. rating", value: "4.9", suffix: "" },
  ];

  return (
    <div className="mx-auto max-w-[1480px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7c6858]">
            Profile
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#24130c]">
            Your client profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c6858]">
            This is how freelancers see you when you post projects and send
            invites.
          </p>
        </div>

        <Link
          href="/client/settings"
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
        >
          <Settings size={17} />
          Edit in Settings
        </Link>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <UserAvatar user={user} />

            <div className="min-w-0">
              <h2 className="truncate text-xl font-black tracking-[-0.03em] text-[#24130c]">
                {user?.name || "Client"}
              </h2>

              <p className="truncate text-sm font-semibold text-[#7c6858]">
                {user?.email || "No email on file"}
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            {details.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f7efe4] text-[#6f2e1c]">
                    <Icon size={16} />
                  </span>

                  <span className="text-sm font-semibold text-[#7c6858]">
                    {label}
                  </span>
                </div>

                <span className="truncate text-sm font-bold text-[#24130c]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                Trust score
              </span>

              <Star size={18} className="text-[#f4b454]" />
            </div>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-black tracking-[-0.04em]">96</span>
              <span className="pb-1 text-sm font-semibold text-white/70">/100</span>
            </div>

            <div className="mt-4 h-2 w-full rounded-full bg-white/20">
              <div
                className="h-2 rounded-full bg-[#f4b454]"
                style={{ width: "96%" }}
              />
            </div>

            <p className="mt-3 text-xs font-semibold text-white/70">
              Excellent standing
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {metrics.slice(1).map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm"
              >
                <p className="text-sm font-bold text-[#5f4a3c]">{item.label}</p>

                <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c]">
                  {item.value}
                  <span className="text-sm font-bold text-[#806049]">
                    {item.suffix}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
