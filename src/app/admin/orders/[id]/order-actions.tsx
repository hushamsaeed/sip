"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

const nextStatus: Record<string, string> = {
  PROCESSING: "IN_TRANSIT",
  IN_TRANSIT: "DELIVERED",
};

const nextLabel: Record<string, string> = {
  PROCESSING: "Mark In Transit",
  IN_TRANSIT: "Mark Delivered",
};

export function OrderActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();

  async function updateStatus() {
    const newStatus = nextStatus[currentStatus];
    if (!newStatus) return;

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      toast.success(`Order marked as ${newStatus.replace("_", " ").toLowerCase()}`);
      router.refresh();
    } else {
      toast.error("Failed to update order");
    }
  }

  if (!nextStatus[currentStatus]) return null;

  return (
    <button
      onClick={updateStatus}
      className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
    >
      <CheckCircle className="w-4 h-4" />
      {nextLabel[currentStatus]}
    </button>
  );
}
