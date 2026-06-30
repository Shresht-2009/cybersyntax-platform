import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  const student = await prisma.studentProfile.update({
    where: { id },
    data: { status },
  });

  if (status === "ACCEPTED") {
    const mentor = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
    if (mentor) {
      const existingConv = await prisma.conversation.findUnique({
        where: { mentorId_studentId: { mentorId: user.id, studentId: student.userId } },
      });
      if (!existingConv) {
        await prisma.conversation.create({
          data: { mentorId: user.id, studentId: student.userId },
        });
      }
    }
  }

  return NextResponse.json(student);
}
