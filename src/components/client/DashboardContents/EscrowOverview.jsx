"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

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
    <div className="rounded-3xl border border-[#E7DDD2] bg-white p-6">

      <div className="flex items-start justify-between">

        <div>
          <h2 className="text-xl font-semibold text-[#3D2414]">
            Escrow Overview
          </h2>

          <p className="mt-1 text-sm text-[#B88746]">
            All active escrows
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F3EE] text-xl">
          🛡️
        </div>

      </div>

      <div className="mt-6 flex items-center gap-6">

        {/* Donut Chart */}

        <div className="relative h-[180px] w-[180px] flex-shrink-0">

          <ResponsiveContainer
            width={180}
            height={180}
          >
            <PieChart>

              <Pie
                data={data}
                dataKey="value"
                innerRadius={42}
                outerRadius={68}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                  />
                ))}
              </Pie>

            </PieChart>
          </ResponsiveContainer>

          {/* Center Content */}

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-md text-[#141313]">
              Total
            </span>

            <span className="text-2xl font-bold text-[#674530]">
              ₹48K
            </span>

          </div>

        </div>

        {/* Legend */}

        <div className="flex-1 space-y-4">

          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">

                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span className="text-[#7A4A28]">
                  {item.name}
                </span>

              </div>

              <span className="font-medium text-[#3D2414]">
                ₹{item.value / 1000}K
              </span>

            </div>
          ))}

        </div>

      </div>

      <div className="my-6 border-t border-[#EFE5DB]" />

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Total Funded</span>
          <span>₹48,000</span>
        </div>

        <div className="flex justify-between">
          <span>Released</span>
          <span>₹24,000</span>
        </div>

        <div className="flex justify-between">
          <span>Locked</span>
          <span>₹16,000</span>
        </div>

        <div className="flex justify-between">
          <span>Disputed</span>
          <span>₹2,000</span>
        </div>

      </div>

    </div>
  );
}