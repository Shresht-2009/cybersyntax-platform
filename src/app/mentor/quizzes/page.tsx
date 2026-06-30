"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/mentor/quizzes")
      .then((r) => r.json())
      .then(setQuizzes)
      .catch(() => {});
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/mentor/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, timeLimit: timeLimit ? parseInt(timeLimit) : null }),
    });
    if (res.ok) {
      const data = await res.json();
      setQuizzes((prev) => [data, ...prev]);
      setTitle("");
      setTimeLimit("");
      setShowForm(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Quizzes</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create and manage quizzes with locked-down mode.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary px-4 py-2 text-sm">
          {showForm ? "Cancel" : "+ New Quiz"}
        </button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input w-full" placeholder="Quiz title" required />
            <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className="input w-full" placeholder="Time limit in minutes (optional)" />
            <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5">{loading ? "Creating..." : "Create Quiz"}</button>
          </form>
        </motion.div>
      )}

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="empty-state-title">No quizzes yet</h3>
          <p className="empty-state-desc">Create your first quiz to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {quizzes.map((quiz, i) => (
            <motion.div key={quiz.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/mentor/quizzes/${quiz.id}`} className="card p-5 block hover:opacity-90 transition-opacity">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{quiz.title}</h3>
                <div className="flex gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>{quiz.questions?.length || 0} questions</span>
                  {quiz.timeLimit && <span>{quiz.timeLimit} min</span>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
