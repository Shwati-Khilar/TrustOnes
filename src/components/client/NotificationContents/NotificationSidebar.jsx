import {
  Shield,
  Mail,
  IndianRupee,
  CalendarDays,
  ShieldAlert,
  FolderKanban,
  ClipboardCheck,
  Wallet,
  Gavel,
  Filter,
  CheckCircle2,
} from "lucide-react";

export default function NotificationSidebar() {

    const alertTypes = [
  {
    title: "Project invites",
    desc: "Client invites and accept/reject actions.",
    icon: Mail,
    color: "blue",
  },
  {
    title: "Payment updates",
    desc: "Funding, release and wallet events.",
    icon: IndianRupee,
    color: "green",
  },
  {
    title: "Deadline reminders",
    desc: "Upcoming milestone and project due dates.",
    icon: CalendarDays,
    color: "yellow",
  },
  {
    title: "Dispute alerts",
    desc: "Admin review and evidence updates.",
    icon: ShieldAlert,
    color: "red",
  },
];

    const mappings = [
  {
    title: "ProjectInvitation",
    desc: "Creates invite notifications.",
    icon: FolderKanban,
  },
  {
    title: "Milestone",
    desc: "Creates deadline, funded and revision alerts.",
    icon: ClipboardCheck,
  },
  {
    title: "PaymentTransaction",
    desc: "Creates funding and wallet notifications.",
    icon: Wallet,
  },
  {
    title: "Dispute",
    desc: "Creates dispute status updates.",
    icon: Gavel,
  },
];

    return (

        <div className="space-y-6">

            {/* ACTION CARD */}

            <div
                className="
        rounded-3xl
        bg-gradient-to-br
        from-[#6D3E20]
        to-[#4C2414]
        text-white
        p-6
      "
            >

                <div
    className="
    h-12
    w-12
    rounded-xl
    bg-white/10
    flex
    items-center
    justify-center
    mb-5
"
>
    <Shield size={22} />
</div>

                <h2 className="text-2xl font-bold">
                    Action-first alerts.
                </h2>

                <p className="mt-4 text-white/70 leading-7 text-md">

                    Notifications should guide the client
                    to the next action quickly.

                </p>

                <ul className="mt-6 space-y-4">

    {[
        "Invites should be accepted quickly",
        "Funded milestones need submission",
        "Deadline reminders prevent delays",
        "Dispute updates need attention",
    ].map((text) => (

        <li
            key={text}
            className="flex items-center gap-3 text-sm"
        >
            <CheckCircle2
                size={15}
                className="text-[#F5C542]"
            />

            {text}
        </li>

    ))}

</ul>

            </div>

            {/* ALERT TYPES */}

            <div
                className="
        bg-white
        rounded-3xl
        border
        border-[#E7DDD2]
        p-6
      "
            >

                <div className="flex justify-between items-center">

    <h2 className="text-2xl font-bold text-[#3D2414]">
        Alert Types
    </h2>

    <Filter
        size={18}
        className="text-[#B88746]"
    />

</div>

                <div className="space-y-4 mt-6">

                    {alertTypes.map((item) => {

    const Icon = item.icon;

    const color =
        item.color === "blue"
            ? "bg-blue-50 text-blue-600 border-blue-100"
            : item.color === "green"
            ? "bg-green-50 text-green-600 border-green-100"
            : item.color === "yellow"
            ? "bg-yellow-50 text-yellow-600 border-yellow-100"
            : "bg-red-50 text-red-600 border-red-100";

    return (

        <div
            key={item.title}
            className="
            border
            border-[#E7DDD2]
            rounded-2xl
            p-4
            flex
            gap-4
        "
        >

            <div
                className={`
                h-11
                w-11
                rounded-xl
                border
                flex
                items-center
                justify-center
                ${color}
            `}
            >
                <Icon size={20} />
            </div>

            <div>

                <h4 className="font-semibold text-[#3D2414]">
                    {item.title}
                </h4>

                <p className="text-sm text-[#B88746] mt-1">
                    {item.desc}
                </p>

            </div>

        </div>

    );

})}

                </div>

            </div>

            {/* BACKEND */}

            <div
                className="
        bg-white
        rounded-3xl
        border
        border-[#E7DDD2]
        p-6
      "
            >

                <h2 className="text-2xl font-bold text-[#3D2414]">
                    Backend-ready Mapping
                </h2>

                <div className="space-y-5 mt-6">

                    {mappings.map((item) => {

    const Icon = item.icon;

    return (

        <div
            key={item.title}
            className="flex gap-4"
        >

            <div
                className="
                h-9
                w-9
                rounded-xl
                bg-[#FFF6EE]
                border
                border-[#F2DDC7]
                flex
                items-center
                justify-center
            "
            >
                <Icon
                    size={17}
                    className="text-[#8B5A2B]"
                />
            </div>

            <div>

                <h4 className="font-semibold text-[#3D2414]">
                    {item.title}
                </h4>

                <p className="text-sm text-[#B88746]">
                    {item.desc}
                </p>

            </div>

        </div>

    );

})}
                </div>

            </div>

        </div>

    );

}