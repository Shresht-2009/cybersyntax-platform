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
        <h1 className="text-3xl font-bold cyber-text-gradient mb-2">Assignments</h1>
        <p className="text-[#8888aa]">View and submit your assignments.</p>
      </motion.div>

      {assignments.length === 0 ? (
        <div className="text-center py-12 text-[#8888aa]">No assignments yet.</div>
      ) : (
        <div className="space-y-4">
          {assignments.map((a, i) => {
            const submitted = a.submissions?.[0];
            return (
              <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{a.title}</h3>
                    <p className="text-sm text-[#8888aa] mt-1">{a.description}</p>
                    {a.dueDate && (
                      <p className="text-xs text-[#555] mt-1">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  {submitted && (
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      submitted.status === "GRADED" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {submitted.status === "GRADED" ? `Graded: ${submitted.grade}/100` : "Submitted"}
                    </span>
                  )}
                </div>

                {!submitted ? (
                  <div className="space-y-3">
                    <textarea value={submissionText} onChange={(e) => setSubmissionText(e.target.value)}
                      className="cyber-input w-full px-4 py-2.5 rounded-lg min-h-[100px] resize-y" placeholder="Write your submission..." />
                    <button onClick={() => handleSubmit(a.id)} disabled={submittingId === a.id || !submissionText.trim()}
                      className="cyber-btn px-4 py-2 rounded-lg text-sm disabled:opacity-50">
                      {submittingId === a.id ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 p-3 rounded-lg bg-white/5">
                    <p className="text-sm text-[#8888aa]">Your submission:</p>
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
