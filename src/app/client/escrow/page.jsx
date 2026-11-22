"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  IndianRupee,
  Lock,
  ShieldCheck,
  Wallet,
} from "lucide-react";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

const escrowStatusStyles = {
  Released: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
  Locked: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
  Partial: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
};

export default function EscrowPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  useEffect(() => {
    let ignore = false;

    async function loadEscrows() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/projects", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load escrow records.");
        }

        if (!ignore) {
          setProjects(data.projects || []);
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message || "Unable to load escrow records.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadEscrows();

    return () => {
      ignore = true;
    };
  }, []);

  const escrows = useMemo(
    () =>
      projects.map((project) => {
        const released = Number(project.spent || 0);
        const locked = Number(project.remainingBudget || 0);

        const status =
          locked === 0 ? "Released" : released === 0 ? "Locked" : "Partial";

        return {
          id: project.id,
          project: project.title,
          freelancer: project.freelancer?.name || "Not assigned",
          total: Number(project.budget || 0),
          released,
          locked,
          status,
          progress: project.progress || 0,
        };
      }),
    [projects]
  );

  const filteredEscrows =
    activeStatus === "All"
      ? escrows
      : escrows.filter((escrow) => escrow.status === activeStatus);

  const totalFunded = escrows.reduce((sum, escrow) => sum + escrow.total, 0);
  const totalReleased = escrows.reduce((sum, escrow) => sum + escrow.released, 0);
  const totalLocked = escrows.reduce((sum, escrow) => sum + escrow.locked, 0);

  const stats = [
    {
      label: "Total Funded",
      value: formatCurrency(totalFunded),
      helper: "Across your projects",
      icon: Wallet,
      tone: "bg-[#fff7ed] text-[#7c341d] border-[#f0d7c3]",
    },
    {
      label: "Released",
      value: formatCurrency(totalReleased),
      helper: "Approved milestones",
      icon: CheckCircle2,
      tone: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    },
    {
      label: "Locked",
      value: formatCurrency(totalLocked),
      helper: "Protected in escrow",
      icon: Lock,
      tone: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    },
    {
      label: "Projects",
      value: String(escrows.length),
      helper: "With escrow activity",
      icon: IndianRupee,
      tone: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    },
  ];

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7c6858]">
            Escrow
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#24130c]">
            Escrow centre
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Every payment is secured in escrow. Funds move to freelancers only
            after you approve the delivered work.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 py-3 text-sm font-bold text-[#047857]">
          <ShieldCheck size={17} />
          Escrow protection active
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-[#5f4a3c]">
                    {stat.label}
                  </p>

                  <h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#24130c]">
                    {stat.value}
                  </h3>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${stat.tone}`}
                >
                  <Icon size={19} />
                </div>
              </div>

              <p className="mt-3 text-xs font-semibold text-[#7c6858]">
                {stat.helper}
              </p>
            </div>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-black text-[#24130c]">
            Escrow records
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {["All", "Locked", "Partial", "Released"].map((status) => {
              const active = activeStatus === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatus(status)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-[#6f2e1c] text-white shadow-lg shadow-[#6f2e1c]/20"
                      : "border border-[#eadfd2] bg-white/80 text-[#7a4a34] hover:bg-white"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        {loading && (
          <p className="mt-5 text-sm font-bold text-[#7c6858]">
            Loading escrow records...
          </p>
        )}

        {!loading && error && (
          <p className="mt-5 text-sm font-semibold text-[#b91c1c]">{error}</p>
        )}

        {!loading && !error && filteredEscrows.length === 0 && (
          <div className="mt-5 rounded-[1.5rem] border border-dashed border-[#d7c3b2] bg-white p-8 text-center">
            <p className="text-sm font-bold text-[#7c6858]">
              No escrow records in this view yet.
            </p>

            <Link
              href="/client/projects/create"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416]"
            >
              Post a Project
            </Link>
          </div>
        )}

        {!loading && !error && filteredEscrows.length > 0 && (
          <div className="mt-5 space-y-3">
            {filteredEscrows.map((escrow) => (
              <div
                key={escrow.id}
                className="rounded-[1.5rem] border border-[#eadfd2] bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-black tracking-wide ${
                        escrowStatusStyles[escrow.status]
                      }`}
                    >
                      {escrow.status}
                    </span>

                    <Link
                      href={`/client/projects/${escrow.id}`}
                      className="mt-3 block truncate text-base font-black text-[#24130c] hover:text-[#6f2e1c]"
                    >
                      {escrow.project}
                    </Link>

                    <p className="mt-1 text-xs font-semibold text-[#7c6858]">
                      Freelancer: {escrow.freelancer}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#806049]">
                      Locked
                    </p>

                    <p className="mt-1 text-lg font-black text-[#b45309]">
                      {formatCurrency(escrow.locked)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-[#fffaf3] p-4 text-center">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#806049]">
                      Funded
                    </p>

                    <p className="mt-1 text-sm font-black text-[#24130c]">
                      {formatCurrency(escrow.total)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#806049]">
                      Released
                    </p>

                    <p className="mt-1 text-sm font-black text-[#047857]">
                      {formatCurrency(escrow.released)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#806049]">
                      Progress
                    </p>

                    <p className="mt-1 text-sm font-black text-[#24130c]">
                      {escrow.progress}%
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eadfd2]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6f2e1c] to-[#f4b454]"
                    style={{ width: `${escrow.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
