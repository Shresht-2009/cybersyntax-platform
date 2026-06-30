import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mentor = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const announcements = await prisma.announcement.findMany({
    where: { mentorId: mentor.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(announcements);
}

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mentor = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { title, content, imageUrl } = await request.json();

  const announcement = await prisma.announcement.create({
    data: { mentorId: mentor.id, title, content, imageUrl: imageUrl || null },
  });

  return NextResponse.json(announcement);
}
