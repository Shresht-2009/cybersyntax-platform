import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mentor = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const courses = await prisma.course.findMany({
    where: { mentorId: mentor.id },
    include: { lessons: { orderBy: { order: "asc" } }, quizzes: { include: { questions: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mentor = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { title, description } = await request.json();

  const course = await prisma.course.create({
    data: { mentorId: mentor.id, title, description },
  });

  return NextResponse.json(course);
}
