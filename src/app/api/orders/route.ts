import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { client: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const year = new Date().getFullYear();
    const lastOrder = await prisma.order.findFirst({
      where: { orderNumber: { startsWith: `SIP-${year}` } },
      orderBy: { orderNumber: "desc" },
    });
    const nextNum = lastOrder
      ? parseInt(lastOrder.orderNumber.split("-")[2]) + 1
      : 1001;
    const orderNumber = `SIP-${year}-${nextNum}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        clientId: body.clientId,
        status: "PROCESSING",
        carrier: body.carrier || "Speedboat Express",
        deliveryTo: body.deliveryTo,
        notes: body.notes,
        items: {
          create: body.items.map((item: { productId: string; quantity: number; unitPrice: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
        timeline: {
          create: {
            event: "Order Placed",
            description: `Order ${orderNumber} created`,
          },
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
