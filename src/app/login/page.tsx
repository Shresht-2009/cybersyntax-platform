"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Invalid credentials or email not verified");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();
    const role = session?.user?.role;

    if (role === "MENTOR") {
      router.push("/mentor/dashboard");
    } else {
      router.push("/student/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)',
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(100px)',
          }}
          animate={{
            x: [0, (mousePos.x - 0.5) * 60, 0],
            y: [0, (mousePos.y - 0.5) * 40, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(245,158,11,0.04), transparent 70%)',
            left: '25%', top: '15%',
            filter: 'blur(80px)',
          }}
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 350, height: 350,
            background: 'radial-gradient(circle, rgba(244,114,182,0.03), transparent 70%)',
            right: '20%', bottom: '10%',
            filter: 'blur(80px)',
          }}
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
        <svg className="w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="none">
          <defs>
            <pattern id="grid4" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--accent-emerald)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid4)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 50, damping: 14 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass p-8 rounded-2xl glow-border" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 50, damping: 14 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.08)' }}
              whileHover={{ scale: 1.08, rotate: [0, -6, 6, 0] }}
              transition={{ duration: 0.3 }}
            >
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="2" width="28" height="28" rx="6" stroke="url(#g2)" strokeWidth="2" />
                <path d="M16 8L16 24M8 16L24 16" stroke="url(#g2)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="16" r="4" fill="url(#g2)" />
                <defs>
                  <linearGradient id="g2" x1="4" y1="4" x2="28" y2="28">
                    <stop stopColor="#10b981" /><stop offset="1" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-rose))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome Back</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sign in to your CyberSyntax account</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, x: 0 }}
              animate={{ opacity: 1, height: 'auto', x: [0, -4, 4, -4, 4, 0] }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="mb-5"
            >
              <div className="badge-red w-full justify-center py-2.5 px-4 rounded-lg text-sm">{error}</div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
                <motion.div className="absolute inset-0 rounded-lg pointer-events-none" style={{ boxShadow: '0 0 0 0 rgba(16,185,129,0)' }}
                  whileFocus={{ boxShadow: '0 0 0 3px rgba(16,185,129,0.08)' }} />
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" required />
                <motion.div className="absolute inset-0 rounded-lg pointer-events-none" style={{ boxShadow: '0 0 0 0 rgba(16,185,129,0)' }}
                  whileFocus={{ boxShadow: '0 0 0 3px rgba(16,185,129,0.08)' }} />
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 rounded-lg text-base relative overflow-hidden group">
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                      </svg>
                      Signing in...
                    </span>
                  ) : "Sign In"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-6 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium hover:underline" style={{ color: 'var(--accent-emerald)' }}>
              Sign up
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
