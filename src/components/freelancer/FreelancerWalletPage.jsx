"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Banknote,
  CalendarClock,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  IndianRupee,
  Landmark,
  ListChecks,
  ShieldAlert,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function StatusBadge({ status }) {
  const styles = {
    APPROVED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    SUBMITTED: "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]",
    IN_PROGRESS: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    PENDING: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
    REJECTED: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    COMPLETED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    PROCESSING: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    FAILED: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
  };

  const labels = {
    APPROVED: "Released",
    SUBMITTED: "Pending Approval",
    IN_PROGRESS: "Active Work",
    PENDING: "Not Started",
    REJECTED: "Revision Pending",
    COMPLETED: "Completed",
    PROCESSING: "Processing",
    FAILED: "Failed",
  };

  const normalizedStatus = String(status || "PENDING");

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[normalizedStatus] || styles.PENDING
      }`}
    >
      {labels[normalizedStatus] || normalizedStatus.split("_").join(" ")}
    </span>
  );
}

function TransactionIcon({ type }) {
  if (type === "EARNING_RELEASED") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ecfdf5] text-[#047857]">
        <ArrowDownToLine size={19} />
      </div>
    );
  }

  if (type === "REVISION_PENDING") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fffbeb] text-[#b45309]">
        <ShieldAlert size={19} />
      </div>
    );
  }

  if (type === "PENDING_APPROVAL") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5f3ff] text-[#6d28d9]">
        <Clock3 size={19} />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#1d4ed8]">
      <Clock3 size={19} />
    </div>
  );
}

function getTransactionAmountPrefix(type) {
  if (type === "EARNING_RELEASED") return "+";
  return "";
}

function getTransactionAmountClass(type) {
  if (type === "EARNING_RELEASED") return "text-[#047857]";
  if (type === "REVISION_PENDING") return "text-[#b45309]";
  if (type === "PENDING_APPROVAL") return "text-[#6d28d9]";
  return "text-[#1d4ed8]";
}

function getExpectedText(status) {
  const map = {
    PENDING: "After work starts",
    IN_PROGRESS: "After submission",
    SUBMITTED: "After client approval",
    REJECTED: "After revision approval",
    APPROVED: "Already released",
  };

  return map[status] || "After milestone update";
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-10 text-center">
      <Wallet size={24} className="mx-auto text-[#6f2e1c]" />

      <h3 className="mt-4 text-lg font-black text-[#24130c]">{title}</h3>

      <p className="mt-2 text-sm text-[#7c6858]">{text}</p>
    </div>
  );
}

export default function FreelancerWalletPage() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [walletData, setWalletData] = useState({
    summary: {
      availableBalance: 0,
      availableBalanceDisplay: "₹0",
      pendingApproval: 0,
      pendingApprovalDisplay: "₹0",
      activeWorkValue: 0,
      activeWorkValueDisplay: "₹0",
      revisionValue: 0,
      revisionValueDisplay: "₹0",
      totalTrackedValue: 0,
      totalTrackedValueDisplay: "₹0",
    },
    counts: {
      approvedMilestones: 0,
      submittedMilestones: 0,
      activeMilestones: 0,
    },
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadWallet() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch("/api/freelancer/wallet", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load freelancer wallet.");
        }

        if (!ignore) {
          setWalletData(result.data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || "Unable to load freelancer wallet.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadWallet();

    return () => {
      ignore = true;
    };
  }, []);

  const summary = walletData.summary || {};
  const counts = walletData.counts || {};
  const transactions = walletData.transactions || [];

  const walletStats = useMemo(
    () => [
      {
        label: "Available Balance",
        value: summary.availableBalanceDisplay || "₹0",
        helper: "Approved milestone earnings",
        icon: Wallet,
      },
      {
        label: "Pending Approval",
        value: summary.pendingApprovalDisplay || "₹0",
        helper: "Submitted but not approved",
        icon: Clock3,
      },
      {
        label: "Active Work Value",
        value: summary.activeWorkValueDisplay || "₹0",
        helper: "In-progress milestone value",
        icon: ListChecks,
      },
      {
        label: "Total Tracked",
        value: summary.totalTrackedValueDisplay || "₹0",
        helper: "All tracked milestone value",
        icon: Banknote,
      },
    ],
    [summary]
  );

  const upcomingReleases = useMemo(() => {
    return transactions
      .filter((item) => item.status !== "APPROVED")
      .slice(0, 5);
  }, [transactions]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">
            Loading freelancer wallet...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#fecaca] bg-[#fff7f7] p-8 shadow-sm">
          <h2 className="text-xl font-black text-[#24130c]">
            Unable to load wallet
          </h2>

          <p className="mt-2 text-sm font-semibold text-[#b91c1c]">
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
            Wallet
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Track approved earnings and milestone payment states.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Monitor approved milestone earnings, pending approvals, active work
            value, and revision-linked payment states from one wallet workspace.
          </p>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
        >
          <ArrowDownToLine size={18} />
          Withdraw Test Balance
        </button>
      </section>

      <section className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f4b454]">
              Available Wallet Balance
            </p>

            <h2 className="mt-4 text-5xl font-black tracking-[-0.07em] sm:text-6xl">
              {summary.availableBalanceDisplay || "₹0"}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              This currently represents approved milestone earnings only. Real
              escrow, Razorpay payments, and withdrawals should be added after
              payment transaction models are finalized.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/45">
                Approved Milestones
              </p>
              <p className="mt-2 text-sm font-black text-white">
                {counts.approvedMilestones || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/45">
                Wallet Status
              </p>
              <p className="mt-2 text-sm font-black text-[#f4b454]">
                Milestone Based
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {walletStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-[1.5rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-[#7c6858]">
                    {stat.label}
                  </p>

                  <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c]">
                    {stat.value}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f0d7c3] bg-[#fff7ed] text-[#7c341d]">
                  <Icon size={19} />
                </div>
              </div>

              <p className="mt-3 text-xs font-semibold text-[#9b7a64]">
                {stat.helper}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                Wallet Transactions
              </h2>

              <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                Generated from your milestone states until payment models are
                added.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-black text-[#6f2e1c]/60"
            >
              <Download size={17} />
              Export Later
            </button>
          </div>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <article
                key={transaction.id}
                className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-5 transition hover:border-[#d7c3b2] hover:bg-white"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div className="flex gap-4">
                    <TransactionIcon type={transaction.type} />

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={transaction.status} />

                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#9b7a64]">
                          {transaction.id}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-black tracking-[-0.03em] text-[#24130c]">
                        {transaction.type
                          .split("_")
                          .join(" ")
                          .toLowerCase()
                          .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-[#9b7a64]">
                        {transaction.project?.title || "Project"}
                      </p>

                      <p className="mt-2 text-sm leading-5 text-[#7c6858]">
                        Milestone:{" "}
                        <span className="font-bold text-[#24130c]">
                          {transaction.title}
                        </span>
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                        Client: {transaction.project?.client?.name || "Client"}
                      </p>
                    </div>
                  </div>

                  <div className="text-left lg:text-right">
                    <p
                      className={`text-xl font-black tracking-[-0.03em] ${getTransactionAmountClass(
                        transaction.type
                      )}`}
                    >
                      {getTransactionAmountPrefix(transaction.type)}
                      {transaction.amountDisplay}
                    </p>

                    <p className="mt-1 text-xs font-bold text-[#b79d88]">
                      {transaction.dateDisplay}
                    </p>
                  </div>
                </div>
              </article>
            ))}

            {transactions.length === 0 && (
              <EmptyState
                title="No wallet activity yet"
                text="Milestone activity will appear here once projects and milestones are created."
              />
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Payout Methods
            </h2>

            <div className="mt-5 rounded-2xl border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
                <Landmark size={20} />
              </div>

              <h3 className="mt-3 text-sm font-black text-[#24130c]">
                Payout methods not connected yet
              </h3>

              <p className="mt-2 text-sm leading-5 text-[#7c6858]">
                Bank/UPI payout storage should be added with payment compliance
                and Razorpay payout flow.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="mt-5 h-11 w-full cursor-not-allowed rounded-xl border border-[#eadfd2] bg-[#fffaf3] text-sm font-black text-[#6f2e1c]/60"
            >
              Add Payout Method Later
            </button>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Upcoming Releases
            </h2>

            <div className="mt-5 space-y-3">
              {upcomingReleases.map((release) => (
                <div
                  key={release.id}
                  className="rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4"
                >
                  <StatusBadge status={release.status} />

                  <h3 className="mt-3 text-sm font-black text-[#24130c]">
                    {release.title}
                  </h3>

                  <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                    {release.project?.title || "Project"}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-[#24130c]">
                      {release.amountDisplay}
                    </p>

                    <p className="text-xs font-bold text-[#b45309]">
                      {getExpectedText(release.status)}
                    </p>
                  </div>
                </div>
              ))}

              {upcomingReleases.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-5 text-center">
                  <CheckCircle2 size={20} className="mx-auto text-[#047857]" />

                  <p className="mt-2 text-sm font-semibold text-[#7c6858]">
                    No upcoming releases yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              Wallet safety note.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Funds should only become withdrawable after milestone approval.
              Pending, submitted, or revision milestones should stay locked
              until the review flow is complete.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Approved means available",
                "Submitted means waiting approval",
                "In progress means work value only",
                "Real payouts need payment models",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="text-[#f4b454]" />

                  <p className="text-sm font-semibold text-white/78">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {showWithdrawModal && (
        <WithdrawModal
          availableBalance={summary.availableBalance || 0}
          availableBalanceDisplay={summary.availableBalanceDisplay || "₹0"}
          onClose={() => setShowWithdrawModal(false)}
        />
      )}
    </div>
  );
}

function WithdrawModal({ availableBalance, availableBalanceDisplay, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#120905]/55 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
              Sandbox Withdrawal
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#24130c]">
              Withdraw test balance
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#7c6858]">
              This modal is UI-ready only. Actual payout needs wallet
              transaction, payout method, and Razorpay payout models.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f2e1c] shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        <form className="space-y-5">
          <div className="rounded-2xl border border-[#eadfd2] bg-white p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b79d88]">
              Available Balance
            </p>

            <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c]">
              {availableBalanceDisplay}
            </p>
          </div>

          <label className="block">
            <span className="text-sm font-black text-[#24130c]">
              Withdrawal Amount
            </span>

            <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-white px-4">
              <IndianRupee size={17} className="text-[#9b7a64]" />

              <input
                type="number"
                min="0"
                max={availableBalance}
                placeholder="Enter amount"
                disabled
                className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88] disabled:cursor-not-allowed"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-black text-[#24130c]">
              Payout Method
            </span>

            <select
              disabled
              className="mt-2 h-12 w-full cursor-not-allowed rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none"
            >
              <option>Payout method not connected yet</option>
            </select>
          </label>

          <div className="rounded-2xl border border-[#fde68a] bg-[#fffbeb] p-4">
            <div className="flex gap-3">
              <CalendarClock size={18} className="shrink-0 text-[#b45309]" />

              <p className="text-sm leading-6 text-[#92400e]">
                Withdrawal is intentionally disabled until payment compliance,
                Razorpay test payout flow, and wallet transaction models are
                added.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-2xl border border-[#eadfd2] bg-white px-5 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
            >
              Close
            </button>

            <button
              type="button"
              disabled
              className="h-12 cursor-not-allowed rounded-2xl bg-[#6f2e1c]/60 px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20"
            >
              Payout Coming Soon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}