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
          className="absolute rounded-full blur-[120px]"
          style={{
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%)',
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: [0, (mousePos.x - 0.5) * 40, 0],
            y: [0, (mousePos.y - 0.5) * 30, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full blur-[100px]"
          style={{
            width: 350, height: 350,
            background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)',
            left: '30%', top: '20%',
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full blur-[100px]"
          style={{
            width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(0,212,255,0.05), transparent 70%)',
            right: '25%', bottom: '15%',
          }}
          animate={{
            x: [0, 25, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
        <svg className="w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="none">
          <defs>
            <pattern id="grid2" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--accent-cyan)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid2)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 60, damping: 14 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="card-glass p-8" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 60, damping: 14 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.1)' }}
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="2" width="28" height="28" rx="6" stroke="var(--accent-cyan)" strokeWidth="2" />
                <path d="M16 8L16 24M8 16L24 16" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="16" r="4" fill="var(--accent-cyan)" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Welcome Back</h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Sign in to your CyberSyntax account</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5"
            >
              <div className="badge-red w-full justify-center py-2.5 px-4 rounded-lg text-sm">{error}</div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mt-1.5"
                placeholder="you@example.com"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input mt-1.5"
                placeholder="••••••••"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 rounded-lg text-base"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign In"}
              </button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center mt-6 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium hover:underline" style={{ color: 'var(--accent-cyan)' }}>
              Sign up
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
