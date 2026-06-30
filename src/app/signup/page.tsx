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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass rounded-2xl p-8 cyber-glow">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold cyber-text-gradient mb-2">Join CyberSyntax</h1>
            <p className="text-[#8888aa] text-sm">Create your account and start your journey</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <button
                onClick={() => selectRole("STUDENT")}
                className="glass w-full p-5 rounded-xl text-left glass-hover group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Student</h3>
                    <p className="text-sm text-[#8888aa]">Join courses, learn from mentors</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => selectRole("MENTOR")}
                className="glass w-full p-5 rounded-xl text-left glass-hover group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Mentor</h3>
                    <p className="text-sm text-[#8888aa]">Teach, guide, and earn</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8888aa] mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="cyber-input w-full px-4 py-2.5 rounded-lg"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#8888aa] mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cyber-input w-full px-4 py-2.5 rounded-lg"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#8888aa] mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cyber-input w-full px-4 py-2.5 rounded-lg"
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                />
              </div>
              {role === "MENTOR" && (
                <div>
                  <label className="block text-sm text-[#8888aa] mb-1">Educator Key</label>
                  <input
                    type="password"
                    value={educatorKey}
                    onChange={(e) => setEducatorKey(e.target.value)}
                    className="cyber-input w-full px-4 py-2.5 rounded-lg"
                    placeholder="Enter educator key"
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="cyber-btn w-full py-2.5 rounded-lg text-base disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-[#8888aa] hover:text-cyan-400 transition-colors"
              >
                ← Change role
              </button>
            </form>
          )}

          <p className="text-center mt-6 text-sm text-[#8888aa]">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:underline">
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#8888aa]">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
