"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function ResultsPage() {
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/student/results")
      .then((r) => r.json())
      .then(setAttempts)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-header">
          <h1 className="text-gradient">Quiz Results</h1>
          <p>Your quiz history and scores.</p>
        </div>
      </motion.div>

      {attempts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <p className="empty-state-title">No quiz attempts yet</p>
          <p className="empty-state-desc">Your quiz results will appear here once you complete a quiz.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt, i) => (
            <motion.div key={attempt.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card p-5" whileHover={{ x: 6 }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{attempt.quiz?.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {new Date(attempt.submittedAt || attempt.startedAt).toLocaleDateString()}
                    {attempt.violations > 0 && ` · ${attempt.violations} violations`}
                  </p>
                </div>
                <div className="text-right">
                  <ScoreCountUp value={attempt.score || 0} status={attempt.status} />
                  <motion.span
                    className={`badge ${attempt.status === "SUBMITTED" ? "badge-green" : "badge-red"}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 + i * 0.05 }}
                  >
                    {attempt.status}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScoreCountUp({ value, status }: { value: number; status: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1000;
          const step = Math.ceil(value / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= value) { setCount(value); clearInterval(timer); }
            else setCount(start);
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  const color = value >= 70 ? "text-green-400" : value >= 40 ? "text-yellow-400" : "text-red-400";

  return (
    <motion.p
      ref={ref}
      className={`text-lg font-bold ${color}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      {count.toFixed(0)}%
    </motion.p>
  );
}
