import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { client: true, items: { include: { product: true } }, timeline: { orderBy: { timestamp: "asc" } }, invoice: true },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const statusEvents: Record<string, string> = {
    IN_TRANSIT: "Shipped via Speedboat",
    DELIVERED: "Delivered to Resort",
    CANCELLED: "Order Cancelled",
  };

  const order = await prisma.order.update({
    where: { id },
    data: { status: body.status, updatedAt: new Date() },
  });

  if (body.status && statusEvents[body.status]) {
    await prisma.orderTimeline.create({
      data: { orderId: id, event: statusEvents[body.status] },
    });
  }

  return NextResponse.json(order);
}
