import { prisma } from "@/lib/db";
import { formatCurrency, formatCompactCurrency, formatDate, getInitials } from "@/lib/utils";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

async function getDashboardData() {
  const [products, clients, orders, topProducts] = await Promise.all([
    prisma.product.count({ where: { status: { not: "DRAFT" } } }),
    prisma.client.count({ where: { status: "ACTIVE" } }),
    prisma.order.findMany({
      include: { client: true, items: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.product.findMany({
      orderBy: { stock: "desc" },
      take: 5,
    }),
  ]);

  const allOrders = await prisma.order.findMany({
    include: { items: true },
  });

  const totalRevenue = allOrders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0), 0);

  const activeOrders = allOrders.filter(
    (o) => o.status === "PROCESSING" || o.status === "IN_TRANSIT"
  ).length;

  return { products, clients, orders, topProducts, totalRevenue, activeOrders };
}

const statusColors: Record<string, string> = {
  PROCESSING: "bg-sip-amber/20 text-sip-amber",
  IN_TRANSIT: "bg-sip-blue/20 text-sip-blue",
  DELIVERED: "bg-emerald-500/20 text-emerald-400",
  CANCELLED: "bg-red-500/20 text-red-400",
};

export default async function DashboardPage() {
  const { products, clients, orders, topProducts, totalRevenue, activeOrders } =
    await getDashboardData();

  const stats = [
    { label: "Total Revenue", value: formatCompactCurrency(totalRevenue), icon: DollarSign, trend: "+24%", color: "text-sip-amber" },
    { label: "Active Orders", value: activeOrders.toString(), icon: ShoppingCart, trend: "+8%", color: "text-sip-blue" },
    { label: "Resort Clients", value: clients.toString(), icon: Users, trend: "+3", color: "text-sip-teal" },
    { label: "Products", value: products.toString(), icon: Package, trend: "", color: "text-white" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-sip-card border border-sip-border-card rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sip-text-muted text-xs uppercase tracking-wide">
                {stat.label}
              </p>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            {stat.trend && (
              <p className="text-emerald-400 text-xs mt-1">{stat.trend}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="col-span-2 bg-sip-card border border-sip-border-card rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Recent Orders</h2>
          <table className="w-full">
            <thead>
              <tr className="text-sip-text-muted text-xs uppercase border-b border-sip-border-subtle">
                <th className="text-left pb-3 font-medium">Order ID</th>
                <th className="text-left pb-3 font-medium">Resort</th>
                <th className="text-left pb-3 font-medium">Items</th>
                <th className="text-left pb-3 font-medium">Total</th>
                <th className="text-left pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-sip-border-subtle/50 last:border-0"
                >
                  <td className="py-3 text-sip-blue text-sm">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 text-white text-sm">
                    {order.client.name}
                  </td>
                  <td className="py-3 text-sip-text-secondary text-sm">
                    {order.items.reduce((s, i) => s + i.quantity, 0)}
                  </td>
                  <td className="py-3 text-white text-sm">
                    {formatCurrency(
                      order.items.reduce(
                        (s, i) => s + i.unitPrice * i.quantity,
                        0
                      )
                    )}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded-full ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status === "IN_TRANSIT"
                        ? "In Transit"
                        : order.status.charAt(0) +
                          order.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="bg-sip-card border border-sip-border-card rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="text-sip-text-muted text-xs w-4">
                  {i + 1}
                </span>
                <div className="w-8 h-8 bg-sip-bg-secondary rounded flex items-center justify-center">
                  <Package className="w-4 h-4 text-sip-amber" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{product.name}</p>
                  <p className="text-sip-text-muted text-xs">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
