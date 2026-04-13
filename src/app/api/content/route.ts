import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const sections = await prisma.contentSection.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(sections);
}
