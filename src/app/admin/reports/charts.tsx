"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barSize={40}>
        <XAxis
          dataKey="month"
          tick={{ fill: "#64748B", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#64748B", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0F1D32",
            border: "1px solid #1E3A5F",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
        />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
        </defs>
        <Bar dataKey="revenue" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface CategoryChartProps {
  data: { category: string; percentage: number }[];
}

const categoryColors: Record<string, string> = {
  Spirits: "#F59E0B",
  Champagne: "#0EA5E9",
  Wine: "#2DD4BF",
  Beer: "#64748B",
};

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.category}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sip-text-secondary text-sm">{item.category}</span>
            <span className="text-white text-sm font-medium">{item.percentage}%</span>
          </div>
          <div className="w-full h-2 bg-sip-bg-secondary rounded-full">
            <div
              className="h-full rounded-full"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: categoryColors[item.category] || "#F59E0B",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
