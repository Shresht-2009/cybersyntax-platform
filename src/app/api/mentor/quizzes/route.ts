import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mentor = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const quizzes = await prisma.quiz.findMany({
    where: { mentorId: mentor.id },
    include: { questions: true, _count: { select: { attempts: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(quizzes);
}

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mentor = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { title, timeLimit, courseId } = await request.json();

  const quiz = await prisma.quiz.create({
    data: {
      mentorId: mentor.id,
      title,
      timeLimit: timeLimit || null,
      courseId: courseId || null,
    },
  });

  return NextResponse.json(quiz);
}
