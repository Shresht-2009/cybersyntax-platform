"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedDiag, setSelectedDiag] = useState<any>(null);

  useEffect(() => {
    fetch("/api/mentor/applications")
      .then((r) => r.json())
      .then(setApplications)
      .catch(() => {});
  }, []);

  const handleAction = async (id: string, action: "ACCEPTED" | "REJECTED") => {
    const res = await fetch(`/api/mentor/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action }),
    });
    if (res.ok) {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: action } : a))
      );
    }
  };

  const pending = applications.filter((a) => a.status === "PENDING");
  const reviewed = applications.filter((a) => a.status !== "PENDING");

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold cyber-text-gradient mb-2">Applications</h1>
        <p className="text-[#8888aa]">Review and manage student applications.</p>
      </motion.div>

      {pending.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Review ({pending.length})</h2>
          {pending.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6"
            >
                  <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{app.user?.name}</h3>
                  <p className="text-sm text-[#8888aa]">{app.user?.email}</p>
                  <p className="text-sm text-cyan-400 mt-1">Program: {app.program || "Not specified"}</p>
                  {app.resume && (
                    <p className="text-sm text-[#8888aa] mt-1">
                      Resume:{" "}
                      {app.resumeType === "TEXT" ? (
                        <span className="text-cyan-400">Written application available</span>
                      ) : (
                        <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                          View file
                        </a>
                      )}
                    </p>
                  )}
                  {app.diagnostic && (
                    <button onClick={() => setSelectedDiag(app.diagnostic)}
                      className="text-xs text-purple-400 hover:underline mt-1">
                      View diagnostic answers
                    </button>
                  )}
                </div>
                <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  Pending
                </span>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleAction(app.id, "ACCEPTED")}
                  className="cyber-btn px-4 py-2 rounded-lg text-sm"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(app.id, "REJECTED")}
                  className="px-4 py-2 rounded-lg text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {pending.length === 0 && (
        <div className="text-center py-12 text-[#8888aa]">No pending applications.</div>
      )}

      {reviewed.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Reviewed</h2>
          <div className="space-y-3">
            {reviewed.map((app) => (
              <div key={app.id} className="glass rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{app.user?.name}</p>
                  <p className="text-sm text-[#8888aa]">{app.user?.email}</p>
                  <p className="text-xs text-[#666]">{app.program || "No program"}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs border ${
                    app.status === "ACCEPTED"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedDiag && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDiag(null)}>
          <div className="glass rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Diagnostic Answers</h3>
              <button onClick={() => setSelectedDiag(null)} className="text-[#8888aa] hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              {Object.entries(selectedDiag).map(([key, val]) => (
                <div key={key}>
                  <p className="text-xs text-cyan-400 uppercase tracking-wide">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="text-sm text-white/80">{String(val) || "Not answered"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
