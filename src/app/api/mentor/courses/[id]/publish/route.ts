import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const course = await prisma.course.findUnique({ where: { id }, include: { mentor: true } });
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (course.mentor.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.course.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  return NextResponse.json(updated);
}
