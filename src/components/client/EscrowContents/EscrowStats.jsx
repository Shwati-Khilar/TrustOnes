import {
  Wallet,
  Unlock,
  Lock,
  AlertTriangle,
} from "lucide-react";

const stats = [
  {
    title: "Total Funded",
    value: "$39,500",
    icon: Wallet,
  },
  {
    title: "Released",
    value: "$24,645",
    icon: Unlock,
  },
  {
    title: "Locked",
    value: "$10,180",
    icon: Lock,
  },
  {
    title: "Under Dispute",
    value: "$4,500",
    icon: AlertTriangle,
  },
];

export default function EscrowStats() {
  return (
    <div className="grid grid-cols-4 gap-5 mt-6">

      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="
            bg-white
            rounded-3xl
            border
            border-[#E7DDD2]
            p-6
          "
          >
            <Icon
              size={24}
              className="text-[#8B5A2B]"
            />

            <h2 className="mt-4 text-2xl font-bold">
              {item.value}
            </h2>

            <p className="text-[#B88746] mt-2 text-sm">
              {item.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}