"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface PieChartProps {
  data: { name: string; value: number }[];
  colors: string[];
}

const CustomPieChart = ({ data, colors }: PieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) =>
            active && payload && payload.length > 0 ? (
              <div className="rounded-lg border border-gray-700 bg-black p-3 shadow-xl">
                <p className="text-xs font-mono text-gray-400">
                  {payload[0].name}
                </p>
                <p className="text-sm font-bold font-mono text-blue-400">
                  {payload[0]?.value?.toLocaleString()}
                </p>
              </div>
            ) : null
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;