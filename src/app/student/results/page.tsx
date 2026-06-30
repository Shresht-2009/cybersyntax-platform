"use client";

import { useEffect, useState } from "react";
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
        <h1 className="text-3xl font-bold cyber-text-gradient mb-2">Quiz Results</h1>
        <p className="text-[#8888aa]">Your quiz history and scores.</p>
      </motion.div>

      {attempts.length === 0 ? (
        <div className="text-center py-12 text-[#8888aa]">No quiz attempts yet.</div>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt, i) => (
            <motion.div key={attempt.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{attempt.quiz?.title}</h3>
                  <p className="text-xs text-[#8888aa]">
                    {new Date(attempt.submittedAt || attempt.startedAt).toLocaleDateString()}
                    {attempt.violations > 0 && ` · ${attempt.violations} violations`}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${(attempt.score || 0) >= 70 ? "text-green-400" : (attempt.score || 0) >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                    {attempt.score?.toFixed(0) || 0}%
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    attempt.status === "SUBMITTED" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {attempt.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
