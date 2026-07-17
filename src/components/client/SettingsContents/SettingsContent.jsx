"use client";

import { useState } from "react";


import {
  Shield,
  Mail,
  User,
  Lock,
  Bell,
  Clock,
  Eye,
  LogOut,
  Trash2,
} from "lucide-react";

export default function SettingsContent() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  return (
    <div className="grid grid-cols-[0.9fr_1.3fr] gap-6 mt-8">

      {/* ================= LEFT ================= */}

      <div className="space-y-6">

        {/* Account Health */}

        <div
          className="
          rounded-2xl
          bg-gradient-to-br
          from-[#6F3D1C]
          to-[#3D2414]
          p-7
          text-white
        "
        >

          <div
            className="
            h-12
            w-12
            rounded-xl
            bg-white/10
            flex
            items-center
            justify-center
          "
          >
            <Shield size={22} />
          </div>

          <h2 className="mt-6 text-3xl font-bold">
            Account health is strong.
          </h2>

          <p className="mt-3 text-white/80 leading-7">
            Your client account is verified,
            escrow is enabled and you're ready
            to hire freelancers securely.
          </p>

          <div className="mt-8 space-y-3">

            <div className="bg-white/10 rounded-xl p-4 flex justify-between">
              <div className="flex gap-3 items-center">
                <Mail size={18} />
                Email Verified
              </div>

              <span className="font-semibold">
                Active
              </span>
            </div>

            <div className="bg-white/10 rounded-xl p-4 flex justify-between">
              <div className="flex gap-3 items-center">
                <User size={18} />
                Client Role
              </div>

              <span className="font-semibold">
                Client
              </span>
            </div>

            <div className="bg-white/10 rounded-xl p-4 flex justify-between">
              <div className="flex gap-3 items-center">
                <Lock size={18} />
                Security
              </div>

              <span className="font-semibold">
                Protected
              </span>
            </div>

          </div>

        </div>

        {/* Quick Settings */}

        <div
          className="
          rounded-2xl
          border
          border-[#E7DDD2]
          bg-white
          p-6
        "
        >

          <h2 className="text-2xl font-bold text-[#3D2414]">
            Quick Settings
          </h2>

          <div className="space-y-4 mt-6">

            <SettingRow
              icon={<Bell size={18} />}
              title="Email Notifications"
              subtitle="Receive important alerts."
              enabled={emailAlerts}
              onChange={() =>
                setEmailAlerts(!emailAlerts)
              }
            />

            <SettingRow
              icon={<Clock size={18} />}
              title="Deadline Alerts"
              subtitle="Reminders before deadlines."
              enabled={deadlineAlerts}
              onChange={() =>
                setDeadlineAlerts(!deadlineAlerts)
              }
            />

            <SettingRow
              icon={<Eye size={18} />}
              title="Public Profile"
              subtitle="Visible to freelancers."
              enabled={publicProfile}
              onChange={() =>
                setPublicProfile(!publicProfile)
              }
            />

          </div>

        </div>

        {/* Danger Zone */}

        <div
          className="
          rounded-2xl
          border
          border-red-200
          bg-[#FFF8F8]
          p-6
        "
        >

          <h2 className="text-2xl font-bold text-[#3D2414]">
            Danger Zone
          </h2>

          <p className="mt-3 text-[#B88746] leading-7">
            These actions are permanent.
            Proceed carefully.
          </p>

          <button
            className="
            mt-6
            w-full
            rounded-2xl
            border
            border-[#E7DDD2]
            py-4
            font-medium
            flex
            items-center
            justify-center
            gap-2
            hover:bg-[#F7F3EE]
          "
          >
            <LogOut size={18} />
            Logout
          </button>

          <button
            className="
            mt-4
            w-full
            rounded-2xl
            border
            border-red-200
            bg-[#FFF2F2]
            py-4
            text-red-500
            font-medium
            flex
            items-center
            justify-center
            gap-2
          "
          >
            <Trash2 size={18} />
            Delete Account
          </button>

        </div>

      </div>

      {/* ================= RIGHT ================= */}

      <div>

        <div className="space-y-6">

  {/* ================= ACCOUNT PREFERENCES ================= */}

  <div
    className="
    rounded-2xl
    border
    border-[#E7DDD2]
    bg-white
    p-6
  "
  >
    <h2 className="text-2xl font-bold text-[#3D2414]">
      Account Preferences
    </h2>

    <p className="text-[#B88746] mt-1">
      Configure your client workspace.
    </p>

    <div className="grid grid-cols-2 gap-5 mt-6">

      <InputSelect
        title="Default Dashboard"
        options={[
          "Projects",
          "Escrow",
          "Applications",
        ]}
      />

      <InputSelect
        title="Availability"
        options={[
          "Hiring",
          "Busy",
          "Away",
        ]}
      />

      <InputSelect
        title="Currency"
        options={[
          "INR",
          "USD",
          "EUR",
        ]}
      />

      <InputSelect
        title="Timezone"
        options={[
          "Asia/Kolkata",
          "UTC",
        ]}
      />

    </div>

  </div>

  {/* ================= NOTIFICATIONS ================= */}

  <div
    className="
    rounded-2xl
    border
    border-[#E7DDD2]
    bg-white
    p-6
  "
  >

    <h2 className="text-2xl font-bold text-[#3D2414]">
      Notification Preferences
    </h2>

    <p className="text-[#B88746] mt-1">
      Choose which alerts you receive.
    </p>

    <div className="grid grid-cols-2 gap-4 mt-6">

      <SettingRow
        icon={<Bell size={18} />}
        title="Push Notifications"
        subtitle="Browser alerts"
        enabled={true}
        onChange={() => {}}
      />

      <SettingRow
        icon={<Bell size={18} />}
        title="Escrow Alerts"
        subtitle="Funding & releases"
        enabled={true}
        onChange={() => {}}
      />

      <SettingRow
        icon={<Mail size={18} />}
        title="Messages"
        subtitle="Freelancer messages"
        enabled={true}
        onChange={() => {}}
      />

      <SettingRow
        icon={<Shield size={18} />}
        title="Security Alerts"
        subtitle="Important security events"
        enabled={true}
        onChange={() => {}}
      />

    </div>

  </div>

  {/* ================= SECURITY ================= */}

  <div
    className="
    rounded-2xl
    border
    border-[#E7DDD2]
    bg-white
    p-6
  "
  >

    <h2 className="text-2xl font-bold text-[#3D2414]">
      Security Settings
    </h2>

    <p className="text-[#B88746] mt-1">
      Manage your password and account security.
    </p>

    <div className="grid grid-cols-2 gap-5 mt-6">

      <InputField
        title="Current Password"
        placeholder="Enter current password"
      />

      <InputField
        title="New Password"
        placeholder="Enter new password"
      />

    </div>

    <div
      className="
      mt-5
      border
      border-[#E7DDD2]
      rounded-2xl
      p-5
      flex
      justify-between
      items-center
    "
    >

      <div>

        <h3 className="font-semibold text-[#3D2414]">
          Two-Factor Authentication
        </h3>

        <p className="text-sm text-[#B88746] mt-1">
          Secure your account using OTP verification.
        </p>

      </div>

      <button
        className="
        w-12
        h-7
        rounded-full
        bg-gray-300
        relative
      "
      >
        <span
          className="
          absolute
          left-1
          top-1
          h-5
          w-5
          rounded-full
          bg-white
        "
        />
      </button>

    </div>

    <button
      className="
      mt-6
      rounded-2xl
      bg-[#8B5A2B]
      px-6
      py-3
      text-white
      font-medium
    "
    >
      Update Password
    </button>

  </div>

  {/* ================= PRIVACY + APPEARANCE ================= */}

<div className="grid grid-cols-2 gap-6">

  {/* Privacy */}

  <div
    className="
    rounded-3xl
    border
    border-[#E7DDD2]
    bg-white
    p-6
  "
  >

    <h2 className="text-2xl font-bold text-[#3D2414]">
      Privacy
    </h2>

    <p className="text-[#B88746] mt-1">
      Control your visibility.
    </p>

    <div className="mt-6 space-y-4">

      <SettingRow
        icon={<Eye size={18} />}
        title="Public Profile"
        subtitle="Visible to freelancers"
        enabled={true}
        onChange={() => {}}
      />

      <SettingRow
        icon={<User size={18} />}
        title="Show Activity"
        subtitle="Display recent projects"
        enabled={false}
        onChange={() => {}}
      />

    </div>

  </div>

  {/* Appearance */}

  <div
    className="
    rounded-3xl
    border
    border-[#E7DDD2]
    bg-white
    p-6
  "
  >

    <h2 className="text-2xl font-bold text-[#3D2414]">
      Appearance
    </h2>

    <p className="text-[#B88746] mt-1">
      Personalize your workspace.
    </p>

    <div className="mt-6 space-y-3">

      <button className="w-full rounded-2xl bg-[#8B5A2B] text-white py-3 font-medium">
        Warm Premium
      </button>

      <button className="w-full rounded-2xl border border-[#E7DDD2] py-3 text-[#8B5A2B]">
        Light
      </button>

      <button className="w-full rounded-2xl border border-[#E7DDD2] py-3 text-[#8B5A2B]">
        Dark
      </button>

    </div>

  </div>

</div>

{/* ================= SUPPORT CENTER ================= */}

<div
  className="
  rounded-2xl
  border
  border-[#E7DDD2]
  bg-white
  p-6
"
>

  <div className="flex justify-between items-center">

    <div>

      <h2 className="text-2xl font-bold text-[#3D2414]">
        Support Center
      </h2>

      <p className="text-[#B88746] mt-1">
        Need help? Contact our support team.
      </p>

    </div>

    <span
      className="
      px-4
      py-2
      rounded-full
      bg-[#FFF7E7]
      text-[#C58A1D]
      text-sm
      font-medium
    "
    >
      2 Open Tickets
    </span>

  </div>

  <div className="grid grid-cols-[1.2fr_0.8fr] gap-6 mt-6">

    {/* Left */}

    <div>

      <InputSelect
        title="Issue Type"
        options={[
          "Escrow",
          "Payments",
          "Projects",
          "Security",
        ]}
      />

      <div className="mt-5">

        <label className="text-sm font-medium text-[#3D2414]">
          Message
        </label>

        <textarea
          rows={5}
          placeholder="Describe your issue..."
          className="
          mt-2
          w-full
          rounded-2xl
          border
          border-[#E7DDD2]
          p-4
          outline-none
          resize-none
          focus:border-[#8B5A2B]
        "
        />

      </div>

      <button
        className="
        mt-5
        rounded-2xl
        bg-[#8B5A2B]
        px-6
        py-3
        text-white
        font-medium
      "
      >
        Submit Ticket
      </button>

    </div>

    {/* Right */}

    <div>

      <div
        className="
        rounded-2xl
        border
        border-[#E7DDD2]
        p-4
      "
      >

        <div className="flex justify-between">

          <div>

            <h3 className="font-semibold text-[#3D2414]">
              Escrow Payment Issue
            </h3>

            <p className="text-sm text-[#B88746]">
              Opened yesterday
            </p>

          </div>

          <span
            className="
            px-3
            py-1
            rounded-full
            bg-[#FFF7E7]
            text-[#C58A1D]
            text-sm
          "
          >
            Open
          </span>

        </div>

      </div>

      <div
        className="
        rounded-2xl
        border
        border-[#E7DDD2]
        p-4
        mt-4
      "
      >

        <div className="flex justify-between">

          <div>

            <h3 className="font-semibold text-[#3D2414]">
              Unable to Upload Contract
            </h3>

            <p className="text-sm text-[#B88746]">
              Resolved
            </p>

          </div>

          <span
            className="
            px-3
            py-1
            rounded-full
            bg-[#EAF8EE]
            text-green-600
            text-sm
          "
          >
            Closed
          </span>

        </div>

      </div>

    </div>

  </div>

</div>

</div>

      </div>

    </div>
  );
}

/* ----------------------------- */

function SettingRow({
  icon,
  title,
  subtitle,
  enabled,
  onChange,
}) {
  return (
    <div
      className="
      border
      border-[#E7DDD2]
      rounded-2xl
      p-4
      flex
      justify-between
      items-center
    "
    >
      <div className="flex gap-4">

        <div
          className="
          h-10
          w-10
          rounded-xl
          bg-[#F7F3EE]
          flex
          items-center
          justify-center
          text-[#8B5A2B]
        "
        >
          {icon}
        </div>

        <div>

          <h3 className="font-semibold text-[#3D2414]">
            {title}
          </h3>

          <p className="text-sm text-[#B88746]">
            {subtitle}
          </p>

        </div>

      </div>

      <button
        onClick={onChange}
        className={`
          w-12
          h-7
          rounded-full
          transition
          relative

          ${
            enabled
              ? "bg-[#8B5A2B]"
              : "bg-gray-300"
          }
        `}
      >
        <span
          className={`
            absolute
            top-1
            h-5
            w-5
            rounded-full
            bg-white
            transition

            ${
              enabled
                ? "left-6"
                : "left-1"
            }
          `}
        />
      </button>
    </div>
  );
}
function InputField({
  title,
  placeholder,
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[#3D2414]">
        {title}
      </label>

      <input
        type="password"
        placeholder={placeholder}
        className="
          mt-2
          w-full
          rounded-2xl
          border
          border-[#E7DDD2]
          px-4
          py-3
          outline-none
          focus:border-[#8B5A2B]
        "
      />
    </div>
  );
}
function InputSelect({
  title,
  options,
}) {
  return (
    <div>

      <label className="text-sm font-medium text-[#3D2414]">
        {title}
      </label>

      <select
        className="
          mt-2
          w-full
          rounded-2xl
          border
          border-[#E7DDD2]
          px-4
          py-3
          outline-none
          focus:border-[#8B5A2B]
        "
      >
        {options.map((option) => (
          <option key={option}>
            {option}
          </option>
        ))}
      </select>

    </div>
  );
}