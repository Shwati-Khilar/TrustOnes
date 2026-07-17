import {
    ShieldAlert,
    Clock3,
    CheckCircle2,
    XCircle,
} from "lucide-react";

const stats = [
    {
        title: "Open",
        value: "3",
        icon: ShieldAlert,
        color: "text-red-500",
    },
    {
        title: "Under Review",
        value: "2",
        icon: Clock3,
        color: "text-yellow-500",
    },
    {
        title: "Resolved",
        value: "9",
        icon: CheckCircle2,
        color: "text-green-500",
    },
    {
        title: "Cancelled",
        value: "1",
        icon: XCircle,
        color: "text-gray-500",
    },
];

export default function DisputeStats() {
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
                            className={`${item.color}`}
                            size={28}
                        />

                        <h2 className="text-3xl font-bold mt-4">
                            {item.value}
                        </h2>

                        <p className="text-[#B88746] mt-1 text-sm">
                            {item.title}
                        </p>
                    </div>
                );
            })}

        </div>
    );
}