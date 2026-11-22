import { Save } from "lucide-react";

export default function SettingsHero() {
  return (
    <div className="flex justify-between items-start">

      <div>

        <p className="uppercase tracking-[3px] text-xs text-[#806049] font-semibold">
          Settings
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[#24130c]">
          Control your account, security,
          <br />
          and workspace preferences.
        </h1>

        <p className="mt-4 text-lg text-[#806049] max-w-3xl">
          Manage notifications, password, privacy,
          support requests and account preferences
          from one place.
        </p>

      </div>

      <button
        className="
        flex
        items-center
        gap-2
        rounded-2xl
        bg-[#6f2e1c]
        px-6
        py-4
        text-white
        font-medium
      "
      >
        <Save size={18} />
        Save Settings
      </button>

    </div>
  );
}