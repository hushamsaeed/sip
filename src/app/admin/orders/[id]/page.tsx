import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ChevronLeft, Printer, CheckCircle, Package, Truck, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderActions } from "./order-actions";

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

const timelineIcons: Record<string, React.ReactNode> = {
  "Order Placed": <Package className="w-4 h-4" />,
  "Processing": <Clock className="w-4 h-4" />,
  "Shipped via Speedboat": <Truck className="w-4 h-4" />,
  "Delivered to Resort": <MapPin className="w-4 h-4" />,
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      client: true,
      items: { include: { product: true } },
      timeline: { orderBy: { timestamp: "asc" } },
      invoice: true,
    },
  });

  if (!order) notFound();

  const subtotal = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const total = subtotal + order.shippingCost + order.taxAmount;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="text-sip-text-secondary hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Order {order.orderNumber}</h1>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
            {statusLabels[order.status]}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {order.invoice && (
            <Link
              href={`/admin/invoices/${order.invoice.id}`}
              className="text-sip-text-secondary border border-sip-border-subtle rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:text-white transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Invoice
            </Link>
          )}
          <OrderActions orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="col-span-2 space-y-6">
          <div className="bg-sip-card border border-sip-border-card rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Order Items</h2>
            <table className="w-full">
              <thead>
                <tr className="text-sip-text-muted text-xs uppercase border-b border-sip-border-subtle">
                  <th className="text-left pb-3 font-medium">Product</th>
                  <th className="text-left pb-3 font-medium">Category</th>
                  <th className="text-left pb-3 font-medium">Qty</th>
                  <th className="text-left pb-3 font-medium">Unit Price</th>
                  <th className="text-right pb-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-sip-border-subtle/50">
                    <td className="py-3 text-white text-sm">{item.product.name}</td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-sip-amber/20 text-sip-amber">
                        {item.product.category}
                      </span>
                    </td>
                    <td className="py-3 text-sip-text-secondary text-sm">{item.quantity}</td>
                    <td className="py-3 text-sip-text-secondary text-sm">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-white text-sm text-right">{formatCurrency(item.unitPrice * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 pt-4 border-t border-sip-border-subtle space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-sip-text-muted">Subtotal</span>
                <span className="text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sip-text-muted">Shipping</span>
                <span className="text-white">{formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sip-text-muted">Tax</span>
                <span className="text-white">{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-sip-border-subtle">
                <span className="text-white">Total</span>
                <span className="text-sip-teal">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Timeline */}
          <div className="bg-sip-card border border-sip-border-card rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Delivery Timeline</h2>
            <div className="space-y-0">
              {order.timeline.map((event, i) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i === order.timeline.length - 1 ? "bg-sip-amber text-sip-bg-primary" : "bg-sip-bg-secondary text-sip-text-secondary"
                    }`}>
                      {timelineIcons[event.event] || <Clock className="w-4 h-4" />}
                    </div>
                    {i < order.timeline.length - 1 && (
                      <div className="w-px h-8 bg-sip-border-subtle" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-white text-sm font-medium">{event.event}</p>
                    <p className="text-sip-text-muted text-xs">{formatDate(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-sip-card border border-sip-border-card rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Client Details</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-sip-text-muted text-xs">Resort</p>
                <p className="text-white">{order.client.name}</p>
              </div>
              <div>
                <p className="text-sip-text-muted text-xs">Location</p>
                <p className="text-white">{order.client.island}, {order.client.atoll}</p>
              </div>
              <div>
                <p className="text-sip-text-muted text-xs">Contact</p>
                <p className="text-white">{order.client.contactPerson}</p>
              </div>
              {order.client.phone && (
                <div>
                  <p className="text-sip-text-muted text-xs">Phone</p>
                  <p className="text-white">{order.client.phone}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-sip-card border border-sip-border-card rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Shipping Details</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-sip-text-muted text-xs">Carrier</p>
                <p className="text-white">{order.carrier || "Speedboat Express"}</p>
              </div>
              {order.trackingNumber && (
                <div>
                  <p className="text-sip-text-muted text-xs">Tracking</p>
                  <p className="text-sip-blue">{order.trackingNumber}</p>
                </div>
              )}
              <div>
                <p className="text-sip-text-muted text-xs">Deliver to</p>
                <p className="text-white">{order.deliveryTo || "Male Port Terminal"}</p>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-sip-card border border-sip-border-card rounded-xl p-5">
              <h2 className="text-white font-semibold mb-3">Order Notes</h2>
              <p className="text-sip-text-secondary text-sm">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
