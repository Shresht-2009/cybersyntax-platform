import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mentor = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { studentId } = await params;

  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      quizAttempts: {
        include: { quiz: { include: { questions: true, course: { select: { id: true, title: true } } } } },
      },
      submissions: { include: { assignment: { select: { id: true, title: true, mentorId: true } } } },
      enrollments: { include: { course: { select: { id: true, title: true, mentorId: true, _count: { select: { quizzes: true } } } } } },
    },
  });

  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const courses = student.enrollments
    .filter((e) => e.course.mentorId === mentor.id)
    .map((enrollment) => {
      const courseQuizzes = student.quizAttempts.filter(
        (a) => a.quiz.courseId === enrollment.course.id && a.status === "SUBMITTED"
      );
      const courseAssignments = student.submissions.filter(
        (s) => s.assignment.mentorId === mentor.id
      );

      const avgScore =
        courseQuizzes.length > 0
          ? Math.round(courseQuizzes.reduce((sum, a) => sum + (a.score || 0), 0) / courseQuizzes.length)
          : null;

      const completed = courseQuizzes.length + courseAssignments.length;
      const total = enrollment.course._count.quizzes;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        courseId: enrollment.course.id,
        courseTitle: enrollment.course.title,
        totalQuizzes: total,
        quizzesAttempted: courseQuizzes.length,
        quizScores: courseQuizzes.map((a) => ({
          quizTitle: a.quiz.title,
          score: a.score,
          totalQuestions: a.quiz.questions.length,
        })),
        assignmentsSubmitted: courseAssignments.length,
        assignmentGrades: courseAssignments
          .filter((s) => s.grade !== null)
          .map((s) => ({ assignmentTitle: s.assignment.title, grade: s.grade, feedback: s.feedback })),
        avgQuizScore: avgScore,
        progress,
        enrolledAt: enrollment.enrolledAt,
      };
    });

  return NextResponse.json({
    student: {
      id: student.id,
      name: student.user.name,
      email: student.user.email,
      image: student.user.image,
      status: student.status,
      createdAt: student.createdAt,
    },
    courses,
  });
}
