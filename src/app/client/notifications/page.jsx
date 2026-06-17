export default function NotificationsPage() {

  const actions = [
    {
      title: "Review Proposal",
      description: "2 pending proposals waiting for review",
      type: "Action Required",
    },
    {
      title: "Fund Escrow",
      description: "Website redesign project requires escrow funding",
      type: "Action Required",
    },
    {
      title: "Approve Milestone",
      description: "Backend API milestone has been submitted",
      type: "Action Required",
    },
  ];

  const notifications = [
    {
      title: "New Message Received",
      description: "Priya Nair sent you a message",
      time: "2 hours ago",
    },
    {
      title: "Escrow Released",
      description: "₹8,000 released successfully",
      time: "Yesterday",
    },
    {
      title: "Project Created",
      description: "Mobile App MVP project created",
      time: "2 days ago",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F5F0] p-8">

      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold text-[#3D2414]">
          Notifications
        </h1>

        <p className="mt-2 text-[#B88746]">
          Manage alerts, updates and actions.
        </p>

        {/* Actions */}

        <div className="mt-8 rounded-3xl bg-white border border-[#E7DDD2] p-6">

          <h2 className="text-xl font-semibold text-[#3D2414]">
            Action Required
          </h2>

          <div className="mt-6 space-y-4">

            {actions.map((item) => (
              <div
                key={item.title}
                className="
                  flex items-center justify-between
                  rounded-2xl
                  border border-[#E7D37B]
                  bg-[#FFFDF5]
                  p-4
                "
              >
                <div>
                  <h3 className="font-medium text-[#3D2414]">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#B88746]">
                    {item.description}
                  </p>
                </div>

                <button className="rounded-xl bg-[#8B5A2B] px-4 py-2 text-white">
                  Open
                </button>

              </div>
            ))}

          </div>

        </div>

        {/* Notifications */}

        <div className="mt-8 rounded-3xl bg-white border border-[#E7DDD2] p-6">

          <h2 className="text-xl font-semibold text-[#3D2414]">
            Recent Notifications
          </h2>

          <div className="mt-6 space-y-4">

            {notifications.map((item) => (
              <div
                key={item.title}
                className="
                  rounded-2xl
                  border border-[#EFE5DB]
                  p-4
                "
              >
                <h3 className="font-medium text-[#3D2414]">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-[#B88746]">
                  {item.description}
                </p>

                <p className="mt-2 text-xs text-[#A38A74]">
                  {item.time}
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>

    </main>
  );
}