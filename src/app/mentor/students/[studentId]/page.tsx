"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface QuizScore {
  quizTitle: string;
  score: number | null;
  totalQuestions: number;
}

interface AssignmentGrade {
  assignmentTitle: string;
  grade: number | null;
  feedback: string | null;
}

interface CourseProgress {
  courseId: string;
  courseTitle: string;
  totalQuizzes: number;
  quizzesAttempted: number;
  quizScores: QuizScore[];
  assignmentsSubmitted: number;
  assignmentGrades: AssignmentGrade[];
  avgQuizScore: number | null;
  progress: number;
  enrolledAt: string;
}

interface StudentData {
  student: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    status: string;
    createdAt: string;
  };
  courses: CourseProgress[];
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params?.studentId;
    if (!id) return;
    fetch(`/api/mentor/progress/${id}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [params?.studentId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <div className="skeleton h-6 w-48" />
            <div className="skeleton h-4 w-32" />
          </div>
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="card p-6 space-y-4">
            <div className="skeleton h-5 w-40" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-20 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="empty-state-title">Student not found</p>
      </div>
    );
  }

  const { student, courses } = data;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-5"
      >
        <Link
          href="/mentor/students"
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
        >
          <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-1">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(245,158,11,0.08))',
                border: '1px solid rgba(16,185,129,0.08)',
              }}
            >
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{student.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className={`badge ${student.status === 'ACCEPTED' ? 'badge-emerald' : student.status === 'PENDING' ? 'badge-gold' : 'badge-rose'}`}>
              {student.status}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Joined {new Date(student.createdAt).toLocaleDateString()}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {courses.length} course{courses.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </motion.div>

      {courses.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state">
          <div className="empty-state-icon">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="empty-state-title">No courses enrolled</p>
          <p className="empty-state-desc">This student hasn&apos;t enrolled in any courses yet.</p>
        </motion.div>
      )}

      <div className="grid gap-6">
        {courses.map((course, ci) => (
          <motion.div
            key={course.courseId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.08 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold">{course.courseTitle}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Enrolled {new Date(course.enrolledAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-28">
                  <div className="progress-bar">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: ci * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <span
                  className="text-lg font-bold"
                  style={{
                    color:
                      course.progress >= 80
                        ? 'var(--accent-emerald)'
                        : course.progress >= 40
                        ? 'var(--accent-gold)'
                        : 'var(--text-secondary)',
                  }}
                >
                  {course.progress}%
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-5">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.02)', border: '1px solid rgba(16,185,129,0.04)' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Quiz Avg</p>
                <p className="text-2xl font-bold" style={{ color: course.avgQuizScore !== null && course.avgQuizScore >= 70 ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                  {course.avgQuizScore !== null ? `${course.avgQuizScore}%` : "—"}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {course.quizzesAttempted}/{course.totalQuizzes} taken
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.02)', border: '1px solid rgba(245,158,11,0.04)' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Assignments</p>
                <p className="text-2xl font-bold">{course.assignmentsSubmitted}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {course.assignmentGrades.length} graded
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(244,63,94,0.02)', border: '1px solid rgba(244,63,94,0.04)' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Overall</p>
                <p className="text-2xl font-bold">{course.progress}%</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {course.quizzesAttempted + course.assignmentsSubmitted}/{course.totalQuizzes} items
                </p>
              </div>
            </div>

            {course.quizScores.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Quiz Scores</p>
                <div className="space-y-2">
                  {course.quizScores.map((qs, qi) => (
                    <div
                      key={qi}
                      className="flex items-center justify-between p-3 rounded-xl text-sm"
                      style={{ background: 'rgba(255,255,255,0.01)' }}
                    >
                      <span>{qs.quizTitle}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {qs.totalQuestions} questions
                        </span>
                        <span
                          className="font-semibold"
                          style={{
                            color:
                              qs.score !== null && qs.score >= 70
                                ? 'var(--accent-emerald)'
                                : qs.score !== null
                                ? 'var(--accent-gold)'
                                : 'var(--text-muted)',
                          }}
                        >
                          {qs.score !== null ? `${qs.score}%` : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.assignmentGrades.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Assignment Grades</p>
                <div className="space-y-2">
                  {course.assignmentGrades.map((ag, ai) => (
                    <div
                      key={ai}
                      className="flex items-center justify-between p-3 rounded-xl text-sm"
                      style={{ background: 'rgba(255,255,255,0.01)' }}
                    >
                      <div>
                        <span>{ag.assignmentTitle}</span>
                        {ag.feedback && (
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{ag.feedback}</p>
                        )}
                      </div>
                      <span
                        className="font-semibold"
                        style={{
                          color:
                            ag.grade !== null && ag.grade >= 70
                              ? 'var(--accent-emerald)'
                              : ag.grade !== null
                              ? 'var(--accent-gold)'
                              : 'var(--text-muted)',
                        }}
                      >
                        {ag.grade !== null ? `${ag.grade}/100` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
