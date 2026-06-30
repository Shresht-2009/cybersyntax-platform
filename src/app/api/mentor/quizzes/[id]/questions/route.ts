import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { text, type, options, correctAnswer, points } = await request.json();

  const question = await prisma.question.create({
    data: { quizId: id, text, type, options, correctAnswer, points },
  });

  return NextResponse.json(question);
}
