"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";

const titleWords = ["Cybersecurity", "Data Science", "Finance"];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
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
    { size: 600, color: "var(--accent-emerald)", x: 0.15, y: 0.25, delay: 0, opacity: 0.04 },
    { size: 500, color: "var(--accent-gold)", x: 0.85, y: 0.15, delay: 1.5, opacity: 0.035 },
    { size: 450, color: "var(--accent-rose)", x: 0.5, y: 0.75, delay: 3, opacity: 0.03 },
    { size: 350, color: "var(--accent-emerald)", x: 0.7, y: 0.55, delay: 0.5, opacity: 0.03 },
    { size: 400, color: "var(--accent-gold)", x: 0.25, y: 0.7, delay: 2, opacity: 0.025 },
  ];

  return (
    <div ref={heroRef} className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        {orbs.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, ${orb.color}15, transparent 70%)`,
              left: `${orb.x * 100}%`,
              top: `${orb.y * 100}%`,
              filter: 'blur(100px)',
            }}
            animate={{
              x: [0, (mousePos.x - 0.5) * 80, 0],
              y: [0, (mousePos.y - 0.5) * 50, 0],
            }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: orb.delay }}
          />
        ))}
      </motion.div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <svg className="w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="none">
          <defs>
            <pattern id="grid3" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--accent-emerald)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid3)" />
        </svg>
      </div>

      <Floating3DShapes mousePos={mousePos} />

      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: smoothOpacity }}>
        {Array.from({ length: 16 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 1.5,
              height: 50 + i * 14,
              background: `linear-gradient(to bottom, transparent, ${i % 2 === 0 ? "var(--accent-emerald)" : "var(--accent-gold)"}18, transparent)`,
              left: `${5 + i * 5.8}%`,
              top: `${8 + (i % 6) * 14}%`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              height: [50 + i * 14, 70 + i * 18, 50 + i * 14],
            }}
            transition={{ duration: 3 + i * 0.35, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
          />
        ))}
      </motion.div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
          className="flex items-center gap-3"
        >
          <CyberLogo />
          <span className="text-xl font-bold" style={{ background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-rose))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CyberSyntax
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
          className="flex items-center gap-3"
        >
          <Link href="/login" className="btn-outline px-5 py-2.5 rounded-lg text-sm">Login</Link>
          <Link href="/signup" className="btn-primary px-5 py-2.5 rounded-lg text-sm">Get Started</Link>
        </motion.div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 40, damping: 12, delay: 0.15 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)' }} />
              Now accepting applications
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 40, damping: 12, delay: 0.3 }}
          >
            <h1 className="text-5xl md:text-8xl font-bold mb-6 leading-[1.05] tracking-tight">
              Master{" "}
              <AnimatedGradientWords />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 14, delay: 0.5 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            A premium mentorship platform connecting aspiring professionals with industry experts.
            Hands-on research, guided courses, and real-world projects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 14, delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4 mb-32"
          >
            <Link href="/signup?role=student" className="btn-primary px-10 py-4 rounded-xl text-lg font-semibold relative group overflow-hidden">
              <span className="relative z-10">Join as Student</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link href="/signup?role=mentor" className="btn-outline px-10 py-4 rounded-xl text-lg font-semibold">
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 50, damping: 14 }}
            className="mt-32 w-full max-w-5xl"
          >
            <div className="glass-strong rounded-2xl p-10 glow-border">
              <div className="grid grid-cols-3 gap-8">
                {[
                  { label: "Expert Mentors", value: 50, suffix: "+", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
                  { label: "Active Students", value: 500, suffix: "+", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
                  { label: "Courses", value: 100, suffix: "+", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 80, damping: 12, delay: i * 0.12 + 0.1 }}
                    className="text-center"
                  >
                    <motion.div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.08)' }}
                    >
                      <svg className="w-5 h-5" style={{ color: 'var(--accent-emerald)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                      </svg>
                    </motion.div>
                    <CountUp value={stat.value} suffix={stat.suffix} delay={i * 0.12 + 0.1} />
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
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
    <span className="inline-block relative h-[1.15em] overflow-hidden px-3">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          className="block"
          style={{
            background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-rose))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          initial={{ opacity: 0, y: 50, rotateX: -40, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -50, rotateX: 40, filter: 'blur(4px)' }}
          transition={{ type: "spring", stiffness: 60, damping: 11 }}
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
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -10, y: x * 10 });
    cardRef.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => { setTilt({ x: 0, y: 0 }); setHovered(false); };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 12 } },
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="card p-6 text-left cursor-default group"
        style={{ perspective: 900, transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: hovered ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.04)',
            border: '1px solid rgba(16,185,129,0.1)',
            transition: 'background 0.3s ease',
          }}
          animate={hovered ? { scale: 1.1, rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.35 }}
        >
          {feature.icon}
        </motion.div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)', transform: 'translateZ(20px)' }}>{feature.title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', transform: 'translateZ(10px)' }}>{feature.desc}</p>
        {hovered && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(16,185,129,0.03), transparent)`,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

function CountUp({ value, suffix, delay }: { value: number; suffix: string; delay: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const step = Math.ceil(value / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold mb-2"
      style={{ background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
    >
      {count}{suffix}
    </motion.p>
  );
}

function Floating3DShapes({ mousePos }: { mousePos: { x: number; y: number } }) {
  const shapes = [
    { type: "triangle", size: 30, x: 0.08, y: 0.15, color: "var(--accent-emerald)", delay: 0 },
    { type: "diamond", size: 20, x: 0.92, y: 0.1, color: "var(--accent-gold)", delay: 1 },
    { type: "hexagon", size: 25, x: 0.12, y: 0.7, color: "var(--accent-rose)", delay: 2 },
    { type: "triangle", size: 22, x: 0.88, y: 0.75, color: "var(--accent-emerald)", delay: 0.5 },
    { type: "diamond", size: 18, x: 0.5, y: 0.05, color: "var(--accent-gold)", delay: 1.5 },
    { type: "hexagon", size: 28, x: 0.04, y: 0.4, color: "var(--accent-rose)", delay: 2.5 },
    { type: "triangle", size: 16, x: 0.96, y: 0.5, color: "var(--accent-emerald)", delay: 3 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape, i) => {
        const xOffset = (mousePos.x - 0.5) * 30;
        const yOffset = (mousePos.y - 0.5) * 20;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${shape.x * 100}%`,
              top: `${shape.y * 100}%`,
              width: shape.size,
              height: shape.size,
              opacity: 0.12,
            }}
            animate={{
              x: [0, xOffset, 0],
              y: [0, yOffset, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          >
            {shape.type === "triangle" && (
              <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 2L28 27H2L15 2Z" stroke={shape.color} strokeWidth="1" fill="none" />
              </svg>
            )}
            {shape.type === "diamond" && (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke={shape.color} strokeWidth="1" fill="none" />
              </svg>
            )}
            {shape.type === "hexagon" && (
              <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2L25 8.5V21.5L14 28L3 21.5V8.5L14 2Z" stroke={shape.color} strokeWidth="1" fill="none" />
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function CyberLogo() {
  return (
    <motion.svg
      width="34"
      height="34"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: [0, 0, 0, 0] }}
      whileHover={{ rotate: 90, scale: 1.1 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <defs>
        <linearGradient id="g" x1="4" y1="4" x2="28" y2="28">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="6" stroke="url(#g)" strokeWidth="2" />
      <path d="M16 8L16 24M8 16L24 16" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="4" fill="url(#g)" />
    </motion.svg>
  );
}

const features = [
  {
    title: "Expert Mentorship",
    desc: "Learn directly from industry professionals in cybersecurity, data science, and finance.",
    icon: (
      <svg className="w-5 h-5" style={{ color: 'var(--accent-emerald)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: "Research Opportunities",
    desc: "Get hands-on research experience with real-world projects and academic publications.",
    icon: (
      <svg className="w-5 h-5" style={{ color: 'var(--accent-emerald)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Structured Courses",
    desc: "Follow guided learning paths with video lessons, quizzes, and hands-on assignments.",
    icon: (
      <svg className="w-5 h-5" style={{ color: 'var(--accent-emerald)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];
