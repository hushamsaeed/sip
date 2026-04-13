"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface Client { id: string; name: string; atoll: string; }
interface Product { id: string; name: string; price: number; stock: number; }
interface LineItem { productId: string; quantity: number; unitPrice: number; }

export default function NewOrderPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<LineItem[]>([{ productId: "", quantity: 1, unitPrice: 0 }]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/clients").then((r) => r.json()).then(setClients);
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  }, []);

  function addItem() {
    setItems([...items, { productId: "", quantity: 1, unitPrice: 0 }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    const newItems = [...items];
    if (field === "productId") {
      const product = products.find((p) => p.id === value);
      newItems[index] = { ...newItems[index], productId: value as string, unitPrice: product?.price || 0 };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  }

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  async function handleSubmit() {
    if (!clientId || items.some((i) => !i.productId)) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, items, notes }),
    });
    if (res.ok) {
      toast.success("Order created");
      router.push("/admin/orders");
    } else {
      toast.error("Failed to create order");
    }
    setLoading(false);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="text-sip-text-secondary hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">New Order</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? "Creating..." : "Create Order"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-sip-card border border-sip-border-card rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Client</h2>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sip-amber appearance-none"
            >
              <option value="">Select a client...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {c.atoll}</option>
              ))}
            </select>
          </div>

          <div className="bg-sip-card border border-sip-border-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Order Items</h2>
              <button onClick={addItem} className="text-sip-amber text-sm flex items-center gap-1 hover:underline">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-6">
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(i, "productId", e.target.value)}
                      className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sip-amber appearance-none"
                    >
                      <option value="">Select product...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} — {formatCurrency(p.price)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value) || 1)}
                      className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-sip-amber"
                    />
                  </div>
                  <div className="col-span-3 text-white text-sm text-right">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </div>
                  <div className="col-span-1 text-right">
                    {items.length > 1 && (
                      <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-sip-border-subtle flex justify-between">
              <span className="text-sip-text-muted text-sm">Subtotal</span>
              <span className="text-white font-semibold">{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </div>

        <div className="bg-sip-card border border-sip-border-card rounded-xl p-6 h-fit">
          <h2 className="text-white font-semibold mb-4">Order Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions..."
            rows={4}
            className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-sip-text-muted focus:outline-none focus:border-sip-amber resize-none"
          />
        </div>
      </div>
    </div>
  );
}
