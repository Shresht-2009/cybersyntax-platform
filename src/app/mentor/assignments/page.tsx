"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/mentor/assignments")
      .then((r) => r.json())
      .then(setAssignments)
      .catch(() => {});
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/mentor/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, dueDate: dueDate || null }),
    });
    if (res.ok) {
      const data = await res.json();
      setAssignments((prev) => [data, ...prev]);
      setTitle("");
      setDescription("");
      setDueDate("");
      setShowForm(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Assignments</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create and manage assignments for your students.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary px-4 py-2 text-sm">
          {showForm ? "Cancel" : "+ New Assignment"}
        </button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input w-full" placeholder="Assignment title" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="textarea w-full min-h-[100px]" placeholder="Description..." required />
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Due Date (optional)</label>
              <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input w-full" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5">
              {loading ? "Creating..." : "Create Assignment"}
            </button>
          </form>
        </motion.div>
      )}

      {assignments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="empty-state-title">No assignments yet</h3>
          <p className="empty-state-desc">Create your first assignment to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{a.title}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{a.description}</p>
                  <div className="flex gap-4 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {a.dueDate && <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>}
                    <span>{a.submissions?.length || 0} submissions</span>
                  </div>
                </div>
              </div>
              {a.submissions && a.submissions.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="divider" />
                  {a.submissions.map((sub: any) => (
                    <div key={sub.id} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{sub.student?.user?.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${sub.status === "GRADED" ? "badge-green" : "badge-yellow"}`}>
                          {sub.grade ? `${sub.grade}/100` : "Ungraded"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
