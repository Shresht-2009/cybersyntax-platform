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
    include: {
      quizzes: { include: { questions: true } },
      enrollments: {
        include: {
          student: {
            include: {
              user: { select: { id: true, name: true, email: true, image: true } },
              quizAttempts: { include: { quiz: true } },
              submissions: { include: { assignment: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const assignments = await prisma.assignment.findMany({
    where: { mentorId: mentor.id },
    include: { submissions: true },
  });

  const data = courses.map((course) => {
    const totalQuizzes = course.quizzes.length;
    const totalAssignments = assignments.length;

    const enrolledStudents = course.enrollments.map((enrollment) => {
      const student = enrollment.student;
      const takenQuizzes = student.quizAttempts.filter(
        (a) => a.quiz.courseId === course.id && a.status === "SUBMITTED"
      );
      const doneAssignments = student.submissions.filter((s) =>
        assignments.some((a) => a.id === s.assignmentId)
      );

      const completed = takenQuizzes.length + doneAssignments.length;
      const total = totalQuizzes + totalAssignments;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      const avgQuizScore =
        takenQuizzes.length > 0
          ? Math.round(
              takenQuizzes.reduce((sum, a) => sum + (a.score || 0), 0) / takenQuizzes.length
            )
          : null;

      return {
        id: student.id,
        name: student.user.name,
        email: student.user.email,
        image: student.user.image,
        progress,
        quizzesTaken: takenQuizzes.length,
        totalQuizzes,
        assignmentsDone: doneAssignments.length,
        totalAssignments,
        avgQuizScore,
        enrolledAt: enrollment.enrolledAt,
      };
    });

    return {
      courseId: course.id,
      courseTitle: course.title,
      totalStudents: enrolledStudents.length,
      students: enrolledStudents,
    };
  });

  return NextResponse.json(data);
}
