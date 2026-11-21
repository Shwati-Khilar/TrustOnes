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

const initialPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  deadlineAlerts: true,
  paymentAlerts: true,
  messageAlerts: true,
  disputeAlerts: true,
  profileVisible: true,
  showEarnings: false,
  theme: "WARM_PREMIUM",
  language: "EN",
  timezone: "Asia/Kolkata",
  defaultWorkspace: "DASHBOARD",
  preferredCurrency: "INR",
};

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
  preferences: initialPreferences,
  supportTickets: [],
};

const availabilityOptions = [
  { label: "Available for new work", value: "AVAILABLE" },
  { label: "Busy but open to invites", value: "BUSY_OPEN" },
  { label: "Not available currently", value: "NOT_AVAILABLE" },
];

const workspaceOptions = [
  { label: "Dashboard", value: "DASHBOARD" },
  { label: "Deal Rooms", value: "DEAL_ROOMS" },
  { label: "Milestones", value: "MILESTONES" },
  { label: "Messages", value: "MESSAGES" },
  { label: "Wallet", value: "WALLET" },
  { label: "Settings", value: "SETTINGS" },
];

const currencyOptions = [
  { label: "INR - Indian Rupee", value: "INR" },
  { label: "USD - US Dollar", value: "USD" },
  { label: "EUR - Euro", value: "EUR" },
];

const languageOptions = [
  { label: "English", value: "EN" },
  { label: "Hindi", value: "HI" },
];

const timezoneOptions = ["Asia/Kolkata", "UTC", "America/New_York"];

const themeOptions = [
  { label: "Warm Premium", value: "WARM_PREMIUM" },
  { label: "Light Minimal", value: "LIGHT_MINIMAL" },
  { label: "Dark SaaS", value: "DARK_SAAS" },
];

const supportTypeOptions = [
  { label: "Project issue", value: "PROJECT" },
  { label: "Payment / wallet issue", value: "WALLET" },
  { label: "Submission issue", value: "SUBMISSION" },
  { label: "Account access issue", value: "ACCOUNT_ACCESS" },
  { label: "Other support request", value: "OTHER" },
];

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

