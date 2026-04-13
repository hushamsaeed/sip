import { prisma } from "@/lib/db";
import { formatCurrency, formatCompactCurrency, formatDate } from "@/lib/utils";
import { ShoppingCart, Truck, Clock, DollarSign, Plus, Download, Search } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  PROCESSING: "bg-sip-amber/20 text-sip-amber",
  IN_TRANSIT: "bg-sip-blue/20 text-sip-blue",
  DELIVERED: "bg-emerald-500/20 text-emerald-400",
  CANCELLED: "bg-red-500/20 text-red-400",
};

const statusLabels: Record<string, string> = {
  PROCESSING: "Processing",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const filterStatus = params.status;

  const where = filterStatus && filterStatus !== "all"
    ? { status: filterStatus.toUpperCase() as "PROCESSING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED" }
    : {};

  const [orders, allOrders] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { client: true, items: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({ include: { items: true } }),
  ]);

  const totalOrders = allOrders.length;
  const inTransit = allOrders.filter((o) => o.status === "IN_TRANSIT").length;
  const processing = allOrders.filter((o) => o.status === "PROCESSING").length;
  const thisMonthRevenue = allOrders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0), 0);

  const stats = [
    { label: "Total Orders", value: totalOrders.toLocaleString(), icon: ShoppingCart, color: "text-white" },
    { label: "In Transit", value: inTransit.toString(), icon: Truck, trend: "+10%", color: "text-sip-blue" },
    { label: "Processing", value: processing.toString(), icon: Clock, trend: "+5%", color: "text-sip-amber" },
    { label: "Revenue This Month", value: formatCompactCurrency(thisMonthRevenue), icon: DollarSign, color: "text-emerald-400" },
  ];

  const tabs = [
    { label: "All", value: "all" },
    { label: "Processing", value: "processing" },
    { label: "In Transit", value: "in_transit" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const activeTab = filterStatus || "all";

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Order Management</h1>
        <div className="flex items-center gap-3">
          <button className="text-sip-text-secondary border border-sip-border-subtle rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:text-white transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <Link
            href="/admin/orders/new"
            className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Order
          </Link>
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

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/orders?status=${tab.value}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-sip-amber text-sip-bg-primary"
                : "bg-sip-card text-sip-text-secondary hover:text-white border border-sip-border-subtle"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="bg-sip-card border border-sip-border-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-sip-text-muted text-xs uppercase border-b border-sip-border-subtle">
              <th className="text-left px-5 py-3 font-medium">Order ID</th>
              <th className="text-left px-5 py-3 font-medium">Resort / Client</th>
              <th className="text-left px-5 py-3 font-medium">Items</th>
              <th className="text-left px-5 py-3 font-medium">Total</th>
              <th className="text-left px-5 py-3 font-medium">Date</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const total = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
              return (
                <tr key={order.id} className="border-b border-sip-border-subtle/50 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-4 text-sip-blue text-sm">{order.orderNumber}</td>
                  <td className="px-5 py-4 text-white text-sm">{order.client.name}</td>
                  <td className="px-5 py-4 text-sip-text-secondary text-sm">
                    {order.items.reduce((s, i) => s + i.quantity, 0)}
                  </td>
                  <td className="px-5 py-4 text-white text-sm">{formatCurrency(total)}</td>
                  <td className="px-5 py-4 text-sip-text-secondary text-sm">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-sip-blue text-sm hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
