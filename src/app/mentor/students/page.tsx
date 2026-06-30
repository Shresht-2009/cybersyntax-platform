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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold cyber-text-gradient mb-2">Students</h1>
        <p className="text-[#8888aa]">Manage your enrolled students ({students.length})</p>
      </motion.div>

      {students.length === 0 ? (
        <div className="text-center py-12 text-[#8888aa]">No enrolled students yet.</div>
      ) : (
        <div className="space-y-3">
          {students.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-xl p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-semibold">
                  {student.user?.name?.[0] || "?"}
                </div>
                <div>
                  <p className="font-medium">{student.user?.name}</p>
                  <p className="text-sm text-[#8888aa]">{student.user?.email}</p>
                  {student.program && (
                    <p className="text-xs text-cyan-400">{student.program}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleKick(student.id)}
                className="px-3 py-1.5 rounded-lg text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
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
