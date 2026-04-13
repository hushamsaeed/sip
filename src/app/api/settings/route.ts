import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const settings = await prisma.settings.findMany();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  for (const [key, value] of Object.entries(body)) {
    await prisma.settings.upsert({
      where: { key },
      update: { value: value as object },
      create: { key, value: value as object },
    });
  }

  return NextResponse.json({ success: true });
}
