"use client";

import { useMemo, useState } from "react";
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
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";

const walletStats = [
  {
    label: "Available Balance",
    value: 12400,
    helper: "Released milestone earnings",
    icon: Wallet,
  },
  {
    label: "Pending Funded",
    value: 24500,
    helper: "Funded but not released yet",
    icon: Clock3,
  },
  {
    label: "Withdrawn",
    value: 18600,
    helper: "Sandbox withdrawals completed",
    icon: ArrowDownToLine,
  },
  {
    label: "Total Earned",
    value: 31000,
    helper: "Released across completed milestones",
    icon: Banknote,
  },
];

const payoutMethods = [
  {
    id: "bank-1",
    type: "Bank Account",
    name: "HDFC Bank",
    details: "XXXX XXXX 4821",
    status: "Verified",
  },
  {
    id: "upi-1",
    type: "UPI",
    name: "kushaagra@upi",
    details: "Primary UPI ID",
    status: "Test Mode",
  },
];

const transactions = [
  {
    id: "TXN-001",
    title: "Milestone released",
    project: "TrustOnes Client Portal",
    milestone: "Dashboard UI Polish",
    amount: 7500,
    type: "CREDIT",
    status: "COMPLETED",
    date: "16 Jun 2026",
  },
  {
    id: "TXN-002",
    title: "Sandbox withdrawal",
    project: "Wallet Payout",
    milestone: "RazorpayX Test Payout",
    amount: 5000,
    type: "DEBIT",
    status: "PROCESSING",
    date: "15 Jun 2026",
  },
  {
    id: "TXN-003",
    title: "Milestone funded",
    project: "TrustOnes Client Portal",
    milestone: "Backend API Integration",
    amount: 8500,
    type: "PENDING",
    status: "FUNDED",
    date: "Today",
  },
  {
    id: "TXN-004",
    title: "Milestone released",
    project: "Portfolio Website Redesign",
    milestone: "Wireframe Approval",
    amount: 4000,
    type: "CREDIT",
    status: "COMPLETED",
    date: "11 Jun 2026",
  },
  {
    id: "TXN-005",
    title: "Milestone funded",
    project: "Healthcare Appointment UI",
    milestone: "Responsive Dashboard UI",
    amount: 6000,
    type: "PENDING",
    status: "REVISION_REQUESTED",
    date: "09 Jun 2026",
  },
];

const upcomingReleases = [
  {
    id: 1,
    title: "Backend API Integration",
    project: "TrustOnes Client Portal",
    amount: 8500,
    expected: "After client approval",
    status: "FUNDED",
  },
  {
    id: 2,
    title: "Responsive Dashboard UI",
    project: "Healthcare Appointment UI",
    amount: 6000,
    expected: "After revision approval",
    status: "REVISION_REQUESTED",
  },
  {
    id: 3,
    title: "Submission Review Flow",
    project: "TrustOnes Client Portal",
    amount: 9000,
    expected: "After funding + submission",
    status: "PENDING",
  },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatusBadge({ status }) {
  const styles = {
    COMPLETED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    PROCESSING: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    FUNDED: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    PENDING: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
    FAILED: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
    REVISION_REQUESTED: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[status] || styles.PENDING
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function TransactionIcon({ type }) {
  if (type === "CREDIT") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ecfdf5] text-[#047857]">
        <ArrowDownToLine size={19} />
      </div>
    );
  }

  if (type === "DEBIT") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#b45309]">
        <ArrowUpRight size={19} />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#1d4ed8]">
      <Clock3 size={19} />
    </div>
  );
}