function StatusBadge({ status }) {
  const styles = {
    OPEN: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
    IN_REVIEW: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    RESOLVED: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    CLOSED: "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
  };

  const value = status || "OPEN";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
        styles[value] || styles.OPEN
      }`}
    >
      {value.split("_").join(" ")}
    </span>
  );
}

function toLabel(value) {
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

  const [preferences, setPreferences] = useState(initialPreferences);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [supportForm, setSupportForm] = useState({
    type: "PROJECT",
    title: "",
    message: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  async function loadSettings() {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const response = await fetch("/api/freelancer/settings", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load settings.");
      }

      const data = result.data;

      setSettings(data);
      setAccountForm({
        name: data.account?.name || "",
        availability: data.freelancer?.availability || "AVAILABLE",
      });
      setPreferences({
        ...initialPreferences,
        ...(data.preferences || {}),
      });
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

  async function saveSettings() {
    try {
      setSavingSettings(true);
      setMessage({ type: "", text: "" });

      const response = await fetch("/api/freelancer/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          name: accountForm.name,
          availability: accountForm.availability,
          preferences,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save settings.");
      }

      const data = result.data;

      setSettings(data);
      setAccountForm({
        name: data.account?.name || "",
        availability: data.freelancer?.availability || "AVAILABLE",
      });
      setPreferences({
        ...initialPreferences,
        ...(data.preferences || {}),
      });

      setMessage({
        type: "success",
        text: "Settings saved successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Unable to save settings.",
      });
    } finally {
      setSavingSettings(false);
    }
  }

  async function updatePassword() {
    try {
      setSavingPassword(true);
      setMessage({ type: "", text: "" });

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

  async function createSupportTicket(payloadOverride) {
    try {
      setCreatingTicket(true);
      setMessage({ type: "", text: "" });

      const payload = payloadOverride || supportForm;

      const response = await fetch("/api/freelancer/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to create support ticket.");
      }

      setSettings(result.data);

      if (!payloadOverride) {
        setSupportForm({
          type: "PROJECT",
          title: "",
          message: "",
        });
      }

      setMessage({
        type: "success",
        text: payloadOverride
          ? "Account deletion request submitted."
          : "Support ticket created successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Unable to create support ticket.",
      });
    } finally {
      setCreatingTicket(false);
    }
  }

  function requestAccountDeletion() {
    createSupportTicket({
      type: "ACCOUNT_DELETION",
      title: "Account deletion request",
      message:
        "I want to request account deletion. Please review this request and guide me through the required confirmation process.",
    });
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
        value: toLabel(settings.account.role || "FREELANCER"),
        icon: UserRound,
      },
      {
        label: "Account",
        value: toLabel(settings.account.status || "ACTIVE"),
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
            Manage account preferences, notification settings, privacy,
            appearance, password, and support tickets from one workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={saveSettings}
          disabled={savingSettings}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          {savingSettings ? "Saving..." : "Save Settings"}
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
              Your account status, email verification, and role are fetched from
              the backend.
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
              Logout works directly. Account deletion is submitted as a support
              request for review.
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
                onClick={requestAccountDeletion}
                disabled={creatingTicket}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#fecaca] bg-[#fef2f2] text-sm font-black text-[#b91c1c] transition hover:bg-[#fee2e2] disabled:cursor-not-allowed disabled:opacity-60"
              >
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
                  These values are saved in the backend.
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
                  Default Workspace
                </span>

                <select
                  value={preferences.defaultWorkspace}
                  onChange={(event) =>
                    updatePreference("defaultWorkspace", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                >
                  {workspaceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                  Preferred Currency
                </span>

                <select
                  value={preferences.preferredCurrency}
                  onChange={(event) =>
                    updatePreference("preferredCurrency", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                >
                  {currencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Timezone
                </span>

                <select
                  value={preferences.timezone}
                  onChange={(event) =>
                    updatePreference("timezone", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                >
                  {timezoneOptions.map((timezone) => (
                    <option key={timezone} value={timezone}>
                      {timezone}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-black text-[#24130c]">
                  Language
                </span>

                <select
                  value={preferences.language}
                  onChange={(event) =>
                    updatePreference("language", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-[#fffaf3] px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
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
                  Saved to your user preference record.
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

            <div className="mt-5 rounded-2xl border border-[#fde68a] bg-[#fffbeb] p-4 text-sm font-bold text-[#92400e]">
              Two-factor authentication is intentionally not enabled yet. It
              needs a real OTP/authenticator backend.
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
                    Saved in user preferences.
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
                    Saved theme preference.
                  </p>
                </div>

                <Palette size={21} className="text-[#6f2e1c]" />
              </div>

              <div className="grid gap-3">
                {themeOptions.map((theme) => (
                  <button
                    type="button"
                    key={theme.value}
                    onClick={() => updatePreference("theme", theme.value)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                      preferences.theme === theme.value
                        ? "border-[#6f2e1c] bg-[#fff7ed]"
                        : "border-[#eadfd2] bg-[#fffaf3] hover:bg-white"
                    }`}
                  >
                    <span className="text-sm font-black text-[#24130c]">
                      {theme.label}
                    </span>

                    {preferences.theme === theme.value && (
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
                  Support tickets are saved in the backend.
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
                    value={supportForm.type}
                    onChange={(event) =>
                      setSupportForm((current) => ({
                        ...current,
                        type: event.target.value,
                      }))
                    }
                    className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
                  >
                    {supportTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-black text-[#24130c]">
                    Title
                  </span>

                  <input
                    type="text"
                    value={supportForm.title}
                    onChange={(event) =>
                      setSupportForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Short issue title"
                    className="mt-2 h-12 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 text-sm font-semibold text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-black text-[#24130c]">
                    Message
                  </span>

                  <textarea
                    rows={5}
                    value={supportForm.message}
                    onChange={(event) =>
                      setSupportForm((current) => ({
                        ...current,
                        message: event.target.value,
                      }))
                    }
                    placeholder="Explain the support issue clearly..."
                    className="mt-2 w-full resize-none rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#24130c] outline-none placeholder:text-[#b79d88] focus:border-[#6f2e1c]"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => createSupportTicket()}
                  disabled={creatingTicket}
                  className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6f2e1c] px-5 text-sm font-black text-white shadow-lg shadow-[#6f2e1c]/20 transition hover:bg-[#5b2416] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <HelpCircle size={17} />
                  {creatingTicket ? "Submitting..." : "Submit Support Request"}
                </button>
              </form>

              <div className="space-y-3">
                {(settings.supportTickets || []).map((ticket) => (
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
                      {toLabel(ticket.type)} • {ticket.createdAtDisplay}
                    </p>

                    <p className="mt-3 line-clamp-3 text-sm leading-5 text-[#7c6858]">
                      {ticket.message}
                    </p>
                  </div>
                ))}

                {(!settings.supportTickets ||
                  settings.supportTickets.length === 0) && (
                  <div className="rounded-[1.5rem] border border-dashed border-[#d7c3b2] bg-[#fffaf3] p-8 text-center">
                    <FileText size={24} className="mx-auto text-[#6f2e1c]" />

                    <h3 className="mt-4 text-lg font-black text-[#24130c]">
                      No support tickets yet
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#7c6858]">
                      Submit a support request and it will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}