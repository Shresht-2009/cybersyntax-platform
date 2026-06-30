"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ApplyPage() {
  const router = useRouter();
  const [program, setProgram] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeType, setResumeType] = useState<"TEXT" | "PDF" | "IMAGE">("TEXT");
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/student/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        if (data?.status === "ACCEPTED") {
          router.push("/student/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body: any = { program };
    if (resumeType === "TEXT") {
      body.resume = resumeText;
    } else {
      body.resume = resumeUrl;
    }
    body.resumeType = resumeType;

    const res = await fetch("/api/student/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/student/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
    setLoading(false);
  };

  if (profile?.status === "PENDING") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Application Pending</h2>
          <p className="text-[#8888aa] text-sm">Your application is under review. You&apos;ll be notified once it&apos;s approved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold cyber-text-gradient mb-2">Apply to Program</h1>
        <p className="text-[#8888aa] mb-8">Complete your application to get started.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm text-[#8888aa] mb-1">Select Program</label>
            <select value={program} onChange={(e) => setProgram(e.target.value)} className="cyber-input w-full px-4 py-2.5 rounded-lg" required>
              <option value="">Choose a program...</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Data Science">Data Science</option>
              <option value="Finance">Finance</option>
              <option value="Cybersecurity & Data Science">Cybersecurity & Data Science</option>
              <option value="Data Science & Finance">Data Science & Finance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#8888aa] mb-2">Resume / Application</label>
            <div className="flex gap-2 mb-3">
              {(["TEXT", "PDF", "IMAGE"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setResumeType(t)}
                  className={`flex-1 py-2 rounded-lg text-xs transition-all ${resumeType === t ? "cyber-btn" : "bg-white/5"}`}>
                  {t === "TEXT" ? "Write" : t === "PDF" ? "PDF" : "Image"}
                </button>
              ))}
            </div>
            {resumeType === "TEXT" ? (
              <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)}
                className="cyber-input w-full px-4 py-2.5 rounded-lg min-h-[200px] resize-y"
                placeholder="Write about your experience, skills, and why you want to join..." required />
            ) : (
              <input type="url" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)}
                className="cyber-input w-full px-4 py-2.5 rounded-lg"
                placeholder="Paste file URL (Upload via UploadThing)" required />
            )}
          </div>

          <button type="submit" disabled={loading}
            className="cyber-btn w-full py-2.5 rounded-lg text-base disabled:opacity-50">
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
