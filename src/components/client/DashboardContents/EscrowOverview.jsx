"use client";

import { PieChart, Pie, Cell } from "recharts";
import { ShieldCheck } from "lucide-react";

const data = [
  {
    name: "Released",
    value: 24000,
    color: "#8B5A2B",
  },
  {
    name: "Locked",
    value: 16000,
    color: "#D0A15E",
  },
  {
    name: "Pending",
    value: 6000,
    color: "#F4B61A",
  },
  {
    name: "Disputed",
    value: 2000,
    color: "#EF4444",
  },
];

const total = data.reduce(
  (sum, item) => sum + item.value,
  0
);

export default function EscrowOverview() {
  return (
    <div className="rounded-3xl border border-[#eadfd2] bg-white p-6">

      <div className="flex items-start justify-between">

        <div>
          <h2 className="text-xl font-semibold text-[#24130c]">
            Escrow Overview
          </h2>

          <p className="mt-1 text-sm text-[#806049]">
            All active escrows
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7efe4]">
          <ShieldCheck size={20} className="text-[#6f2e1c]" />
        </div>

      </div>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">

        {/* Donut Chart */}

        <div className="relative h-[160px] w-[160px] flex-shrink-0">

          <PieChart width={160} height={160}>

            <Pie
              data={data}
              dataKey="value"
              innerRadius={38}
              outerRadius={60}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                />
              ))}
            </Pie>

          </PieChart>

          {/* Center Content */}

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-xs font-medium uppercase tracking-wide text-[#806049]">
              Total
            </span>

            <span className="text-2xl font-bold text-[#674530]">
              ₹48K
            </span>

          </div>

        </div>

        {/* Legend */}

        <div className="w-full min-w-0 flex-1 space-y-3">

          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-2.5">

                <div
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span className="truncate text-sm text-[#6f5a4c]">
                  {item.name}
                </span>

              </div>

              <span className="flex-shrink-0 text-sm font-semibold text-[#24130c]">
                ₹{item.value / 1000}K
              </span>

            </div>
          ))}

        </div>

      </div>

      <div className="my-6 border-t border-[#EFE5DB]" />

      <div className="space-y-3 text-sm">

        <div className="flex items-center justify-between gap-3">
          <span className="text-[#7A7068]">Total Funded</span>
          <span className="font-semibold text-[#24130c]">₹48,000</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[#7A7068]">Released</span>
          <span className="font-medium text-[#24130c]">₹24,000</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[#7A7068]">Locked</span>
          <span className="font-medium text-[#24130c]">₹16,000</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[#7A7068]">Disputed</span>
          <span className="font-medium text-[#24130c]">₹2,000</span>
        </div>

      </div>

    </div>
  );
}