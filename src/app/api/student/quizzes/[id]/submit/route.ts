import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "STUDENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { answers, violations, autoSubmit } = await request.json();

  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ error: "Student profile not found" }, { status: 404 });

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { questions: true },
  });

  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let score = 0;
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  for (const question of quiz.questions) {
    const userAnswer = answers[question.id];
    if (userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
      score += question.points;
    }
  }

  const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId: id,
      studentId: profile.id,
      score: percentage,
      answers,
      violations: violations || 0,
      status: autoSubmit ? "VIOLATED" : "SUBMITTED",
      submittedAt: new Date(),
    },
  });

  return NextResponse.json(attempt);
}
