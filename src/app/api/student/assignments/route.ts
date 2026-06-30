import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "STUDENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json([]);

  const assignments = await prisma.assignment.findMany({
    include: {
      submissions: {
        where: { studentId: profile.id },
        orderBy: { submittedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assignments);
}
