import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "STUDENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ status: "NO_PROFILE" });

  if (profile.status !== "ACCEPTED") {
    return NextResponse.json({ status: profile.status });
  }

  const [announcements, assignments, courses] = await Promise.all([
    prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.assignment.findMany({
      where: { submissions: { none: { studentId: profile.id } } },
    }),
    prisma.course.findMany({ take: 10 }),
  ]);

  const quizAttempts = await prisma.quizAttempt.count({
    where: { studentId: user.id, status: "SUBMITTED" },
  });

  return NextResponse.json({
    status: profile.status,
    announcements,
    pendingAssignments: assignments.length,
    courseCount: courses.length,
    quizCount: quizAttempts,
  });
}
