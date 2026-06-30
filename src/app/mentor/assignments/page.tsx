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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold cyber-text-gradient mb-2">Assignments</h1>
          <p className="text-[#8888aa]">Create and manage assignments for your students.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="cyber-btn px-4 py-2 rounded-lg text-sm">
          {showForm ? "Cancel" : "+ New Assignment"}
        </button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="cyber-input w-full px-4 py-2.5 rounded-lg" placeholder="Assignment title" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="cyber-input w-full px-4 py-2.5 rounded-lg min-h-[100px] resize-y" placeholder="Description..." required />
            <div>
              <label className="block text-sm text-[#8888aa] mb-1">Due Date (optional)</label>
              <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="cyber-input w-full px-4 py-2.5 rounded-lg" />
            </div>
            <button type="submit" disabled={loading} className="cyber-btn px-6 py-2.5 rounded-lg">
              {loading ? "Creating..." : "Create Assignment"}
            </button>
          </form>
        </motion.div>
      )}

      {assignments.length === 0 ? (
        <div className="text-center py-12 text-[#8888aa]">No assignments yet.</div>
      ) : (
        <div className="space-y-4">
          {assignments.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{a.title}</h3>
                  <p className="text-sm text-[#8888aa] mt-1">{a.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-[#555]">
                    {a.dueDate && <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>}
                    <span>{a.submissions?.length || 0} submissions</span>
                  </div>
                </div>
              </div>
              {a.submissions && a.submissions.length > 0 && (
                <div className="mt-4 space-y-2">
                  {a.submissions.map((sub: any) => (
                    <div key={sub.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span className="text-sm">{sub.student?.user?.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${sub.status === "GRADED" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
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
