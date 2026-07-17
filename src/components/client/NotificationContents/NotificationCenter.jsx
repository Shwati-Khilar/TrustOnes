"use client";

import { useState } from "react";
import {
    Clock,
    Mail,
    IndianRupee,
    CalendarDays,
    MessageSquare,
    RefreshCw,
    ShieldAlert,
    Wallet,
    Star,
    ArrowUpRight,
} from "lucide-react";
import { notifications } from "./NotificationData";


const tabs = [
    "All",
    "Unread",
    "Invites",
    "Payments",
    "Deadlines",
    "Disputes",
    "Messages",
];

export default function NotificationCenter() {
    const [activeTab, setActiveTab] = useState("All");

    const filtered =
        activeTab === "All"
            ? notifications
            : notifications.filter(
                (n) =>
                    n.type.toLowerCase() ===
                    activeTab.toLowerCase().replace("s", "")
            );

    const colorStyles = {
        blue: {
            bg: "bg-blue-50",
            border: "border-blue-100",
            text: "text-blue-600",
            icon: Mail,
        },

        green: {
            bg: "bg-green-50",
            border: "border-green-100",
            text: "text-green-600",
            icon: IndianRupee,
        },

        yellow: {
            bg: "bg-yellow-50",
            border: "border-yellow-100",
            text: "text-yellow-600",
            icon: CalendarDays,
        },

        purple: {
            bg: "bg-purple-50",
            border: "border-purple-100",
            text: "text-purple-600",
            icon: MessageSquare,
        },

        orange: {
            bg: "bg-orange-50",
            border: "border-orange-100",
            text: "text-orange-600",
            icon: RefreshCw,
        },

        red: {
            bg: "bg-red-50",
            border: "border-red-100",
            text: "text-red-600",
            icon: ShieldAlert,
        },

        wallet: {
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            text: "text-emerald-600",
            icon: Wallet,
        },

        review: {
            bg: "bg-amber-50",
            border: "border-amber-100",
            text: "text-amber-600",
            icon: Star,
        },
    };
    
    return (
        <div className="bg-white rounded-3xl border border-[#E7DDD2] p-6">

            {/* Header */}

            <div className="flex items-start justify-between">

                <div>
                    <h2 className="text-2xl font-bold text-[#3D2414]">
                        Notification Center
                    </h2>

                    <p className="text-[#B88746] mt-1 text-sm">
                        Filter alerts by type
                    </p>
                </div>

            </div>

            {/* Tabs */}

            <div className="flex flex-wrap gap-3 mt-6">

                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
              px-3
              py-2
              rounded-full
              text-sm
              font-medium
              transition

              ${activeTab === tab
                                ? "bg-[#8B5A2B] text-white"
                                : "bg-white border border-[#E7DDD2] text-[#B88746]"
                            }
            `}
                    >
                        {tab}
                    </button>
                ))}

            </div>

            {/* Notifications */}

            <div className="mt-6 space-y-5">

                {filtered.map((item) => {

    const style = colorStyles[item.color];
    const Icon = style.icon;

    return (

                        <div
                            key={item.id}
                            className="
                border
                border-[#E7DDD2]
                rounded-xl
                p-4
                flex
                justify-between
                items-start
                hover:shadow-sm
                transition
              "
                        >

                            <div className="flex gap-5">

                                
                                <div
                                    className={`
    h-12
    w-12
    rounded-xl
    flex
    items-center
    justify-center
    border
    ${style.bg}
    ${style.border}
  `}
                                >
                                    <Icon
                                        size={22}
                                        className={style.text}
                                        strokeWidth={2}
                                    />
                                </div>

                                <div>

                                    {/* badges */}

                                    <div className="flex gap-2 mb-3">

                                        <span className="px-2 py-1 rounded-full bg-[#EEF5FF] text-[#4B7CE8] text-[11px] font-semibold">
                                            READ
                                        </span>

                                        <span
                                            className={`
                        px-2
                        py-1
                        rounded-full
                        text-[11px]
                        font-semibold

                        ${item.priority === "High"
                                                    ? "bg-red-100 text-red-600"
                                                    : item.priority === "Medium"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-green-100 text-green-700"
                                                }
                      `}
                                        >
                                            {item.priority.toUpperCase()}
                                        </span>

                                        <span className="text-[11px] tracking-wide uppercase text-[#8F6C53] font-semibold py-1">
                                            {item.type}
                                        </span>

                                    </div>

                                    <h3 className="text-lg font-semibold text-[#3D2414]">
                                        {item.title}
                                    </h3>

                                    <p className="text-[#B88746] mt-1">
                                        {item.project}
                                    </p>

                                    <p className="text-sm text-[#8F6C53] mt-2 leading-6 max-w-3xl">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center gap-2 mt-4 text-sm text-[#B88746]">

                                        <Clock size={14} />

                                        {item.time}

                                    </div>

                                </div>

                            </div>

                            <button
                                className="
                  px-3
                  py-2
                  rounded-xl
                  bg-[#8B5A2B]
                  text-white
                  font-medium
                  whitespace-nowrap
                "
                            >
                                <div className="flex items-center gap-2">
                                    {item.action}
                                    <ArrowUpRight size={15} />
                                </div> 
                            </button>

                        </div>

                    );

                })}

            </div>

        </div>
    );
}