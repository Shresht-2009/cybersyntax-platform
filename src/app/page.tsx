"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <CyberIcon />
          <span className="text-xl font-bold cyber-text-gradient">CyberSyntax</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="cyber-btn-outline px-4 py-2 rounded-lg text-sm">
            Login
          </Link>
          <Link href="/signup" className="cyber-btn px-4 py-2 rounded-lg text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Master{" "}
              <span className="cyber-text-gradient">Cybersecurity</span>,
              <br />
              <span className="cyber-text-gradient">Data Science</span> &{" "}
              <span className="cyber-text-gradient">Finance</span>
            </h1>
            <p className="text-lg text-[#8888aa] max-w-2xl mx-auto mb-10">
              A mentorship platform connecting aspiring professionals with industry
              experts. Get hands-on experience, research opportunities, and
              guided learning paths.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-4 mb-20"
          >
            <Link href="/signup?role=student" className="cyber-btn px-8 py-3 rounded-xl text-lg">
              Join as Student
            </Link>
            <Link href="/signup?role=mentor" className="cyber-btn-outline px-8 py-3 rounded-xl text-lg">
              Become a Mentor
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 w-full max-w-5xl"
          >
            {features.map((feature, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-left glass-hover">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[#8888aa]">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function CyberIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="28" height="28" rx="6" stroke="url(#g)" strokeWidth="2" />
      <path d="M16 8L16 24M8 16L24 16" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="4" fill="url(#g)" />
      <defs>
        <linearGradient id="g" x1="4" y1="4" x2="28" y2="28">
          <stop stopColor="#00f0ff" />
          <stop offset="1" stopColor="#ff00aa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const features = [
  {
    title: "Expert Mentorship",
    desc: "Learn directly from industry professionals in cybersecurity, data science, and finance.",
    icon: <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  },
  {
    title: "Research Opportunities",
    desc: "Get hands-on research experience with real-world projects and academic publications.",
    icon: <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  },
  {
    title: "Structured Courses",
    desc: "Follow guided learning paths with video lessons, quizzes, and hands-on assignments.",
    icon: <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  },
];
