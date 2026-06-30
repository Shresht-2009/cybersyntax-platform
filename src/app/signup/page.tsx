"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "";

  const [step, setStep] = useState(initialRole ? 2 : 1);
  const [role, setRole] = useState<"MENTOR" | "STUDENT" | "">(initialRole as any);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [educatorKey, setEducatorKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectRole = (r: "MENTOR" | "STUDENT") => {
    setRole(r);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        educatorKey: role === "MENTOR" ? educatorKey : undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push(data.redirectTo);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--bg-primary)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-purple)]/10 rounded-full blur-[140px] animate-pulse-glow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="card p-8 shadow-[var(--shadow-glow-purple)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">Join CyberSyntax</h1>
            <p className="text-sm text-[var(--text-secondary)]">Create your account and start your journey</p>
          </div>

          {error && (
            <div className="mb-5 badge-red w-full justify-center py-2.5 px-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <button
                onClick={() => selectRole("STUDENT")}
                className="card w-full p-5 text-left hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[var(--accent-cyan)]/10 flex items-center justify-center ring-1 ring-[var(--accent-cyan)]/20 shrink-0">
                    <svg className="w-5 h-5 text-[var(--accent-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-[var(--text-primary)]">Student</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">Join courses, learn from mentors</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => selectRole("MENTOR")}
                className="card w-full p-5 text-left hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[var(--accent-purple)]/10 flex items-center justify-center ring-1 ring-[var(--accent-purple)]/20 shrink-0">
                    <svg className="w-5 h-5 text-[var(--accent-purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-[var(--text-primary)]">Mentor</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">Teach, guide, and earn</p>
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5 font-medium">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                />
              </div>
              {role === "MENTOR" && (
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1.5 font-medium">Educator Key</label>
                  <input
                    type="password"
                    value={educatorKey}
                    onChange={(e) => setEducatorKey(e.target.value)}
                    className="input"
                    placeholder="Enter educator key"
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 rounded-lg text-base"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-ghost w-full justify-center text-sm"
              >
                ← Change role
              </button>
            </motion.form>
          )}

          <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--accent-cyan)] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--text-secondary)]">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
