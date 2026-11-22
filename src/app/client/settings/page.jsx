"use client";

import { ClientSupport, PasswordSettings } from "@/components/client/AccountSettingsForms";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Clock,
  Eye,
  Lock,
  LogOut,
  Mail,
  Shield,
  UserRound,
} from "lucide-react";

function SettingRow({ icon: Icon, title, subtitle, enabled, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#eadfd2] p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] text-[#7c341d]">
          <Icon size={17} />
        </span>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-black text-[#24130c]">
            {title}
          </h3>

          <p className="truncate text-xs font-semibold text-[#7c6858]">
            {subtitle}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={disabled}
        role="switch"
        aria-checked={enabled}
        aria-label={title}
        onClick={onChange}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled ? "bg-[#6f2e1c]" : "bg-[#d7c3b2]"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function SelectField({ title, value, onChange, options, disabled }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#806049]">
        {title}
      </label>

      <select
        disabled={disabled}
        aria-label={title}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-[#eadfd2] bg-white px-4 py-3 text-sm font-semibold text-[#24130c] outline-none focus:border-[#6f2e1c]"
      >
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { value: option, label: option }
              : option;

          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [escrowAlerts, setEscrowAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);

  const [defaultDashboard, setDefaultDashboard] = useState("DASHBOARD");
  const [language, setLanguage] = useState("EN");
  const [currency, setCurrency] = useState("INR");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const [savedPreferences, setSavedPreferences] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        const response = await fetch("/api/user/me", { cache: "no-store" });
        const result = await response.json();

        if (!ignore && response.ok && result?.user) {
          setUser(result.user);
        }

        if (!response.ok || !result?.preferences) throw new Error("Unable to load preferences. Reload to try again.");
        if (!ignore) {
          applyPreferences(result.preferences);
        }
      } catch (error) {
        if (!ignore) setSaveFeedback({ type: "error", message: error.message });
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, []);

  // Mirrors the saved record back into the form controls.
  function applyPreferences(preferences) {
    setEmailAlerts(preferences.emailNotifications);
    setPushAlerts(preferences.pushNotifications);
    setDeadlineAlerts(preferences.deadlineAlerts);
    setEscrowAlerts(preferences.paymentAlerts);
    setMessageAlerts(preferences.messageAlerts);
    setPublicProfile(preferences.profileVisible);
    setDefaultDashboard(preferences.defaultWorkspace);
    setLanguage(preferences.language);
    setCurrency(preferences.preferredCurrency);
    setTimezone(preferences.timezone);
    setSavedPreferences(preferences);
    setSaveFeedback({ type: "", message: "" });
  }

  const currentPreferences = {
    emailNotifications: emailAlerts,
    pushNotifications: pushAlerts,
    deadlineAlerts,
    paymentAlerts: escrowAlerts,
    messageAlerts,
    profileVisible: publicProfile,
    defaultWorkspace: defaultDashboard,
    language,
    preferredCurrency: currency,
    timezone,
  };

  const changedFields = savedPreferences
    ? Object.keys(currentPreferences).filter(
        (field) => currentPreferences[field] !== savedPreferences[field]
      )
    : [];

  const isDirty = changedFields.length > 0;

  // Only the changed keys are sent, so untouched preferences stay as stored.
  async function handleSavePreferences() {
    if (!isDirty || saving) return;

    const payload = {};

    for (const field of changedFields) {
      payload[field] = currentPreferences[field];
    }

    try {
      setSaving(true);
      setSaveFeedback({ type: "", message: "" });

      const response = await fetch("/api/user/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result?.preferences) {
        throw new Error(result?.message || "Unable to save settings.");
      }

      applyPreferences(result.preferences);
      setSaveFeedback({ type: "success", message: "Settings saved." });
    } catch (error) {
      console.error("CLIENT_SETTINGS_SAVE_ERROR", error);

      setSaveFeedback({
        type: "error",
        message: error.message || "Unable to save settings.",
      });
    } finally {
      setSaving(false);
    }
  }

  const initial = (user?.name || user?.email || "C").charAt(0).toUpperCase();

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await signOut({ redirect: false, callbackUrl: "/login" });

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("CLIENT_SETTINGS_LOGOUT_ERROR", error);
      setLoggingOut(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1480px] space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7c6858]">
          Settings
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#24130c]">
          Control your account and workspace
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7c6858]">
          Manage notifications, hiring preferences, and account security from
          one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.3fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#35170f] text-lg font-black text-[#f8d6a3]">
                {initial}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-black text-[#24130c]">
                  {user?.name || "Client account"}
                </h2>

                <p className="truncate text-sm font-semibold text-[#7c6858]">
                  {user?.email || "Loading email..."}
                </p>
              </div>
            </div>

            <Link
              href="/client/profile"
              className="mt-5 flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#eadfd2] bg-white text-sm font-black text-[#6f2e1c] transition hover:bg-[#fff7ed]"
            >
              <UserRound size={16} />
              View public profile
            </Link>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-gradient-to-br from-[#3a170e] to-[#7c341d] p-6 text-white shadow-xl shadow-[#7c341d]/20">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <Shield size={20} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              Account health is strong.
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/65">
              Your email is verified and your client account is active.
            </p>

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <Mail size={16} />
                  Email verified
                </span>

                <span className="font-black text-[#f8d6a3]">Active</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <UserRound size={16} />
                  Role
                </span>

                <span className="font-black text-[#f8d6a3]">Client</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <Lock size={16} />
                  Security
                </span>

                <span className="font-black text-[#f8d6a3]">Protected</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-[#fffaf3] p-6 shadow-sm">
            <h2 className="text-lg font-black text-[#24130c]">Session</h2>

            <p className="mt-1 text-sm font-semibold text-[#7c6858]">
              Sign out of this browser when you are done.
            </p>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-[#fff2f2] text-sm font-black text-[#b91c1c] transition hover:bg-[#ffe7e7] disabled:opacity-60"
            >
              <LogOut size={16} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-black text-[#24130c]">
              Quick settings
            </h2>

            <p className="mt-1 text-sm font-semibold text-[#7c6858]">
              Control the alerts and visibility you use most.
            </p>

            <div className="mt-5 space-y-3">
              <SettingRow
                disabled={!savedPreferences || saving}
                icon={Bell}
                title="Email notifications"
                subtitle="Receive important alerts"
                enabled={emailAlerts}
                onChange={() => setEmailAlerts((value) => !value)}
              />

              <SettingRow
                disabled={!savedPreferences || saving}
                icon={Clock}
                title="Deadline alerts"
                subtitle="Reminders before milestones are due"
                enabled={deadlineAlerts}
                onChange={() => setDeadlineAlerts((value) => !value)}
              />

              <SettingRow
                disabled={!savedPreferences || saving}
                icon={Eye}
                title="Public profile"
                subtitle="Visible to freelancers"
                enabled={publicProfile}
                onChange={() => setPublicProfile((value) => !value)}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-black text-[#24130c]">
              Account preferences
            </h2>

            <p className="mt-1 text-sm font-semibold text-[#7c6858]">
              Configure your client workspace defaults.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <SelectField
                disabled={!savedPreferences || saving}
                title="Default dashboard"
                value={defaultDashboard}
                onChange={setDefaultDashboard}
                options={[
                  { value: "DASHBOARD", label: "Dashboard" },
                  { value: "MESSAGES", label: "Messages" },
                  { value: "SETTINGS", label: "Settings" },
                ]}
              />

              <SelectField
                disabled={!savedPreferences || saving}
                title="Language"
                value={language}
                onChange={setLanguage}
                options={[
                  { value: "EN", label: "English" },
                  { value: "HI", label: "Hindi" },
                ]}
              />

              <SelectField
                disabled={!savedPreferences || saving}
                title="Currency"
                value={currency}
                onChange={setCurrency}
                options={["INR", "USD", "EUR"]}
              />

              <SelectField
                disabled={!savedPreferences || saving}
                title="Timezone"
                value={timezone}
                onChange={setTimezone}
                options={Array.from(
                  new Set(["Asia/Kolkata", "UTC", timezone])
                )}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-black text-[#24130c]">
              Notification preferences
            </h2>

            <p className="mt-1 text-sm font-semibold text-[#7c6858]">
              Choose which project events reach you.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SettingRow
                disabled={!savedPreferences || saving}
                icon={Bell}
                title="Push notifications"
                subtitle="Browser alerts"
                enabled={pushAlerts}
                onChange={() => setPushAlerts((value) => !value)}
              />

              <SettingRow
                disabled={!savedPreferences || saving}
                icon={Shield}
                title="Escrow alerts"
                subtitle="Funding and releases"
                enabled={escrowAlerts}
                onChange={() => setEscrowAlerts((value) => !value)}
              />

              <SettingRow
                disabled={!savedPreferences || saving}
                icon={Mail}
                title="Messages"
                subtitle="Freelancer replies"
                enabled={messageAlerts}
                onChange={() => setMessageAlerts((value) => !value)}
              />
            </div>

          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-[#eadfd2] bg-white/80 px-6 py-4 shadow-sm">
            <p
              className={`text-xs font-bold ${
                saveFeedback.type === "error"
                  ? "text-[#b91c1c]"
                  : saveFeedback.type === "success"
                    ? "text-[#047857]"
                    : "text-[#806049]"
              }`}
            >
              {saveFeedback.message ||
                (isDirty
                  ? "You have unsaved changes."
                  : savedPreferences ? "Preferences are saved to your account." : "Loading preferences...")}
            </p>

            <button
              type="button"
              onClick={handleSavePreferences}
              disabled={!isDirty || saving || !savedPreferences}
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#6f2e1c] px-5 text-sm font-black text-white transition hover:bg-[#5b2416] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
          {user && <PasswordSettings hasPassword={user.hasPassword} />}
          <ClientSupport />
        </div>
      </div>
    </div>
  );
}
