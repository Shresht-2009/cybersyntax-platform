import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { title, type, content, videoUrl, order } = await request.json();

  const lesson = await prisma.lesson.create({
    data: { courseId: id, title, type, content: content || null, videoUrl: videoUrl || null, order },
  });

  return NextResponse.json(lesson);
}