export default function FreelancerWalletPage() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const availableBalance = useMemo(() => {
    return walletStats.find((item) => item.label === "Available Balance").value;
  }, []);

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
            Wallet
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Track released earnings and sandbox withdrawals.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Monitor milestone earnings, pending funded amounts, payout history,
            and Razorpay test withdrawals from one wallet workspace.
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
              Sandbox Wallet Balance
            </p>

            <h2 className="mt-4 text-5xl font-black tracking-[-0.07em] sm:text-6xl">
              {formatCurrency(availableBalance)}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              This wallet currently represents released milestone earnings in
              test mode. Real escrow and real withdrawals should only be enabled
              after legal/payment compliance is finalized.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/45">
                Test Provider
              </p>
              <p className="mt-2 text-sm font-black text-white">
                Razorpay Test Mode
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/45">
                Wallet Status
              </p>
              <p className="mt-2 text-sm font-black text-[#f4b454]">
                Demo Enabled
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
                    {formatCurrency(stat.value)}
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
                Released milestones, pending funds, and sandbox withdrawals.
              </p>
            </div>

            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]">
              <Download size={17} />
              Export
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
                        {transaction.title}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-[#9b7a64]">
                        {transaction.project}
                      </p>

                      <p className="mt-2 text-sm leading-5 text-[#7c6858]">
                        Milestone:{" "}
                        <span className="font-bold text-[#24130c]">
                          {transaction.milestone}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-left lg:text-right">
                    <p
                      className={`text-xl font-black tracking-[-0.03em] ${
                        transaction.type === "DEBIT"
                          ? "text-[#b45309]"
                          : transaction.type === "PENDING"
                          ? "text-[#1d4ed8]"
                          : "text-[#047857]"
                      }`}
                    >
                      {transaction.type === "DEBIT" ? "-" : "+"}
                      {formatCurrency(transaction.amount)}
                    </p>

                    <p className="mt-1 text-xs font-bold text-[#b79d88]">
                      {transaction.date}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Payout Methods
            </h2>

            <div className="mt-5 space-y-3">
              {payoutMethods.map((method) => (
                <div
                  key={method.id}
                  className="rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
                        {method.type === "Bank Account" ? (
                          <Landmark size={18} />
                        ) : (
                          <CreditCard size={18} />
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-[#24130c]">
                          {method.name}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                          {method.details}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-[#a7f3d0] bg-[#ecfdf5] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#047857]">
                      {method.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-5 h-11 w-full rounded-xl border border-[#eadfd2] bg-[#fffaf3] text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]">
              Add Payout Method
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
                    {release.project}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-[#24130c]">
                      {formatCurrency(release.amount)}
                    </p>

                    <p className="text-xs font-bold text-[#b45309]">
                      {release.expected}
                    </p>
                  </div>
                </div>
              ))}
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
              Funds should only become withdrawable after milestone approval and
              release. Pending funded money should stay locked until the client
              review flow is complete.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Funded does not mean released",
                "Released means withdrawable",
                "Webhook verification must be idempotent",
                "Withdrawals stay sandbox for MVP",
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
          availableBalance={availableBalance}
          onClose={() => setShowWithdrawModal(false)}
        />
      )}
    </div>
  );
}

function WithdrawModal({ availableBalance, onClose }) {
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
              This will later connect with Razorpay test payout flow. For now,
              this modal is UI-ready.
            </p>
          </div>

          <button
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
              {formatCurrency(availableBalance)}
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
                placeholder="Enter amount"
                className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-black text-[#24130c]">
              Payout Method
            </span>

            <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
              <option>HDFC Bank • XXXX XXXX 4821</option>
              <option>kushaagra@upi</option>
            </select>
          </label>

          <div className="rounded-2xl border border-[#fde68a] bg-[#fffbeb] p-4">
            <div className="flex gap-3">
              <CalendarClock size={18} className="shrink-0 text-[#b45309]" />

              <p className="text-sm leading-6 text-[#92400e]">
                This is a test withdrawal. Actual payout processing will be
                connected after Razorpay test environment and backend wallet
                transaction models are ready.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-2xl border border-[#eadfd2] bg-white px-5 text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
            >
              Cancel
            </button>

            <button
              type="button"
              className="h-12 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
            >
              Confirm Test Withdrawal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}