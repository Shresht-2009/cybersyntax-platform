import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "STUDENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        select: { id: true, text: true, type: true, options: true, points: true },
      },
    },
  });

  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (quiz.shuffleQuestions) {
    quiz.questions = quiz.questions.sort(() => Math.random() - 0.5);
  }

  return NextResponse.json(quiz);
}
