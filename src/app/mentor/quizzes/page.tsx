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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold cyber-text-gradient mb-2">Quizzes</h1>
          <p className="text-[#8888aa]">Create and manage quizzes with locked-down mode.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="cyber-btn px-4 py-2 rounded-lg text-sm">
          {showForm ? "Cancel" : "+ New Quiz"}
        </button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="cyber-input w-full px-4 py-2.5 rounded-lg" placeholder="Quiz title" required />
            <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className="cyber-input w-full px-4 py-2.5 rounded-lg" placeholder="Time limit in minutes (optional)" />
            <button type="submit" disabled={loading} className="cyber-btn px-6 py-2.5 rounded-lg">{loading ? "Creating..." : "Create Quiz"}</button>
          </form>
        </motion.div>
      )}

      {quizzes.length === 0 ? (
        <div className="text-center py-12 text-[#8888aa]">No quizzes yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {quizzes.map((quiz, i) => (
            <motion.div key={quiz.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/mentor/quizzes/${quiz.id}`} className="glass rounded-2xl p-5 block glass-hover">
                <h3 className="text-lg font-semibold mb-1">{quiz.title}</h3>
                <div className="flex gap-3 text-xs text-[#555]">
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
