import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Package, Plus, Search } from "lucide-react";
import Link from "next/link";

const categoryLabels: Record<string, string> = {
  SPIRITS: "Spirits",
  WINE: "Wine",
  CHAMPAGNE: "Champagne",
  BEER: "Beer",
};

const categoryColors: Record<string, string> = {
  SPIRITS: "bg-sip-amber/20 text-sip-amber",
  WINE: "bg-red-500/20 text-red-400",
  CHAMPAGNE: "bg-sip-blue/20 text-sip-blue",
  BEER: "bg-sip-teal/20 text-sip-teal",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/20 text-emerald-400",
  LOW_STOCK: "bg-sip-amber/20 text-sip-amber",
  OUT_OF_STOCK: "bg-red-500/20 text-red-400",
  DRAFT: "bg-gray-500/20 text-gray-400",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const page = parseInt(params.page || "1");
  const perPage = 10;

  const where = category && category !== "all"
    ? { category: category.toUpperCase() as "SPIRITS" | "WINE" | "CHAMPAGNE" | "BEER" }
    : {};

  const [products, total, categoryCounts] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
    prisma.product.groupBy({
      by: ["category"],
      _count: true,
    }),
  ]);

  const totalProducts = await prisma.product.count();
  const totalPages = Math.ceil(total / perPage);

  const countsMap: Record<string, number> = {};
  categoryCounts.forEach((c) => {
    countsMap[c.category] = c._count;
  });

  const tabs = [
    { label: "All", value: "all", count: totalProducts },
    { label: "Spirits", value: "spirits", count: countsMap.SPIRITS || 0 },
    { label: "Wine", value: "wine", count: countsMap.WINE || 0 },
    { label: "Champagne", value: "champagne", count: countsMap.CHAMPAGNE || 0 },
    { label: "Beer", value: "beer", count: countsMap.BEER || 0 },
  ];

  const activeTab = category || "all";

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Catalogue</h1>
          <p className="text-sip-text-muted text-sm mt-1">
            Manage your beverage inventory and product listings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sip-text-muted" />
            <input
              placeholder="Search products..."
              className="bg-sip-card border border-sip-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-sip-text-muted w-64 focus:outline-none focus:border-sip-amber"
            />
          </div>
          <Link
            href="/admin/products/new"
            className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/products?category=${tab.value}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-sip-amber text-sip-bg-primary"
                : "bg-sip-card text-sip-text-secondary hover:text-white border border-sip-border-subtle"
            }`}
          >
            {tab.label} ({tab.count})
          </Link>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-sip-card border border-sip-border-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-sip-text-muted text-xs uppercase border-b border-sip-border-subtle">
              <th className="text-left px-5 py-3 font-medium">Product</th>
              <th className="text-left px-5 py-3 font-medium">Category</th>
              <th className="text-left px-5 py-3 font-medium">Price</th>
              <th className="text-left px-5 py-3 font-medium">Stock</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-sip-border-subtle/50 last:border-0 hover:bg-white/[0.02]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sip-bg-secondary rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-sip-amber" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{product.name}</p>
                      <p className="text-sip-text-muted text-xs">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[product.category]}`}>
                    {categoryLabels[product.category]}
                  </span>
                </td>
                <td className="px-5 py-4 text-white text-sm">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-5 py-4 text-sip-text-secondary text-sm">
                  {product.stock}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[product.status]}`}>
                    {product.status === "OUT_OF_STOCK" ? "Out of Stock" : product.status === "LOW_STOCK" ? "Low Stock" : product.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-sip-blue text-sm hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-sip-text-muted">
          Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} of {total} products
        </p>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/products?category=${activeTab}&page=${p}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                p === page
                  ? "bg-sip-amber text-sip-bg-primary"
                  : "bg-sip-card text-sip-text-secondary border border-sip-border-subtle hover:text-white"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
