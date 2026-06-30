"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  image: string | null;
  progress: number;
  quizzesTaken: number;
  totalQuizzes: number;
  assignmentsDone: number;
  totalAssignments: number;
  avgQuizScore: number | null;
  enrolledAt: string;
}

interface CourseProgress {
  courseId: string;
  courseTitle: string;
  totalStudents: number;
  students: StudentProgress[];
}

export default function MentorStudentsPage() {
  const [data, setData] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/mentor/progress")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.length > 0) setExpandedCourse(d[0].courseId);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <h1>Student Progress</h1>
          <p>Track your students' learning journey</p>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6 space-y-4">
            <div className="skeleton h-6 w-48" />
            <div className="skeleton h-4 w-32" />
            {[1, 2].map((j) => (
              <div key={j} className="flex items-center gap-4 p-3">
                <div className="skeleton h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="skeleton h-4 w-32" />
                  <div className="skeleton h-3 w-48" />
                </div>
                <div className="skeleton h-8 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <h1>Student Progress</h1>
        <p>Track your students&apos; learning journey across courses</p>
      </motion.div>

      {data.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="empty-state"
        >
          <div className="empty-state-icon">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="empty-state-title">No students enrolled yet</p>
          <p className="empty-state-desc">Students will appear here once they enroll in your courses.</p>
        </motion.div>
      )}

      <div className="space-y-4">
        {data.map((course, ci) => (
          <motion.div
            key={course.courseId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.08 }}
            className="card overflow-hidden"
          >
            <button
              onClick={() => setExpandedCourse(expandedCourse === course.courseId ? null : course.courseId)}
              className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.08)' }}
                >
                  <svg className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">{course.courseTitle}</h3>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{course.totalStudents} enrolled</p>
                </div>
              </div>
              <motion.svg
                animate={{ rotate: expandedCourse === course.courseId ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="w-5 h-5" style={{ color: 'var(--text-secondary)' }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {expandedCourse === course.courseId && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 80, damping: 16 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-3">
                    {course.students.length === 0 && (
                      <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>No students yet</p>
                    )}
                    {course.students.map((student, si) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: si * 0.05 }}
                        className="flex items-center gap-4 p-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.015)' }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(0,212,255,0.08)' }}
                        >
                          {student.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{student.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {student.quizzesTaken}/{student.totalQuizzes} quizzes
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {student.assignmentsDone}/{student.totalAssignments} assignments
                            </span>
                            {student.avgQuizScore !== null && (
                              <span className="text-xs" style={{ color: 'var(--accent-green)' }}>
                                Avg: {student.avgQuizScore}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="w-24">
                            <div className="progress-bar">
                              <motion.div
                                className="progress-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${student.progress}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: si * 0.05 + 0.3 }}
                              />
                            </div>
                          </div>
                          <span
                            className="text-sm font-semibold min-w-[3ch] text-right"
                            style={{
                              color: student.progress >= 80
                                ? 'var(--accent-green)'
                                : student.progress >= 40
                                ? 'var(--accent-yellow)'
                                : 'var(--text-secondary)',
                            }}
                          >
                            {student.progress}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
