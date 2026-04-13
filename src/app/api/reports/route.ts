import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [orders, clients, products] = await Promise.all([
    prisma.order.findMany({ include: { items: true, client: true } }),
    prisma.client.findMany({ where: { status: "ACTIVE" } }),
    prisma.product.findMany(),
  ]);

  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED");
  const totalRevenue = deliveredOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    0
  );
  const avgOrderValue = deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0;

  // Monthly revenue (mock realistic data)
  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyRevenue = months.map((month, i) => ({
    month,
    revenue: Math.round(150000 + Math.random() * 200000 + i * 30000),
  }));

  // Top clients by revenue
  const clientRevenue: Record<string, { name: string; revenue: number; avatarColor: string }> = {};
  for (const order of deliveredOrders) {
    const revenue = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    if (!clientRevenue[order.clientId]) {
      clientRevenue[order.clientId] = {
        name: order.client.name,
        revenue: 0,
        avatarColor: order.client.avatarColor,
      };
    }
    clientRevenue[order.clientId].revenue += revenue;
  }
  const topClients = Object.values(clientRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Sales by category
  const categoryRevenue: Record<string, number> = {};
  for (const order of orders) {
    for (const item of order.items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const cat = product.category;
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + item.unitPrice * item.quantity;
      }
    }
  }
  const totalCatRevenue = Object.values(categoryRevenue).reduce((s, v) => s + v, 0);
  const categoryLabels: Record<string, string> = {
    SPIRITS: "Spirits",
    WINE: "Wine",
    CHAMPAGNE: "Champagne",
    BEER: "Beer",
  };
  const salesByCategory = Object.entries(categoryRevenue)
    .map(([cat, rev]) => ({
      category: categoryLabels[cat] || cat,
      percentage: Math.round((rev / totalCatRevenue) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return NextResponse.json({
    totalRevenue,
    ordersCompleted: deliveredOrders.length,
    avgOrderValue: Math.round(avgOrderValue),
    activeClients: clients.length,
    monthlyRevenue,
    topClients,
    salesByCategory,
  });
}
