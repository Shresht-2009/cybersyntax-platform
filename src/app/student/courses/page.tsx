"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/student/courses")
      .then((r) => r.json())
      .then(setCourses)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-header">
          <h1 className="text-gradient">Courses</h1>
          <p>Browse and access your courses.</p>
        </div>
      </motion.div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <p className="empty-state-title">No courses available</p>
          <p className="empty-state-desc">Courses will appear here once they are assigned to you.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {courses.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/student/courses/${course.id}`} className="card p-5 block">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-2">{course.description || ""}</p>
                <div className="flex gap-3 text-xs text-[var(--text-muted)]">
                  <span>{course.lessons?.length || 0} lessons</span>
                  <span>{course.quizzes?.length || 0} quizzes</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
