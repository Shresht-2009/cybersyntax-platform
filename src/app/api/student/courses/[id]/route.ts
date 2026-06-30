import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "STUDENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const student = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.courseEnrollment.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: id } },
    update: {},
    create: { studentId: student.id, courseId: id },
  });

  const course = await prisma.course.findUnique({
    where: { id, status: "PUBLISHED" },
    include: {
      lessons: { orderBy: { order: "asc" } },
      quizzes: { include: { questions: true } },
    },
  });

  return NextResponse.json(course);
}
