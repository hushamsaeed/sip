import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await req.json();

  const section = await prisma.contentSection.update({
    where: { slug },
    data: {
      fields: body.fields,
      status: body.status || "DRAFT",
      publishedAt: body.status === "PUBLISHED" ? new Date() : undefined,
    },
  });

  if (body.status === "PUBLISHED") {
    revalidatePath("/");
  }

  return NextResponse.json(section);
}
