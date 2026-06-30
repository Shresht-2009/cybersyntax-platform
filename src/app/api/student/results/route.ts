import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "STUDENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json([]);

  const attempts = await prisma.quizAttempt.findMany({
    where: { studentId: profile.id },
    include: { quiz: { select: { title: true } } },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(attempts);
}
