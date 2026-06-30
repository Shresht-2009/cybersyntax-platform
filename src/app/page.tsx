"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--bg-primary)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--accent-cyan)]/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-[var(--accent-purple)]/10 rounded-full blur-[140px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-40 left-1/3 w-64 h-64 bg-[var(--accent-magenta)]/10 rounded-full blur-[100px] animate-float" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <CyberLogo />
          <span className="text-xl font-bold text-gradient">CyberSyntax</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-outline px-5 py-2.5 rounded-lg text-sm">
            Login
          </Link>
          <Link href="/signup" className="btn-primary px-5 py-2.5 rounded-lg text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              Master{" "}
              <span className="text-gradient">Cybersecurity</span>,
              <br />
              <span className="text-gradient">Data Science</span> &{" "}
              <span className="text-gradient">Finance</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
              A mentorship platform connecting aspiring professionals with industry
              experts. Get hands-on experience, research opportunities, and
              guided learning paths.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mb-24"
          >
            <Link href="/signup?role=student" className="btn-primary px-8 py-3.5 rounded-xl text-lg font-semibold">
              Join as Student
            </Link>
            <Link href="/signup?role=mentor" className="btn-outline px-8 py-3.5 rounded-xl text-lg font-semibold">
              Become a Mentor
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="grid md:grid-cols-3 gap-6 w-full max-w-5xl"
          >
            {features.map((feature, i) => (
              <div key={i} className="card p-6 text-left hover:-translate-y-1 transition-all duration-200 cursor-default">
                <div className="w-11 h-11 rounded-xl bg-[var(--accent-cyan)]/10 flex items-center justify-center mb-4 ring-1 ring-[var(--accent-cyan)]/20">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function CyberLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="28" height="28" rx="6" stroke="url(#g)" strokeWidth="2" />
      <path d="M16 8L16 24M8 16L24 16" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="4" fill="url(#g)" />
      <defs>
        <linearGradient id="g" x1="4" y1="4" x2="28" y2="28">
          <stop stopColor="#00d4ff" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const features = [
  {
    title: "Expert Mentorship",
    desc: "Learn directly from industry professionals in cybersecurity, data science, and finance.",
    icon: <svg className="w-5 h-5 text-[var(--accent-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  },
  {
    title: "Research Opportunities",
    desc: "Get hands-on research experience with real-world projects and academic publications.",
    icon: <svg className="w-5 h-5 text-[var(--accent-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  },
  {
    title: "Structured Courses",
    desc: "Follow guided learning paths with video lessons, quizzes, and hands-on assignments.",
    icon: <svg className="w-5 h-5 text-[var(--accent-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  },
];
