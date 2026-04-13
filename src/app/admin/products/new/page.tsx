"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "SPIRITS",
    brand: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    minOrderQty: "1",
    reorderPoint: "10",
    tags: [] as string[],
    available: true,
    deliveryMethod: "Standard Speedboat",
    availableFrom: new Date().toISOString().split("T")[0],
  });

  const allTags = ["Premium", "Aged", "Limited Edition"];

  async function handleSubmit(isDraft: boolean) {
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock || "0"),
          minOrderQty: parseInt(form.minOrderQty),
          reorderPoint: parseInt(form.reorderPoint),
          status: isDraft ? "DRAFT" : "ACTIVE",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create product");
      }

      toast.success(isDraft ? "Product saved as draft" : "Product published");
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="text-sip-text-secondary hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Add New Product</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="px-4 py-2 text-sm text-sip-text-secondary border border-sip-border-subtle rounded-lg hover:text-white transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Publish Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Product Info */}
        <div className="col-span-2 space-y-6">
          <div className="bg-sip-card border border-sip-border-card rounded-xl p-6 space-y-5">
            <h2 className="text-white font-semibold">Product Information</h2>

            <div>
              <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">Product Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Hennessy XO Cognac"
                className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-sip-text-muted focus:outline-none focus:border-sip-amber"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sip-amber appearance-none"
                >
                  <option value="SPIRITS">Spirits</option>
                  <option value="WINE">Wine</option>
                  <option value="CHAMPAGNE">Champagne</option>
                  <option value="BEER">Beer</option>
                </select>
              </div>
              <div>
                <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">Brand</label>
                <input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="Hennessy"
                  className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-sip-text-muted focus:outline-none focus:border-sip-amber"
                />
              </div>
            </div>

            <div>
              <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">SKU</label>
              <input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="SIP-SPR-HN-001"
                className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-sip-text-muted focus:outline-none focus:border-sip-amber"
              />
            </div>

            <div>
              <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter product description..."
                rows={3}
                className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-sip-text-muted focus:outline-none focus:border-sip-amber resize-none"
              />
            </div>
          </div>

          <div className="bg-sip-card border border-sip-border-card rounded-xl p-6 space-y-5">
            <h2 className="text-white font-semibold">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-sip-text-muted focus:outline-none focus:border-sip-amber"
                />
              </div>
              <div>
                <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">Stock Quantity</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                  className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-sip-text-muted focus:outline-none focus:border-sip-amber"
                />
              </div>
              <div>
                <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">Min. Order Qty</label>
                <input
                  type="number"
                  value={form.minOrderQty}
                  onChange={(e) => setForm({ ...form, minOrderQty: e.target.value })}
                  className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-sip-text-muted focus:outline-none focus:border-sip-amber"
                />
              </div>
              <div>
                <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">Reorder Point</label>
                <input
                  type="number"
                  value={form.reorderPoint}
                  onChange={(e) => setForm({ ...form, reorderPoint: e.target.value })}
                  className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-sip-text-muted focus:outline-none focus:border-sip-amber"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-sip-card border border-sip-border-card rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Product Image</h2>
            <div className="border-2 border-dashed border-sip-border-subtle rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-sip-text-muted mx-auto mb-2" />
              <p className="text-sip-text-muted text-sm">Drop image here or click to upload</p>
              <p className="text-sip-text-muted text-xs mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <div className="bg-sip-card border border-sip-border-card rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Product Tags</h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setForm({
                      ...form,
                      tags: form.tags.includes(tag)
                        ? form.tags.filter((t) => t !== tag)
                        : [...form.tags, tag],
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.tags.includes(tag)
                      ? "bg-sip-amber text-sip-bg-primary"
                      : "bg-sip-bg-secondary text-sip-text-secondary border border-sip-border-subtle hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-sip-card border border-sip-border-card rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Availability</h2>
            <div className="flex items-center justify-between">
              <span className="text-sip-text-secondary text-sm">Available for ordering</span>
              <button
                onClick={() => setForm({ ...form, available: !form.available })}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  form.available ? "bg-sip-amber" : "bg-sip-border-subtle"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    form.available ? "left-5" : "left-1"
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">Delivery Method</label>
              <select
                value={form.deliveryMethod}
                onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })}
                className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sip-amber appearance-none"
              >
                <option>Standard Speedboat</option>
                <option>Express Speedboat</option>
                <option>Cargo Ship</option>
              </select>
            </div>
            <div>
              <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">Available From</label>
              <input
                type="date"
                value={form.availableFrom}
                onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
                className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sip-amber"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
