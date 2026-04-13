import { prisma } from "@/lib/db";
import { formatCurrency, getInitials } from "@/lib/utils";
import { Users, Building, Anchor, ShoppingCart, Plus, Search } from "lucide-react";
import Link from "next/link";

const typeColors: Record<string, string> = {
  RESORT: "bg-sip-blue/20 text-sip-blue",
  LIVEABOARD: "bg-sip-teal/20 text-sip-teal",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/20 text-emerald-400",
  SUSPENDED: "bg-red-500/20 text-red-400",
  INACTIVE: "bg-gray-500/20 text-gray-400",
};

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const filterType = params.type;

  const where = filterType && filterType !== "all"
    ? { type: filterType.toUpperCase() as "RESORT" | "LIVEABOARD" }
    : {};

  const clients = await prisma.client.findMany({
    where,
    include: {
      orders: { include: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const allClients = await prisma.client.findMany();
  const totalClients = allClients.length;
  const resorts = allClients.filter((c) => c.type === "RESORT").length;
  const liveaboards = allClients.filter((c) => c.type === "LIVEABOARD").length;
  const activeOrders = await prisma.order.count({ where: { status: { in: ["PROCESSING", "IN_TRANSIT"] } } });

  const stats = [
    { label: "Total Clients", value: totalClients.toString(), icon: Users, color: "text-white" },
    { label: "Luxury Resorts", value: resorts.toString(), icon: Building, color: "text-sip-blue" },
    { label: "Liveaboards", value: liveaboards.toString(), icon: Anchor, color: "text-sip-teal" },
    { label: "Active Orders", value: activeOrders.toString(), icon: ShoppingCart, color: "text-sip-amber" },
  ];

  const tabs = [
    { label: `All Clients (${totalClients})`, value: "all" },
    { label: `Resorts (${resorts})`, value: "resort" },
    { label: `Liveaboards (${liveaboards})`, value: "liveaboard" },
  ];

  const activeTab = filterType || "all";

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Client Management</h1>
          <p className="text-sip-text-muted text-sm mt-1">Manage resort and liveaboard client accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sip-text-muted" />
            <input placeholder="Search clients..." className="bg-sip-card border border-sip-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-sip-text-muted w-64 focus:outline-none focus:border-sip-amber" />
          </div>
          <button className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Add Client
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
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Link key={tab.value} href={`/admin/clients?type=${tab.value}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.value ? "bg-sip-amber text-sip-bg-primary" : "bg-sip-card text-sip-text-secondary hover:text-white border border-sip-border-subtle"
            }`}>
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="bg-sip-card border border-sip-border-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-sip-text-muted text-xs uppercase border-b border-sip-border-subtle">
              <th className="text-left px-5 py-3 font-medium">Client</th>
              <th className="text-left px-5 py-3 font-medium">Type</th>
              <th className="text-left px-5 py-3 font-medium">Atoll / Location</th>
              <th className="text-left px-5 py-3 font-medium">Orders</th>
              <th className="text-left px-5 py-3 font-medium">Revenue</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const revenue = client.orders.reduce((sum, o) =>
                sum + o.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0), 0);
              return (
                <tr key={client.id} className="border-b border-sip-border-subtle/50 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium text-white"
                        style={{ backgroundColor: client.avatarColor }}>
                        {getInitials(client.name)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{client.name}</p>
                        <p className="text-sip-text-muted text-xs">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${typeColors[client.type]}`}>
                      {client.type === "RESORT" ? "Resort" : "Liveaboard"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sip-text-secondary text-sm">{client.atoll}</td>
                  <td className="px-5 py-4 text-sip-text-secondary text-sm">{client.orders.length}</td>
                  <td className="px-5 py-4 text-white text-sm">{formatCurrency(revenue)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[client.status]}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="text-sip-blue text-sm hover:underline">Edit</button>
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
