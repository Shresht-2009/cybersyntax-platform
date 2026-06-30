import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function DELETE(request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mentor = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { studentId } = await params;
  const { studentName, password } = await request.json();

  if (!studentName || !password) {
    return NextResponse.json({ error: "Student name and password are required" }, { status: 400 });
  }

  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: { user: { select: { id: true, name: true } } },
  });
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  if (student.user.name.toLowerCase() !== studentName.toLowerCase()) {
    return NextResponse.json({ error: "Student name does not match" }, { status: 400 });
  }

  const passwordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!passwordValid) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const mentorCourses = await prisma.course.findMany({
    where: { mentorId: mentor.id },
    select: { id: true },
  });
  const courseIds = mentorCourses.map((c) => c.id);

  await prisma.courseEnrollment.deleteMany({
    where: { studentId: student.id, courseId: { in: courseIds } },
  });

  await prisma.studentProfile.update({
    where: { id: studentId },
    data: { status: "PENDING" },
  });

  return NextResponse.json({ success: true, message: `${student.user.name} has been removed` });
}
