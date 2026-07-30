"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
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

const availabilityOptions = [
  {
    label: "Available for new work",
    value: "AVAILABLE",
  },
  {
    label: "Busy but open to invites",
    value: "BUSY_OPEN",
  },
  {
    label: "Not available currently",
    value: "NOT_AVAILABLE",
  },
];

const initialSettings = {
  account: {
    name: "",
    email: "",
    provider: "credentials",
    role: "FREELANCER",
    status: "ACTIVE",
    emailVerified: false,
    hasPassword: false,
    joinedAtDisplay: "No date",
    updatedAtDisplay: "No date",
  },
  freelancer: {
    availability: "AVAILABLE",
    location: "",
    professionalTitle: "Freelance Developer",
  },
  preferences: {
    emailNotifications: true,
    milestoneAlerts: true,
    proposalAlerts: true,
    walletAlerts: true,
    theme: "SYSTEM",
    language: "EN",
  },
};

function Toggle({ enabled, onChange, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative h-7 w-12 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
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

function statusLabel(value) {
  return String(value || "")
    .split("_")
    .join(" ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function FreelancerSettingsPage() {
  const [settings, setSettings] = useState(initialSettings);

  const [accountForm, setAccountForm] = useState({
    name: "",
    availability: "AVAILABLE",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    deadlineAlerts: true,
    paymentAlerts: true,
    messageAlerts: true,
    disputeAlerts: true,
    profileVisible: true,
    showEarnings: false,
    twoFactorEnabled: false,
  });

  const [selectedTheme, setSelectedTheme] = useState("Warm Premium");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  async function loadSettings() {
    try {
      setLoading(true);
      setMessage({
        type: "",
        text: "",
      });

      const response = await fetch("/api/freelancer/settings", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load settings.");
      }

      setSettings(result.data);

      setAccountForm({
        name: result.data.account?.name || "",
        availability: result.data.freelancer?.availability || "AVAILABLE",
      });

      setPreferences((current) => ({
        ...current,
        emailNotifications: Boolean(
          result.data.preferences?.emailNotifications
        ),
        deadlineAlerts: Boolean(result.data.preferences?.milestoneAlerts),
        paymentAlerts: Boolean(result.data.preferences?.walletAlerts),
      }));
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Unable to load settings.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function updatePreference(field, value) {
    setPreferences((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveAccountSettings() {
    try {
      setSavingAccount(true);
      setMessage({
        type: "",
        text: "",
      });

      const response = await fetch("/api/freelancer/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          name: accountForm.name,
          availability: accountForm.availability,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save account settings.");
      }

      setSettings(result.data);

      setAccountForm({
        name: result.data.account?.name || "",
        availability: result.data.freelancer?.availability || "AVAILABLE",
      });

      setMessage({
        type: "success",
        text: "Account settings saved successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Unable to save account settings.",
      });
    } finally {
      setSavingAccount(false);
    }
  }

  async function updatePassword() {
    try {
      setSavingPassword(true);
      setMessage({
        type: "",
        text: "",
      });

      if (!passwordForm.currentPassword) {
        throw new Error("Current password is required.");
      }

      if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters.");
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error("New password and confirm password do not match.");
      }

      const response = await fetch("/api/freelancer/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to update password.");
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage({
        type: "success",
        text: "Password updated successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Unable to update password.",
      });
    } finally {
      setSavingPassword(false);
    }
  }

  const accountHealth = useMemo(
    () => [
      {
        label: "Email",
        value: settings.account.emailVerified ? "Verified" : "Pending",
        icon: Mail,
      },
      {
        label: "Role",
        value: statusLabel(settings.account.role || "Freelancer"),
        icon: UserRound,
      },
      {
        label: "Account",
        value: statusLabel(settings.account.status || "Active"),
        icon: LockKeyhole,
      },
    ],
    [settings]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-[1480px] space-y-6">
        <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm font-bold text-[#7c6858]">
            Loading freelancer settings...
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
            Settings
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#24130c] sm:text-4xl">
            Control your account, security, and workspace preferences.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7c6858]">
            Account name and availability are saved to the backend. Other
            preferences are UI-ready and need a settings/preferences table later.
          </p>
        </div>

        <button
          type="button"
          onClick={saveAccountSettings}
          disabled={savingAccount}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          {savingAccount ? "Saving..." : "Save Account"}
        </button>
      </section>

      {message.text && (
        <section
          className={`rounded-2xl border p-4 text-sm font-bold ${
            message.type === "error"
              ? "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]"
              : "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]"
          }`}
        >
          {message.text}
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#35170f] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f4b454]">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              Account health
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Your account status, email verification, and role are fetched
              directly from the backend.
            </p>

            <div className="mt-6 grid gap-3">
              {accountHealth.map((item) => {
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

            <p className="mt-2 text-sm leading-6 text-[#7c6858]">
              These switches are local UI state for now. Persist them later with
              a `UserPreference` table.
            </p>

            <div className="mt-5 space-y-4">
              {[
                {
                  label: "Email notifications",
                  text: "Receive important alerts on email.",
                  enabled: preferences.emailNotifications,
                  field: "emailNotifications",
                  icon: Mail,
                },
                {
                  label: "Deadline alerts",
                  text: "Get reminded before milestone due dates.",
                  enabled: preferences.deadlineAlerts,
                  field: "deadlineAlerts",
                  icon: Clock3,
                },
                {
                  label: "Public profile visible",
                  text: "Allow clients to view your display card.",
                  enabled: preferences.profileVisible,
                  field: "profileVisible",
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

                    <Toggle
                      enabled={item.enabled}
                      onChange={(value) => updatePreference(item.field, value)}
                    />
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
              Logout works now. Account deletion needs a separate backend flow
              with re-authentication.
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#eadfd2] bg-white text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
              >
                <LogOut size={17} />
                Logout
              </button>

              <button
                type="button"
                disabled
                className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#fecaca] bg-[#fef2f2] text-sm font-black text-[#b91c1c]/60"
              >
                <Trash2 size={17} />
                Account Deletion Later
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
                  Name and availability are backend-connected.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#6f2e1c]">
                <UserRound size={21} />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Full Name
                </span>

                <input
                  type="text"
                  value={accountForm.name}
                  onChange={(event) =>
                    setAccountForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Email Address
                </span>

                <input
                  type="email"
                  value={settings.account.email || ""}
                  readOnly
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#7c6858] outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Availability Status
                </span>

                <select
                  value={accountForm.availability}
                  onChange={(event) =>
                    setAccountForm((current) => ({
                      ...current,
                      availability: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Provider
                </span>

                <input
                  type="text"
                  value={settings.account.provider || "credentials"}
                  readOnly
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#7c6858] outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Joined On
                </span>

                <input
                  type="text"
                  value={settings.account.joinedAtDisplay || "No date"}
                  readOnly
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#7c6858] outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Last Updated
                </span>

                <input
                  type="text"
                  value={settings.account.updatedAtDisplay || "No date"}
                  readOnly
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#7c6858] outline-none"
                />
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
                  UI-ready toggles. Persist later with `UserPreference`.
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
                  enabled: preferences.pushNotifications,
                  field: "pushNotifications",
                  icon: Smartphone,
                },
                {
                  label: "Payment alerts",
                  text: "Funding, release, and wallet updates.",
                  enabled: preferences.paymentAlerts,
                  field: "paymentAlerts",
                  icon: BadgeCheck,
                },
                {
                  label: "Message alerts",
                  text: "New client chat notifications.",
                  enabled: preferences.messageAlerts,
                  field: "messageAlerts",
                  icon: MessageSquareText,
                },
                {
                  label: "Dispute alerts",
                  text: "Admin review and dispute decisions.",
                  enabled: preferences.disputeAlerts,
                  field: "disputeAlerts",
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

                    <Toggle
                      enabled={item.enabled}
                      onChange={(value) => updatePreference(item.field, value)}
                    />
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
                  Password update is backend-connected for credential accounts.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#6f2e1c]">
                <LockKeyhole size={21} />
              </div>
            </div>

            {!settings.account.hasPassword && (
              <div className="mb-5 rounded-2xl border border-[#fde68a] bg-[#fffbeb] p-4 text-sm font-bold text-[#92400e]">
                Password change is not available for social login accounts.
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Current Password
                </span>

                <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4">
                  <KeyRound size={17} className="text-[#9b7a64]" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    disabled={!settings.account.hasPassword}
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        currentPassword: event.target.value,
                      }))
                    }
                    placeholder="Enter current password"
                    className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88] disabled:cursor-not-allowed"
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
                    value={passwordForm.newPassword}
                    disabled={!settings.account.hasPassword}
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        newPassword: event.target.value,
                      }))
                    }
                    placeholder="Minimum 8 characters"
                    className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88] disabled:cursor-not-allowed"
                  />
                </div>
              </label>

              <label className="block md:col-span-2">
                <span className="text-sm font-black text-[#24130c]">
                  Confirm New Password
                </span>

                <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4">
                  <KeyRound size={17} className="text-[#9b7a64]" />

                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    disabled={!settings.account.hasPassword}
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                    }
                    placeholder="Confirm new password"
                    className="w-full bg-transparent text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88] disabled:cursor-not-allowed"
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
                    UI-ready only. Needs OTP/authenticator backend later.
                  </p>
                </div>
              </div>

              <Toggle
                enabled={preferences.twoFactorEnabled}
                onChange={(value) =>
                  updatePreference("twoFactorEnabled", value)
                }
              />
            </div>

            <button
              type="button"
              onClick={updatePassword}
              disabled={!settings.account.hasPassword || savingPassword}
              className="mt-5 h-11 rounded-xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingPassword ? "Updating..." : "Update Password"}
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
                    Local UI state until privacy settings table is added.
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

                  <Toggle
                    enabled={preferences.profileVisible}
                    onChange={(value) =>
                      updatePreference("profileVisible", value)
                    }
                  />
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

                  <Toggle
                    enabled={preferences.showEarnings}
                    onChange={(value) =>
                      updatePreference("showEarnings", value)
                    }
                  />
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
                    Local UI selection only.
                  </p>
                </div>

                <Palette size={21} className="text-[#6f2e1c]" />
              </div>

              <div className="grid gap-3">
                {["Warm Premium", "Light Minimal", "Dark SaaS"].map((theme) => (
                  <button
                    type="button"
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                      selectedTheme === theme
                        ? "border-[#6f2e1c] bg-[#fff7ed]"
                        : "border-[#eadfd2] bg-[#fffaf3] hover:bg-white"
                    }`}
                  >
                    <span className="text-sm font-black text-[#24130c]">
                      {theme}
                    </span>

                    {selectedTheme === theme && (
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
                  UI-ready only. Needs a `SupportTicket` model and API.
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

                  <select
                    disabled
                    className="mt-2 h-12 w-full cursor-not-allowed rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none"
                  >
                    <option>Support backend not connected yet</option>
                  </select>
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-black text-[#24130c]">
                    Message
                  </span>

                  <textarea
                    rows={5}
                    disabled
                    placeholder="Support ticket API will be added later..."
                    className="mt-2 w-full resize-none rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#24130c] outline-none placeholder:text-[#b79d88]"
                  />
                </label>

                <button
                  type="button"
                  disabled
                  className="mt-4 inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#6f2e1c]/60 px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20"
                >
                  <HelpCircle size={17} />
                  Submit Later
                </button>
              </form>

              <div className="rounded-[1.5rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-8 text-center">
                <FileText size={24} className="mx-auto text-[#6f2e1c]" />

                <h3 className="mt-4 text-lg font-black text-[#24130c]">
                  No support tickets connected
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#7c6858]">
                  We will add real support tickets after the main freelancer
                  workflow modules are completed.
                </p>
              </div>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}