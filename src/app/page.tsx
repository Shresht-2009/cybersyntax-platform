"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";

const titleWords = ["Cybersecurity", "Data Science", "Finance"];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const smoothOpacity = useSpring(opacity, { stiffness: 60, damping: 20 });

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const orbs = [
    { size: 500, color: "var(--accent-cyan)", x: 0.2, y: 0.3, delay: 0, speed: 0.03 },
    { size: 400, color: "var(--accent-purple)", x: 0.8, y: 0.2, delay: 1, speed: 0.04 },
    { size: 350, color: "var(--accent-magenta)", x: 0.5, y: 0.7, delay: 2, speed: 0.02 },
    { size: 250, color: "var(--accent-cyan)", x: 0.7, y: 0.6, delay: 0.5, speed: 0.05 },
    { size: 300, color: "var(--accent-purple)", x: 0.3, y: 0.8, delay: 1.5, speed: 0.035 },
  ];

  return (
    <div ref={heroRef} className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        {orbs.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-[120px]"
            style={{
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, ${orb.color}15, transparent 70%)`,
              left: `${orb.x * 100}%`,
              top: `${orb.y * 100}%`,
            }}
            animate={{
              x: [0, (mousePos.x - 0.5) * 60, 0],
              y: [0, (mousePos.y - 0.5) * 40, 0],
            }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: orb.delay }}
          />
        ))}
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-[0.015]" viewBox="0 0 1000 800" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--accent-cyan)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: smoothOpacity }}>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 2,
              height: 60 + i * 12,
              background: `linear-gradient(to bottom, transparent, ${i % 2 === 0 ? "var(--accent-cyan)" : "var(--accent-purple)"}30, transparent)`,
              left: `${8 + i * 8}%`,
              top: `${10 + (i % 5) * 15}%`,
            }}
            animate={{
              opacity: [0.15, 0.4, 0.15],
              height: [60 + i * 12, 80 + i * 16, 60 + i * 12],
            }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          />
        ))}
      </motion.div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 80, damping: 14 }} className="flex items-center gap-3">
          <CyberLogo />
          <span className="text-xl font-bold text-gradient">CyberSyntax</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 80, damping: 14 }} className="flex items-center gap-3">
          <Link href="/login" className="btn-outline px-5 py-2.5 rounded-lg text-sm">Login</Link>
          <Link href="/signup" className="btn-primary px-5 py-2.5 rounded-lg text-sm">Get Started</Link>
        </motion.div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 50, damping: 14, delay: 0.2 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                  Master{" "}
                  <AnimatedGradientWords />
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.5 }}
                className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                A mentorship platform connecting aspiring professionals with industry experts.
                Get hands-on experience, research opportunities, and guided learning paths.
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 mb-28"
          >
            <Link href="/signup?role=student" className="btn-primary px-8 py-3.5 rounded-xl text-lg font-semibold">
              Join as Student
            </Link>
            <Link href="/signup?role=mentor" className="btn-outline px-8 py-3.5 rounded-xl text-lg font-semibold">
              Become a Mentor
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } } }}
            className="grid md:grid-cols-3 gap-6 w-full max-w-5xl"
          >
            {features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} mousePos={mousePos} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 60, damping: 14 }}
            className="mt-32 w-full max-w-5xl"
          >
            <div className="grid grid-cols-3 gap-8 p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
              {[
                { label: "Expert Mentors", value: "50+" },
                { label: "Active Students", value: "500+" },
                { label: "Courses", value: "100+" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 80, damping: 12, delay: i * 0.15 }}
                  className="text-center"
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-gradient mb-2"
                  >
                    {stat.value}
                  </motion.p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function AnimatedGradientWords() {
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % titleWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block relative h-[1.1em] overflow-hidden px-2">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          className="block text-gradient"
          initial={{ opacity: 0, y: 40, rotateX: -30 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -40, rotateX: 30 }}
          transition={{ type: "spring", stiffness: 70, damping: 12 }}
        >
          {titleWords[currentWord]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FeatureCard({ feature, index, mousePos }: { feature: typeof features[0]; index: number; mousePos: { x: number; y: number } }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: y * -8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 12 } },
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX: tilt.y, rotateY: tilt.x }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        className="card p-6 text-left cursor-default group"
        style={{ perspective: 800 }}
      >
        <motion.div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(var(--accent-cyan-rgb), 0.08)', border: '1px solid rgba(var(--accent-cyan-rgb), 0.12)' }}
          whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
        >
          {feature.icon}
        </motion.div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(var(--accent-cyan-rgb), 0.03), transparent)`,
          }}
        />
      </motion.div>
    </motion.div>
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
    icon: <svg className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  },
  {
    title: "Research Opportunities",
    desc: "Get hands-on research experience with real-world projects and academic publications.",
    icon: <svg className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  },
  {
    title: "Structured Courses",
    desc: "Follow guided learning paths with video lessons, quizzes, and hands-on assignments.",
    icon: <svg className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  },
];
