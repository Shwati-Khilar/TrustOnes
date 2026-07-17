export default function NotificationHero() {
  return (
    <div className="flex items-start justify-between mb-7">

      <div>

        <p className="uppercase tracking-[4px] text-xs text-[#B88746] font-semibold">
          Notifications
        </p>

        <h1 className="text-3xl font-bold text-[#3D2414] mt-2">
          Stay updated on invites, deadlines,
          payments, and disputes.
        </h1>

        <p className="mt-3 text-[#8F6C53] max-w-3xl">
          Track all important client activity from one
          notification center.
        </p>

      </div>

      <button
        className="
        px-3
        py-2
        rounded-xl
        bg-[#8B5A2B]
        text-white
        font-medium
      "
      >
        ✓ Mark all as read
      </button>

    </div>
  );
}