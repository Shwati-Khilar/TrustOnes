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
    <div className="rounded-3xl border border-[#eadfd2] bg-white p-6">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold text-[#24130c]">
            Action Required
          </h2>

          <p className="mt-1 text-sm text-[#806049]">
            {actions.length} items need your attention
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">

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
        text-[#806049]
      "
          >
            Urgent
          </span>

          <Link
            href="/client/notifications"
            className="
        text-[#6f2e1c]
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
              <div className="flex min-w-0 items-center gap-4">

                <div className="
                  flex h-11 w-11 items-center justify-center
                  rounded-2xl
                  bg-[#f7efe4]
                ">
                  <Icon
                    size={18}
                    className="text-[#6f2e1c]"
                  />
                </div>

                <div>

                  <h3 className="font-medium text-[#24130c] text-base">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#806049]">
                    {item.subtitle}
                  </p>

                </div>

              </div>

              <button
                className={`
                  shrink-0
                  rounded-xl
                  px-3 py-2
                  text-sm
                  font-medium
                  ${item.highlight
                    ? "bg-[#6f2e1c] text-white"
                    : "bg-[#f7efe4] text-[#6f2e1c]"
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