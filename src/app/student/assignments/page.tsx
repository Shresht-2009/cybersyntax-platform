"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissionText, setSubmissionText] = useState("");
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/student/assignments")
      .then((r) => r.json())
      .then(setAssignments)
      .catch(() => {});
  }, []);

  const handleSubmit = async (assignmentId: string) => {
    setSubmittingId(assignmentId);
    const res = await fetch(`/api/student/assignments/${assignmentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: submissionText }),
    });
    if (res.ok) {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId
            ? { ...a, submissions: [{ content: submissionText, status: "SUBMITTED", submittedAt: new Date().toISOString() }] }
            : a
        )
      );
      setSubmissionText("");
    }
    setSubmittingId(null);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-header">
          <h1 className="text-gradient">Assignments</h1>
          <p>View and submit your assignments.</p>
        </div>
      </motion.div>

      {assignments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <p className="empty-state-title">No assignments yet</p>
          <p className="empty-state-desc">Assignments will appear here once they are created.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((a, i) => {
            const submitted = a.submissions?.[0];
            return (
              <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{a.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{a.description}</p>
                    {a.dueDate && (
                      <p className="text-xs text-[var(--text-muted)] mt-1">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  {submitted && (
                    <span className={`badge ${
                      submitted.status === "GRADED" ? "badge-green" : "badge-yellow"
                    }`}>
                      {submitted.status === "GRADED" ? `Graded: ${submitted.grade}/100` : "Submitted"}
                    </span>
                  )}
                </div>

                {!submitted ? (
                  <div className="space-y-3">
                    <textarea value={submissionText} onChange={(e) => setSubmissionText(e.target.value)}
                      className="textarea w-full min-h-[100px]" placeholder="Write your submission..." />
                    <button onClick={() => handleSubmit(a.id)} disabled={submittingId === a.id || !submissionText.trim()}
                      className="btn-primary disabled:opacity-50">
                      {submittingId === a.id ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 p-3 rounded-lg bg-white/5">
                    <p className="text-sm text-[var(--text-secondary)]">Your submission:</p>
                    <p className="text-sm mt-1">{submitted.content}</p>
                    {submitted.feedback && (
                      <div className="mt-2 p-2 rounded bg-cyan-500/10">
                        <p className="text-xs text-cyan-400">Feedback: {submitted.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
