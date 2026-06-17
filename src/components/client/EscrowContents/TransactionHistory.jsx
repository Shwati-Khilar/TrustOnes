"use client";

import { Search } from "lucide-react";

const transactions = [
  {
    id: "TXN-101",
    title: "Funds Released",
    project: "Backend API Integration",
    description: "Final milestone released",
    amount: "$8,500",
    date: "May 3, 2026",
    type: "released",
  },
  {
    id: "TXN-102",
    title: "Escrow Funded",
    project: "Data Dashboard & Analytics",
    description: "Initial escrow deposit",
    amount: "+ $4,500",
    date: "May 8, 2026",
    type: "funded",
  },
  {
    id: "TXN-103",
    title: "Milestone Released",
    project: "E-Commerce Platform Rebuild",
    description: "Milestone 3 released",
    amount: "$2,400",
    date: "May 20, 2026",
    type: "milestone",
  },
  {
    id: "TXN-104",
    title: "Dispute Opened",
    project: "Data Dashboard & Analytics",
    description: "Dispute opened by client",
    amount: "$4,500",
    date: "May 28, 2026",
    type: "dispute",
  },
  {
    id: "TXN-105",
    title: "Escrow Funded",
    project: "Mobile App MVP (iOS + Android)",
    description: "Project escrow funded",
    amount: "+ $11,000",
    date: "May 1, 2026",
    type: "funded",
  },
  {
    id: "TXN-106",
    title: "Milestone Released",
    project: "Mobile App MVP (iOS + Android)",
    description: "Milestones 1 & 2 released",
    amount: "$4,180",
    date: "May 22, 2026",
    type: "milestone",
  },
  {
    id: "TXN-107",
    title: "Escrow Funded",
    project: "Brand Identity & Logo Design",
    description: "Full project escrow",
    amount: "+ $3,500",
    date: "Apr 7, 2026",
    type: "funded",
  },
];

const iconColor = {
  funded: "bg-green-100 text-green-600",
  released: "bg-[#F7F3EE] text-[#B88746]",
  milestone: "bg-yellow-100 text-yellow-600",
  dispute: "bg-red-100 text-red-500",
};

const iconText = {
  funded: "↙",
  released: "↗",
  milestone: "◉",
  dispute: "⚠",
};

export default function TransactionHistory() {
  return (
    <div
      className="
      mt-6
      bg-white
      border
      border-[#E7DDD2]
      rounded-3xl
      p-5
    "
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#3D2414]">
            Transaction History
          </h2>

          <p className="text-xs text-[#B88746] mt-1">
            7 transactions
          </p>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-[#B88746]
          "
          />

          <input
            placeholder="Search transactions..."
            className="
w-64
rounded-xl
border
border-[#E7DDD2]
py-2.5
pl-10
pr-4
text-sm
"
          />
        </div>
      </div>

      <div className="mt-8">
        {transactions.map((tx, index) => (
          <div
            key={tx.id}
            className="relative flex justify-between py-3 text-sm"
          >
            {index !== transactions.length - 1 && (
              <div
                className="
                absolute
                left-5
                top-16
                h-full
                w-px
                bg-[#EFE5DB]
              "
              />
            )}

            <div className="flex gap-5">
              <div
                className={`
                  h-8
                  w-8
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  text-xs
                  font-bold
                  ${iconColor[tx.type]}
                `}
              >
                {iconText[tx.type]}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-[#3D2414]">
                    {tx.title}
                  </h3>

                  <span className="text-[#B88746] text-sm">
                    {tx.id}
                  </span>
                </div>

                <p className="text-sm text-[#B88746]">
                  {tx.project}
                </p>

                <p className="text-sm text-[#B88746]">
                  {tx.description}
                </p>
              </div>
            </div>

            <div className="text-right min-w-[140px]">
              <h3
                className={`font-bold text-lg ${
                  tx.amount.includes("+")
                    ? "text-green-600"
                    : "text-[#3D2414]"
                }`}
              >
                {tx.amount}
              </h3>

              <p className="text-xs text-[#B88746] mt-1">
                ◷ {tx.date}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="
        mt-4
        w-full
        rounded-2xl
        border
        border-[#E7DDD2]
        py-3
        text-sm
        font-medium
        text-[#8B5A2B]
        hover:bg-[#FAF6F1]
      "
      >
        Load more transactions ↗
      </button>
    </div>
  );
}