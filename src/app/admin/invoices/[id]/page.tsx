import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ChevronLeft, Download } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          client: true,
          items: { include: { product: true } },
        },
      },
    },
  });

  if (!invoice) notFound();

  const { order } = invoice;
  const subtotal = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const total = subtotal + order.shippingCost + order.taxAmount;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/admin/orders/${order.id}`} className="text-sip-text-secondary hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Invoice {invoice.invoiceNumber}</h1>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Paid</span>
        </div>
        <button className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <div className="bg-sip-card border border-sip-border-card rounded-xl p-8 max-w-4xl">
        {/* Invoice Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white font-heading italic">SIP</h2>
            <p className="text-sip-text-secondary text-sm mt-1">by ELACT PVT LTD</p>
            <p className="text-sip-text-muted text-xs mt-2">
              M.Thunaabage, Muranga Magu<br />
              Male&apos;, Republic of Maldives<br />
              Reg: C0876/2020
            </p>
          </div>
          <div className="text-right">
            <p className="text-sip-amber text-xl font-bold tracking-wide">INVOICE</p>
            <p className="text-sip-text-muted text-sm mt-2">
              {invoice.invoiceNumber}<br />
              Date: {formatDate(invoice.createdAt)}<br />
              Due: {formatDate(invoice.dueDate)}<br />
              Terms: {invoice.terms}
            </p>
          </div>
        </div>

        {/* Bill To / Ship To */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <p className="text-sip-text-muted text-xs uppercase tracking-wide mb-2">Bill To</p>
            <p className="text-white text-sm font-medium">{order.client.name}</p>
            <p className="text-sip-text-secondary text-xs">
              {order.client.island}, {order.client.atoll}<br />
              Republic of Maldives
            </p>
          </div>
          <div>
            <p className="text-sip-text-muted text-xs uppercase tracking-wide mb-2">Ship To</p>
            <p className="text-white text-sm font-medium">{order.client.name}</p>
            <p className="text-sip-text-secondary text-xs">
              {order.client.island}, {order.client.atoll}<br />
              Via Speedboat from Male&apos; Port
            </p>
          </div>
          <div>
            <p className="text-sip-text-muted text-xs uppercase tracking-wide mb-2">Payment Method</p>
            <p className="text-white text-sm">{invoice.paymentMethod}</p>
            <p className="text-sip-text-muted text-xs">{invoice.terms}</p>
          </div>
        </div>

        {/* Line Items */}
        <table className="w-full mb-6">
          <thead>
            <tr className="text-sip-text-muted text-xs uppercase border-b border-sip-border-subtle">
              <th className="text-left pb-3 font-medium">Item</th>
              <th className="text-center pb-3 font-medium">Qty</th>
              <th className="text-right pb-3 font-medium">Unit Price</th>
              <th className="text-right pb-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-sip-border-subtle/50">
                <td className="py-3 text-white text-sm">{item.product.name}</td>
                <td className="py-3 text-sip-text-secondary text-sm text-center">{item.quantity}</td>
                <td className="py-3 text-sip-text-secondary text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 text-white text-sm text-right">{formatCurrency(item.unitPrice * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-sip-text-muted">Subtotal</span>
              <span className="text-white">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sip-text-muted">Shipping (Speedboat Express)</span>
              <span className="text-white">{formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sip-text-muted">Tax (Duty-free bonded)</span>
              <span className="text-white">{formatCurrency(order.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-sip-border-subtle">
              <span className="text-white">Total Due</span>
              <span className="text-sip-amber text-lg">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-sip-border-subtle text-xs text-sip-text-muted">
          <p>Thank you for your business. Payment is due within 15 days.</p>
          <p className="mt-1">
            Bank: BML | A/C: ELACT PVT LTD | — | swift: | — | ref: {invoice.invoiceNumber}
          </p>
          <p className="mt-1">Questions? Contact sales@elact.co | +960 332 1010</p>
        </div>
      </div>
    </div>
  );
}
