import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mentor = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const assignments = await prisma.assignment.findMany({
    where: { mentorId: mentor.id },
    include: { submissions: { include: { student: { include: { user: { select: { name: true } } } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assignments);
}

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mentor = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { title, description, dueDate } = await request.json();

  const assignment = await prisma.assignment.create({
    data: {
      mentorId: mentor.id,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  return NextResponse.json(assignment);
}
