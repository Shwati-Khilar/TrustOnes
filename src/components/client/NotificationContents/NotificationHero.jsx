export default function NotificationHero() {
  return (
    <div className="flex items-start justify-between mb-7">

      <div>

        <p className="uppercase tracking-[4px] text-xs text-[#806049] font-semibold">
          Notifications
        </p>

        <h1 className="text-3xl font-bold text-[#24130c] mt-2">
          Stay updated on invites, deadlines,
          payments, and disputes.
        </h1>

        <p className="mt-3 text-[#7c6858] max-w-3xl">
          Track all important client activity from one
          notification center.
        </p>

      </div>

      <button
        className="
        px-3
        py-2
        rounded-xl
        bg-[#6f2e1c]
        text-white
        font-medium
      "
      >
        ✓ Mark all as read
      </button>

    </div>
  );
}