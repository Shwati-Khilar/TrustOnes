import { Save } from "lucide-react";

export default function SettingsHero() {
  return (
    <div className="flex justify-between items-start">

      <div>

        <p className="uppercase tracking-[3px] text-xs text-[#B88746] font-semibold">
          Settings
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[#3D2414]">
          Control your account, security,
          <br />
          and workspace preferences.
        </h1>

        <p className="mt-4 text-lg text-[#B88746] max-w-3xl">
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
        bg-[#8B5A2B]
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