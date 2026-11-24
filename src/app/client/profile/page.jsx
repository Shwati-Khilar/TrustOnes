import { requirePortal } from "@/lib/portal-session";
import { prisma } from "@/lib/prisma";
import ProfileNameForm from "@/components/client/ProfileNameForm";
import UserAvatar from "@/components/client/UserAvatar";
import { Mail, ShieldCheck, Star, Settings } from "lucide-react";
import Link from "next/link";

export default async function ClientProfilePage() {
  const user = await requirePortal("CLIENT");
  const projectCount = await prisma.project.count({ where: { clientId: user.id } });

  const details = [
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
    { label: "Projects posted", value: projectCount, suffix: "" },
    { label: "Avg. rating", value: "Unrated", suffix: "" },
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
            Manage your name and view your account details.
          </p>
        </div>

        <Link
          href="/client/settings"
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
        >
          <Settings size={17} />
          Settings
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
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

          <ProfileNameForm name={user.name} />
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

            <p className="mt-4 text-lg font-bold">No reputation score available</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {metrics.map((item) => (
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
