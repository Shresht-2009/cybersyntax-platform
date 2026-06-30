"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconXCircle } from "@/components/shared/Icons";

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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <h1 className="text-3xl font-bold text-gradient mb-2">Applications</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review and manage student applications ({pending.length} pending).</p>
      </motion.div>

      {pending.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Pending Review ({pending.length})</h2>
          {pending.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{app.user?.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{app.user?.email}</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--accent-emerald)' }}>Program: {app.program || "Not specified"}</p>
                  {app.resume && (
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Resume:{" "}
                      {app.resumeType === "TEXT" ? (
                        <span style={{ color: 'var(--accent-emerald)' }}>Written application available</span>
                      ) : (
                        <a href={app.resume} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-emerald)' }}>
                          View file
                        </a>
                      )}
                    </p>
                  )}
                  {app.diagnostic && (
                    <button onClick={() => setSelectedDiag(app.diagnostic)}
                      className="text-xs mt-1" style={{ color: 'var(--accent-gold)' }}>
                      View diagnostic answers
                    </button>
                  )}
                </div>
                <span className="badge badge-yellow">Pending</span>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleAction(app.id, "ACCEPTED")}
                  className="btn-primary px-4 py-2 text-sm"
                  style={{ background: 'var(--accent-green)' }}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(app.id, "REJECTED")}
                  className="btn-danger px-4 py-2 text-sm"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {pending.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="empty-state-title">No pending applications</h3>
          <p className="empty-state-desc">All applications have been reviewed.</p>
        </div>
      )}

      {reviewed.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Reviewed</h2>
          <div className="space-y-3">
            {reviewed.map((app) => (
              <div key={app.id} className="card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{app.user?.name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{app.user?.email}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{app.program || "No program"}</p>
                </div>
                <span className={`badge ${app.status === "ACCEPTED" ? "badge-green" : "badge-red"}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedDiag && (
        <div className="modal-overlay" onClick={() => setSelectedDiag(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Diagnostic Answers</h3>
              <button onClick={() => setSelectedDiag(null)} style={{ color: 'var(--text-secondary)' }}><IconXCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {Object.entries(selectedDiag).map(([key, val]) => (
                <div key={key}>
                  <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--accent-emerald)' }}>{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{String(val) || "Not answered"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
