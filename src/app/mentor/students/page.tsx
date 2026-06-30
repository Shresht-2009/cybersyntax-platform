"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/mentor/students")
      .then((r) => r.json())
      .then(setStudents)
      .catch(() => {});
  }, []);

  const handleKick = async (id: string) => {
    if (!confirm("Are you sure you want to remove this student?")) return;
    const res = await fetch(`/api/mentor/students/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <h1 className="text-3xl font-bold text-gradient mb-2">Students</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your enrolled students ({students.length})</p>
      </motion.div>

      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="empty-state-title">No enrolled students yet</h3>
          <p className="empty-state-desc">Students will appear here once they enroll.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {students.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="card p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm" style={{ background: 'rgba(var(--accent-cyan-rgb), 0.1)', color: 'var(--accent-cyan)' }}>
                  {student.user?.name?.[0] || "?"}
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{student.user?.name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{student.user?.email}</p>
                  {student.program && (
                    <span className="badge badge-cyan text-xs mt-1">{student.program}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleKick(student.id)}
                className="btn-danger px-3 py-1.5 text-sm"
              >
                Remove
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
