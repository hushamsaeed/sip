import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category");

  const where = category && category !== "all"
    ? { category: category.toUpperCase() as "SPIRITS" | "WINE" | "CHAMPAGNE" | "BEER" }
    : {};

  const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        sku: body.sku,
        brand: body.brand,
        category: body.category,
        description: body.description || null,
        price: body.price,
        stock: body.stock || 0,
        minOrderQty: body.minOrderQty || 1,
        reorderPoint: body.reorderPoint || 10,
        status: body.status || "ACTIVE",
        tags: body.tags || [],
        available: body.available ?? true,
        deliveryMethod: body.deliveryMethod || "Standard Speedboat",
        availableFrom: body.availableFrom ? new Date(body.availableFrom) : new Date(),
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
