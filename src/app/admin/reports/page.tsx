"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, TrendingUp, Users, Download } from "lucide-react";
import { formatCompactCurrency, formatCurrency, getInitials } from "@/lib/utils";
import { RevenueChart, CategoryChart } from "./charts";

interface ReportData {
  totalRevenue: number;
  ordersCompleted: number;
  avgOrderValue: number;
  activeClients: number;
  monthlyRevenue: { month: string; revenue: number }[];
  topClients: { name: string; revenue: number; avatarColor: string }[];
  salesByCategory: { category: string; percentage: number }[];
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return <div className="p-8"><p className="text-sip-text-muted">Loading reports...</p></div>;
  }

  const stats = [
    { label: "Total Revenue", value: formatCompactCurrency(data.totalRevenue), trend: "+8.2%", icon: DollarSign, color: "text-sip-amber" },
    { label: "Orders Completed", value: data.ordersCompleted.toLocaleString(), trend: "+12%", icon: ShoppingCart, color: "text-sip-blue" },
    { label: "Avg. Order Value", value: formatCompactCurrency(data.avgOrderValue), trend: "+3.4%", icon: TrendingUp, color: "text-sip-teal" },
    { label: "Active Clients", value: data.activeClients.toString(), icon: Users, color: "text-white" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-sip-text-muted text-sm mt-1">Revenue insights and performance metrics across the archipelago</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sip-text-secondary text-sm">Apr 1 - Apr 12, 2025</span>
          <button className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-sip-card border border-sip-border-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sip-text-muted text-xs uppercase tracking-wide">{stat.label}</p>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            {stat.trend && <p className="text-emerald-400 text-xs mt-1">{stat.trend}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="col-span-2 bg-sip-card border border-sip-border-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold">Monthly Revenue</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded text-xs bg-sip-amber text-sip-bg-primary font-medium">Monthly</button>
              <button className="px-3 py-1 rounded text-xs text-sip-text-secondary hover:text-white">Weekly</button>
            </div>
          </div>
          <RevenueChart data={data.monthlyRevenue} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-sip-card border border-sip-border-card rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Top Clients by Revenue</h2>
            <div className="space-y-3">
              {data.topClients.map((client, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: client.avatarColor }}>
                    {getInitials(client.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{client.name}</p>
                    <p className="text-sip-text-muted text-xs">{formatCurrency(client.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-sip-card border border-sip-border-card rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Sales by Category</h2>
            <CategoryChart data={data.salesByCategory} />
          </div>
        </div>
      </div>
    </div>
  );
}
