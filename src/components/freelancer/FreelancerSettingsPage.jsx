"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  Globe2,
  HelpCircle,
  KeyRound,
  LifeBuoy,
  LockKeyhole,
  LogOut,
  Mail,
  MessageSquareText,
  Palette,
  Save,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserRound,
} from "lucide-react";

const supportTickets = [
  {
    id: "SUP-001",
    title: "Milestone release delay",
    status: "OPEN",
    createdAt: "Today",
    type: "Wallet",
  },
  {
    id: "SUP-002",
    title: "Unable to upload submission file",
    status: "RESOLVED",
    createdAt: "12 Jun 2026",
    type: "Submission",
  },
];

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative h-7 w-12 rounded-full transition ${
        enabled ? "bg-[#6f2e1c]" : "bg-[#d7c3b2]"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    OPEN: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    RESOLVED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[status] || styles.OPEN
      }`}
    >
      {status}
    </span>
  );
}

export default function FreelancerSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [disputeAlerts, setDisputeAlerts] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [showEarnings, setShowEarnings] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b7a64]">
            Settings
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Control your account, security, and workspace preferences.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Manage notifications, privacy, password, support requests, and
            freelancer account preferences from one place.
          </p>
        </div>

        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]">
          <Save size={18} />
          Save Settings
        </button>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              Account health is strong.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Your email is verified, profile is active, and freelancer account
              is ready to receive client invites.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                {
                  label: "Email Verified",
                  value: "Active",
                  icon: Mail,
                },
                {
                  label: "Role",
                  value: "Freelancer",
                  icon: UserRound,
                },
                {
                  label: "Session Security",
                  value: "Protected",
                  icon: LockKeyhole,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-[#f4b454]" />
                      <p className="text-sm font-semibold text-white/70">
                        {item.label}
                      </p>
                    </div>

                    <p className="text-sm font-black text-white">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Quick Settings
            </h2>

            <div className="mt-5 space-y-4">
              {[
                {
                  label: "Email notifications",
                  text: "Receive important alerts on email.",
                  enabled: emailNotifications,
                  setEnabled: setEmailNotifications,
                  icon: Mail,
                },
                {
                  label: "Deadline alerts",
                  text: "Get reminded before milestone due dates.",
                  enabled: deadlineAlerts,
                  setEnabled: setDeadlineAlerts,
                  icon: Clock3,
                },
                {
                  label: "Public profile visible",
                  text: "Allow clients to view your display card.",
                  enabled: profileVisible,
                  setEnabled: setProfileVisible,
                  icon: BadgeCheck,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
                        <Icon size={17} />
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-[#24130c]">
                          {item.label}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                          {item.text}
                        </p>
                      </div>
                    </div>

                    <Toggle enabled={item.enabled} onChange={item.setEnabled} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#fecaca] bg-[#fff7f7] p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fef2f2] text-[#b91c1c]">
              <AlertTriangle size={24} />
            </div>

            <h2 className="mt-5 text-xl font-black tracking-[-0.03em] text-[#24130c]">
              Danger Zone
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#7c6858]">
              Use these actions carefully. Later, backend confirmation modals
              and password re-authentication should be added here.
            </p>

            <div className="mt-5 space-y-3">
              <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-white text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]">
                <LogOut size={17} />
                Logout
              </button>

              <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#fecaca] bg-[#fef2f2] text-sm font-black text-[#b91c1c] transition hover:bg-[#fee2e2]">
                <Trash2 size={17} />
                Request Account Deletion
              </button>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                  Account Preferences
                </h2>

                <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                  Configure basic freelancer workspace preferences.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#6f2e1c]">
                <UserRound size={21} />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Default Workspace
                </span>

                <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
                  <option>Dashboard</option>
                  <option>Deal Rooms</option>
                  <option>Milestones</option>
                  <option>Messages</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Availability Status
                </span>

                <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
                  <option>Available for new work</option>
                  <option>Busy but open to invites</option>
                  <option>Not available currently</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Preferred Currency
                </span>

                <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
                  <option>INR - Indian Rupee</option>
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Timezone
                </span>

                <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
                  <option>Asia/Kolkata</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                  Notification Preferences
                </h2>

                <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                  Choose which alerts should reach you.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#6f2e1c]">
                <Bell size={21} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  label: "Push notifications",
                  text: "Show browser/app alerts.",
                  enabled: pushNotifications,
                  setEnabled: setPushNotifications,
                  icon: Smartphone,
                },
                {
                  label: "Payment alerts",
                  text: "Funding, release, and wallet updates.",
                  enabled: paymentAlerts,
                  setEnabled: setPaymentAlerts,
                  icon: BadgeCheck,
                },
                {
                  label: "Message alerts",
                  text: "New client chat notifications.",
                  enabled: messageAlerts,
                  setEnabled: setMessageAlerts,
                  icon: MessageSquareText,
                },
                {
                  label: "Dispute alerts",
                  text: "Admin review and dispute decision updates.",
                  enabled: disputeAlerts,
                  setEnabled: setDisputeAlerts,
                  icon: AlertTriangle,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
                        <Icon size={17} />
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-[#24130c]">
                          {item.label}
                        </h3>

                        <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                          {item.text}
                        </p>
                      </div>
                    </div>

                    <Toggle enabled={item.enabled} onChange={item.setEnabled} />
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                  Security Settings
                </h2>

                <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                  Protect your freelancer account and payment-related actions.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#6f2e1c]">
                <LockKeyhole size={21} />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Current Password
                </span>

                <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4">
                  <KeyRound size={17} className="text-[#9b7a64]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#9b7a64]"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  New Password
                </span>

                <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4">
                  <KeyRound size={17} className="text-[#9b7a64]" />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88]"
                  />
                </div>
              </label>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f2e1c]">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#24130c]">
                    Two-factor authentication
                  </h3>

                  <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                    Later this can use phone OTP or authenticator app.
                  </p>
                </div>
              </div>

              <Toggle enabled={twoFactorEnabled} onChange={setTwoFactorEnabled} />
            </div>

            <button className="mt-5 h-11 rounded-xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]">
              Update Password
            </button>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                    Privacy
                  </h2>

                  <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                    Control what clients can see.
                  </p>
                </div>

                <Globe2 size={21} className="text-[#6f2e1c]" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4">
                  <div>
                    <h3 className="text-sm font-black text-[#24130c]">
                      Show public profile
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                      Clients can view your freelancer card.
                    </p>
                  </div>

                  <Toggle enabled={profileVisible} onChange={setProfileVisible} />
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] p-4">
                  <div>
                    <h3 className="text-sm font-black text-[#24130c]">
                      Show earnings publicly
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                      Display earnings on public card.
                    </p>
                  </div>

                  <Toggle enabled={showEarnings} onChange={setShowEarnings} />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                    Appearance
                  </h2>

                  <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                    UI preferences for your workspace.
                  </p>
                </div>

                <Palette size={21} className="text-[#6f2e1c]" />
              </div>

              <div className="grid gap-3">
                {["Warm Premium", "Light Minimal", "Dark SaaS"].map((theme) => (
                  <button
                    key={theme}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                      theme === "Warm Premium"
                        ? "border-[#6f2e1c] bg-[#fff7ed]"
                        : "border-[#eadfd2] bg-[#fffaf3] hover:bg-white"
                    }`}
                  >
                    <span className="text-sm font-black text-[#24130c]">
                      {theme}
                    </span>

                    {theme === "Warm Premium" && (
                      <CheckCircle2 size={18} className="text-[#6f2e1c]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-[#24130c]">
                  Support Center
                </h2>

                <p className="mt-1 text-sm font-medium text-[#9b7a64]">
                  Raise support issues related to projects, wallet, submissions,
                  or account access.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#6f2e1c]">
                <LifeBuoy size={21} />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
              <form className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-5">
                <label className="block">
                  <span className="text-sm font-black text-[#24130c]">
                    Issue Type
                  </span>

                  <select className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]">
                    <option>Project issue</option>
                    <option>Payment / wallet issue</option>
                    <option>Submission issue</option>
                    <option>Account access issue</option>
                    <option>Other support request</option>
                  </select>
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-black text-[#24130c]">
                    Message
                  </span>

                  <textarea
                    rows={5}
                    placeholder="Explain the support issue clearly..."
                    className="mt-2 w-full resize-none rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
                  />
                </label>

                <button
                  type="button"
                  className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416]"
                >
                  <HelpCircle size={17} />
                  Submit Support Request
                </button>
              </form>

              <div className="space-y-3">
                {supportTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-[1.5rem] border border-[#eadfd2] bg-[#fffaf3] p-5"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <StatusBadge status={ticket.status} />
                      <FileText size={17} className="text-[#9b7a64]" />
                    </div>

                    <h3 className="text-sm font-black text-[#24130c]">
                      {ticket.title}
                    </h3>

                    <p className="mt-1 text-xs font-semibold text-[#9b7a64]">
                      {ticket.type} • {ticket.createdAt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}