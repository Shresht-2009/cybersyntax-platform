import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mentor = await prisma.mentorProfile.findUnique({
    where: { userId: user.id },
  });

  if (!mentor) {
    return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 });
  }

  const [studentCount, pendingApps, announcementCount] = await Promise.all([
    prisma.studentProfile.count({ where: { status: "ACCEPTED" } }),
    prisma.studentProfile.count({ where: { status: "PENDING" } }),
    prisma.announcement.count({ where: { mentorId: mentor.id } }),
  ]);

  return NextResponse.json({
    studentCount,
    pendingApps,
    announcementCount,
    totalFunds: mentor.totalFunds,
  });
}
