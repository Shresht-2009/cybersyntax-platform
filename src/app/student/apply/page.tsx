"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadThing } from "@/lib/uploadthing";

type Step = "program" | "goals" | "experience" | "resume" | "roleplay" | "review";

const questions = [
  { id: "goals", label: "What are your career goals in this field?", placeholder: "Tell us what you hope to achieve..." },
  { id: "motivation", label: "What motivated you to join this program?", placeholder: "Share your story..." },
  { id: "strengths", label: "What are your key strengths and skills?", placeholder: "Technical skills, soft skills, etc." },
];

const rolePlayScenarios = [
  { id: "scenario1", label: "A client reports a security breach at 2 AM. Walk us through your response.", placeholder: "Describe your step-by-step response..." },
  { id: "scenario2", label: "You're given a large dataset with missing values. How do you proceed?", placeholder: "Explain your approach..." },
  { id: "scenario3", label: "A team member disagrees with your analysis. How do you handle it?", placeholder: "How would you resolve this?" },
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= current ? "bg-cyan-400" : "bg-white/10"}`} />
      ))}
    </div>
  );
}

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(0);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [program, setProgram] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [experience, setExperience] = useState("");
  const [rolePlayAnswers, setRolePlayAnswers] = useState<Record<string, string>>({});
  const [resumeType, setResumeType] = useState<"FILE" | "TEXT">("FILE");
  const [resumeText, setResumeText] = useState("");
  const [resumeFileUrl, setResumeFileUrl] = useState("");

  const { startUpload, isUploading } = useUploadThing("resumeUpload", {
    onClientUploadComplete: (res: { url: string }[] | undefined) => {
      if (res?.[0]) setResumeFileUrl(res[0].url);
    },
  });

  const steps: Step[] = ["program", "goals", "experience", "resume", "roleplay", "review"];
  const totalSteps = steps.length;

  useEffect(() => {
    fetch("/api/student/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        if (data?.status === "ACCEPTED") router.push("/student/dashboard");
        if (data?.status === "DRAFT" || data?.status === "REJECTED") {
          if (data.diagnostic) setAnswers(data.diagnostic);
          if (data.program) setProgram(data.program);
        }
      })
      .catch(() => {});
  }, [router]);

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

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-[#8888aa]">Loading...</div>
      </div>
    );
  }

  const updateAnswer = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }));
  const updateRolePlay = (id: string, value: string) => setRolePlayAnswers((prev) => ({ ...prev, [id]: value }));

  const nextStep = () => { if (step < totalSteps - 1) setStep(step + 1); };
  const prevStep = () => { if (step > 0) setStep(step - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const body: any = { program };
    if (resumeType === "TEXT") body.resume = resumeText;
    else body.resume = resumeFileUrl;
    body.resumeType = resumeType === "FILE" ? "PDF" : "TEXT";
    body.diagnostic = { ...answers, experience, ...rolePlayAnswers };

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

  const canProceed = () => {
    switch (steps[step]) {
      case "program": return !!program;
      case "goals": return questions.every((q) => (answers[q.id]?.length || 0) >= 10);
      case "experience": return !!experience;
      case "resume": return resumeType === "FILE" ? !!resumeFileUrl : resumeText.length >= 50;
      case "roleplay": return rolePlayScenarios.every((s) => (rolePlayAnswers[s.id]?.length || 0) >= 20);
      case "review": return true;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold cyber-text-gradient mb-1">Application</h1>
        <p className="text-[#8888aa] mb-4">Step {step + 1} of {totalSteps} — {steps[step].charAt(0).toUpperCase() + steps[step].slice(1)}</p>
        <StepIndicator current={step} total={totalSteps} />
      </motion.div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">{error}</div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <div className="glass rounded-2xl p-6 space-y-5">

            {step === 0 && (
              <>
                <div>
                  <label className="block text-sm text-[#8888aa] mb-1">Select Program</label>
                  <select value={program} onChange={(e) => setProgram(e.target.value)} className="cyber-input w-full px-4 py-2.5 rounded-lg" required>
                    <option value="">Choose a program...</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Finance">Finance</option>
                    <option value="Cybersecurity & Data Science">Cybersecurity & Data Science</option>
                    <option value="Data Science & Finance">Data Science & Finance</option>
                    <option value="All Three">All Three</option>
                  </select>
                </div>
                <div className="p-4 rounded-xl bg-white/5 text-sm text-[#8888aa]">
                  <p className="font-medium text-white mb-1">Why this matters</p>
                  <p>Your program selection helps us match you with the right mentor and learning path. You can discuss adjustments during your onboarding.</p>
                </div>
              </>
            )}

            {step === 1 && questions.map((q) => (
              <div key={q.id}>
                <label className="block text-sm text-[#8888aa] mb-1">{q.label}</label>
                <textarea value={answers[q.id] || ""} onChange={(e) => updateAnswer(q.id, e.target.value)}
                  className="cyber-input w-full px-4 py-2.5 rounded-lg min-h-[100px] resize-y" placeholder={q.placeholder} />
              </div>
            ))}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm text-[#8888aa] mb-1">Experience Level</label>
                  <select value={experience} onChange={(e) => setExperience(e.target.value)} className="cyber-input w-full px-4 py-2.5 rounded-lg">
                    <option value="">Select your level...</option>
                    <option value="Beginner">Beginner — No prior experience</option>
                    <option value="Intermediate">Intermediate — Some coursework or projects</option>
                    <option value="Advanced">Advanced — Significant hands-on experience</option>
                    <option value="Professional">Professional — Industry experience</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#8888aa] mb-1">Describe your background</label>
                  <textarea value={answers["background"] || ""} onChange={(e) => updateAnswer("background", e.target.value)}
                    className="cyber-input w-full px-4 py-2.5 rounded-lg min-h-[120px] resize-y"
                    placeholder="Tell us about your educational background, any relevant courses, projects, or work experience..." />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm text-[#8888aa] mb-2">Resume / Application</label>
                  <div className="flex gap-2 mb-3">
                    {(["FILE", "TEXT"] as const).map((t) => (
                      <button key={t} type="button" onClick={() => setResumeType(t)}
                        className={`flex-1 py-2 rounded-lg text-xs transition-all ${resumeType === t ? "cyber-btn" : "bg-white/5"}`}>
                        {t === "FILE" ? "Upload File" : "Write"}
                      </button>
                    ))}
                  </div>
                  {resumeType === "TEXT" ? (
                    <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)}
                      className="cyber-input w-full px-4 py-2.5 rounded-lg min-h-[200px] resize-y"
                      placeholder="Write about your experience, skills, projects, and why you want to join..." required />
                  ) : (
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-cyan-500/30 transition-all">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) startUpload([file]);
                          }}
                          className="hidden"
                          id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                          </div>
                          <p className="text-sm text-[#8888aa]">{isUploading ? "Uploading..." : resumeFileUrl ? "Uploaded! Click to replace" : "Click to upload PDF or Image"}</p>
                          <p className="text-xs text-[#555] mt-1">PDF, PNG, JPG (max 4MB)</p>
                        </label>
                      </div>
                      {resumeFileUrl && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-400 text-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          File uploaded successfully
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 4 && rolePlayScenarios.map((s) => (
              <div key={s.id}>
                <label className="block text-sm text-[#8888aa] mb-1">{s.label}</label>
                <textarea value={rolePlayAnswers[s.id] || ""} onChange={(e) => updateRolePlay(s.id, e.target.value)}
                  className="cyber-input w-full px-4 py-2.5 rounded-lg min-h-[100px] resize-y" placeholder={s.placeholder} />
              </div>
            ))}

            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review Your Application</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-[#8888aa]">Program</span>
                    <span>{program}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-[#8888aa]">Experience</span>
                    <span>{experience}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-[#8888aa]">Resume</span>
                    <span>{resumeType === "FILE" ? "File uploaded" : "Written application"}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-[#8888aa]">Questions answered</span>
                    <span>{Object.keys(answers).length + rolePlayScenarios.length}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <button onClick={prevStep} disabled={step === 0}
          className="cyber-btn-outline px-6 py-2.5 rounded-lg text-sm disabled:opacity-30">
          Back
        </button>
        {step < totalSteps - 1 ? (
          <button onClick={nextStep} disabled={!canProceed()}
            className="cyber-btn px-6 py-2.5 rounded-lg text-sm disabled:opacity-50">
            Continue
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading}
            className="cyber-btn px-6 py-2.5 rounded-lg text-sm disabled:opacity-50">
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        )}
      </div>

      {profile?.status === "REJECTED" && (
        <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
          Your previous application was reviewed. You can submit a new application with updated information.
        </div>
      )}
    </div>
  );
}
