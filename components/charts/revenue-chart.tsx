"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: { name: string; revenue: number }[];
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} barSize={36}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#262626"
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6b7280", fontSize: 12, fontFamily: "monospace" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6b7280", fontSize: 12, fontFamily: "monospace" }}
          tickFormatter={(v) => `₹${v / 1000}k`}
        />
        <Tooltip
          cursor={{ fill: "#111827" }}
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <div className="rounded-lg border border-gray-700 bg-black p-3 shadow-xl">
                <p className="text-xs font-mono text-gray-400 mb-1">
                  {label}
                </p>
                <p className="text-sm font-bold font-mono text-blue-400">
                  ₹{payload[0].value.toLocaleString()}
                </p>
              </div>
            ) : null
          }
        />
        <Bar
          dataKey="revenue"
          fill="#0494A8"
          radius={[4, 4, 0, 0]}
          className="fill-accent-blue opacity-80 hover:opacity-100 transition-opacity duration-300"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
