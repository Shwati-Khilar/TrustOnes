import {
  FileText,
  CheckCircle,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    icon: FileText,
    title: "Review Proposal",
    subtitle: "2 pending proposals",
    button: "Review",
    highlight: true,
  },
  {
    icon: CheckCircle,
    title: "Approve Milestone",
    subtitle: "Final delivery ready",
    button: "Approve",
  },
  {
    icon: DollarSign,
    title: "Fund Escrow",
    subtitle: "Awaiting escrow deposit",
    button: "Fund",
    highlight: true,
  },
  {
    icon: MessageSquare,
    title: "Respond to Freelancer",
    subtitle: "New message received",
    button: "Reply",
  },
];

export default function ActionRequired() {
  return (
    <div className="rounded-3xl border border-[#E7DDD2] bg-white p-6">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold text-[#3D2414]">
            Action Required
          </h2>

          <p className="mt-1 text-sm text-[#B88746]">
            3 items need your attention
          </p>
        </div>

        <div className="flex items-center gap-3">

          <span
            className="
        rounded-full
        border
        border-[#E7D37B]
        bg-[#FFFDF5]
        px-3
        py-1
        text-sm
        font-medium
        text-[#B88746]
      "
          >
            Urgent
          </span>

          <Link
            href="/client/notifications"
            className="
        text-[#8B5A2B]
        font-medium
        hover:text-[#6D4325] text-sm
      "
          >
            View All →
          </Link>

        </div>

      </div>

      <div className="mt-8 space-y-4">

        {actions.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`
                flex items-center justify-between
                rounded-2xl
                border
                p-4
                ${item.highlight
                  ? "border-[#E7D37B] bg-[#FFFDF5]"
                  : "border-[#EFE5DB]"
                }
              `}
            >
              <div className="flex items-center gap-4">

                <div className="
                  flex h-11 w-11 items-center justify-center
                  rounded-2xl
                  bg-[#F7F3EE]
                ">
                  <Icon
                    size={18}
                    className="text-[#8B5A2B]"
                  />
                </div>

                <div>

                  <h3 className="font-medium text-[#3D2414] text-md">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#B88746]">
                    {item.subtitle}
                  </p>

                </div>

              </div>

              <button
                className={`
                  rounded-xl
                  px-3 py-2
                  text-sm
                  font-medium
                  ${item.highlight
                    ? "bg-[#8B5A2B] text-white"
                    : "bg-[#F7F3EE] text-[#8B5A2B]"
                  }
                `}
              >
                {item.button}
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
}