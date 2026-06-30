import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "STUDENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const courses = await prisma.course.findMany({
    include: { lessons: { orderBy: { order: "asc" } }, quizzes: { include: { questions: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses);
}
