import {
  Plus,
  FileText,
  UserCheck,
  CheckCircle,
  DollarSign,
} from "lucide-react";

const activities = [
  {
    icon: Plus,
    color: "bg-blue-100 text-blue-600",
    title: 'Project "E-Commerce Platform Rebuild" was created',
    time: "2 hours ago",
  },
  {
    icon: FileText,
    color: "bg-yellow-100 text-yellow-600",
    title: 'New proposal received for "Mobile App MVP"',
    time: "5 hours ago",
  },
  {
    icon: UserCheck,
    color: "bg-green-100 text-green-600",
    title: 'Ada Chen was hired for "E-Commerce Platform Rebuild"',
    time: "Yesterday",
  },
  {
    icon: CheckCircle,
    color: "bg-stone-100 text-[#8B5A2B]",
    title: 'Milestone approved for "Backend API"',
    time: "Yesterday",
  },
  {
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
    title: 'Escrow funded — ₹4,200',
    time: "2 days ago",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-3xl border border-[#E7DDD2] bg-white p-6">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold text-[#3D2414]">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-[#B88746]">
            Latest platform events
          </p>
        </div>

        <span className="text-[#B88746] text-xl">
          📈
        </span>

      </div>

      <div className="mt-8 space-y-6">

        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div
              key={index}
              className="flex gap-4"
            >
              <div
                className={`
                  flex h-10 w-10 items-center justify-center
                  rounded-2xl
                  ${activity.color}
                `}
              >
                <Icon size={18} />
              </div>

              <div>

                <p className="text-[#3D2414] text-sm">
                  {activity.title}
                </p>

                <p className="mt-1 text-sm text-[#B88746]">
                  {activity.time}
                </p>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}