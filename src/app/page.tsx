"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence, type MotionValue } from "framer-motion";
import Link from "next/link";
import { ShieldIcon, ChartIcon, GraphIcon } from "@/components/shared/AnimatedIcons";

const titleWords = ["Cybersecurity", "Data Science", "Finance"];

const subjects = [
  {
    id: 0, title: "Cybersecurity", color: "var(--accent-emerald)", colorName: "emerald",
    gradient: "linear-gradient(180deg, rgba(16,185,129,0.06), transparent 70%)",
    borderColor: "rgba(16,185,129,0.15)", btnStyle: { background: "var(--accent-emerald)" },
    iconLarge: <ShieldIcon size={160} color="var(--accent-emerald)" />,
    cta: "/signup?role=student",
    paragraphs: [
      "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.",
      "Our cybersecurity track covers network defense, ethical hacking, threat intelligence, and incident response. You will learn how to identify vulnerabilities, conduct penetration tests, and implement security measures that protect critical infrastructure.",
      "Through hands-on labs with real-world attack simulations and capture-the-flag challenges, you will develop the practical skills needed to defend against evolving cyber threats. Topics include cryptography, reverse engineering, malware analysis, and security operations center (SOC) workflows.",
    ],
  },
  {
    id: 1, title: "Data Science", color: "var(--accent-gold)", colorName: "gold",
    gradient: "linear-gradient(180deg, rgba(245,158,11,0.06), transparent 70%)",
    borderColor: "rgba(245,158,11,0.15)", btnStyle: { background: "var(--accent-gold)" },
    iconLarge: <ChartIcon size={160} color="var(--accent-gold)" />,
    cta: "/signup?role=student",
    paragraphs: [
      "Data science is an interdisciplinary field that uses scientific methods, algorithms, and systems to extract knowledge and insights from structured and unstructured data. It combines statistics, computer science, and domain expertise to solve complex problems.",
      "Our data science curriculum covers machine learning, statistical modeling, data pipelines, and AI systems. You will work with Python, R, and TensorFlow to build predictive models, create data visualizations, and deploy machine learning solutions.",
      "From data cleaning and exploratory analysis to deep learning and natural language processing, you will gain the skills to transform raw data into actionable intelligence. Real-world datasets and industry projects ensure you graduate with a portfolio that demonstrates your expertise.",
    ],
  },
  {
    id: 2, title: "Finance", color: "var(--accent-rose)", colorName: "rose",
    gradient: "linear-gradient(180deg, rgba(244,63,94,0.06), transparent 70%)",
    borderColor: "rgba(244,63,94,0.15)", btnStyle: { background: "var(--accent-rose)" },
    iconLarge: <GraphIcon size={160} color="var(--accent-rose)" />,
    cta: "/signup?role=student",
    paragraphs: [
      "Finance is the science of managing money, investments, and financial systems. It encompasses everything from personal financial planning to complex quantitative trading strategies used by hedge funds and investment banks worldwide.",
      "Our finance track covers quantitative analysis, risk modeling, market microstructure, and algorithmic trading. You will learn to analyze financial data, build pricing models, and develop trading algorithms using Python and statistical methods.",
      "With access to real financial data and trading simulations, you will develop strategies grounded in mathematical finance. Topics include portfolio optimization, options pricing, time series analysis, and machine learning applications in finance.",
    ],
  },
];

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
    { size: 600, color: "var(--accent-emerald)", x: 0.15, y: 0.25, delay: 0 },
    { size: 500, color: "var(--accent-gold)", x: 0.85, y: 0.15, delay: 1.5 },
    { size: 450, color: "var(--accent-rose)", x: 0.5, y: 0.75, delay: 3 },
    { size: 350, color: "var(--accent-emerald)", x: 0.7, y: 0.55, delay: 0.5 },
    { size: 400, color: "var(--accent-gold)", x: 0.25, y: 0.7, delay: 2 },
  ];

  return (
    <div ref={heroRef} className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        {orbs.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size, height: orb.size,
              background: `radial-gradient(circle, ${orb.color}12, transparent 70%)`,
              left: `${orb.x * 100}%`, top: `${orb.y * 100}%`,
              filter: 'blur(100px)',
            }}
            animate={{ x: [0, (mousePos.x - 0.5) * 80, 0], y: [0, (mousePos.y - 0.5) * 50, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: orb.delay }}
          />
        ))}
      </motion.div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
        <svg className="w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="none">
          <defs>
            <pattern id="grid5" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--accent-emerald)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid5)" />
        </svg>
      </div>

      <Floating3DShapes mousePos={mousePos} />

      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: smoothOpacity }}>
        {Array.from({ length: 16 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 1.5, height: 50 + i * 14,
              background: `linear-gradient(to bottom, transparent, ${i % 2 === 0 ? "var(--accent-emerald)" : "var(--accent-gold)"}15, transparent)`,
              left: `${5 + i * 5.8}%`, top: `${8 + (i % 6) * 14}%`,
            }}
            animate={{ opacity: [0.1, 0.3, 0.1], height: [50 + i * 14, 70 + i * 18, 50 + i * 14] }}
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
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-emerald)', boxShadow: '0 0 8px var(--accent-emerald)' }} />
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

        </div>
      </main>

      {/* Scroll-driven subject showcase — one continuous 300vh experience */}
      <ScrollSubjectShowcase />

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 50, damping: 14 }}
            className="w-full max-w-5xl"
          >
            <div className="glass-strong rounded-2xl p-10 glow-border">
              <div className="grid grid-cols-3 gap-8">
                {[
                  { label: "Expert Mentors", value: 50, suffix: "+", iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
                  { label: "Active Students", value: 500, suffix: "+", iconPath: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
                  { label: "Courses", value: 100, suffix: "+", iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
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
                      style={{ background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.06)' }}
                    >
                      <svg className="w-5 h-5" style={{ color: 'var(--accent-emerald)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.iconPath} />
                      </svg>
                    </motion.div>
                    <CountUp value={stat.value} suffix={stat.suffix} delay={i * 0.12 + 0.1} />
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 50, damping: 14 }}
            className="w-full max-w-xl mx-auto mt-32 mb-16 text-center"
          >
            <div className="glass rounded-2xl p-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.06)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--accent-emerald)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gradient">Have Questions?</h2>
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                Reach out to us anytime. We are here to help you find the right path.
              </p>
              <a href="mailto:cybersyntaxhub@gmail.com"
                className="text-lg font-semibold hover:underline inline-flex items-center gap-2"
                style={{ color: 'var(--accent-emerald)' }}>
                cybersyntaxhub@gmail.com
                <motion.svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </motion.svg>
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function ScrollSubjectShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const subjectIndexMotion = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 0, 1, 2]);
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(subjectIndexMotion, "change", (v) => setActiveIndex(Math.round(v)));

  return (
    <div ref={containerRef} className="relative" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center" style={{ background: 'var(--bg-deep)' }}>
        {subjects.map((s, i) => (
          <ScrollRevealSection key={s.id} subject={s} index={i} scrollYProgress={scrollYProgress} />
        ))}

        {/* Progress dots */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: activeIndex === i ? subjects[i].color : 'rgba(255,255,255,0.08)',
                boxShadow: activeIndex === i ? `0 0 12px ${subjects[i].color}` : 'none',
              }}
              animate={{ scale: activeIndex === i ? 1.4 : 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Scroll reveal section for one subject ── */
function ScrollRevealSection({ subject, index, scrollYProgress }: {
  subject: typeof subjects[0]; index: number; scrollYProgress: MotionValue<number>;
}) {
  const start = index * 0.33;
  const end = (index + 1) * 0.33;

  const localP = useTransform(scrollYProgress, [start, end], [0, 1]);

  const bgOpacity = useTransform(localP, [0, 0.06], [0, 0.5]);
  const iconS = useTransform(localP, [0.04, 0.18], [0.3, 1]);
  const iconO = useTransform(localP, [0.04, 0.12], [0, 1]);
  const iconY = useTransform(localP, [0.04, 0.18], [40, 0]);
  const titleO = useTransform(localP, [0.12, 0.25], [0, 1]);
  const titleY2 = useTransform(localP, [0.12, 0.25], [30, 0]);
  const bubbleO = useTransform(localP, [0.2, 0.35], [0, 1]);
  const bubbleX2 = useTransform(localP, [0.2, 0.38], [60, 0]);
  const ctaO = useTransform(localP, [0.32, 0.45], [0, 1]);

  const bgRotate = useTransform(localP, [0, 1], [0, 360]);
  const iconRotate = useTransform(localP, [0, 1], [0, 10]);
  const dsBgO = useTransform(localP, [0, 0.1], [0, 1]);
  const finBgO = useTransform(localP, [0, 0.08], [0, 0.5]);

  const sectionOpacity = useTransform(
    scrollYProgress,
    [start - 0.05, start + 0.02, end - 0.02, end + 0.05],
    [0, 1, 1, 0],
  );

  // Pre-compute all background motion values
  const hexData = useMemo(() => {
    const items = [];
    for (let i = 0; i < 10; i++) {
      items.push({
        left: `${5 + (i % 5) * 20}%`,
        top: `${10 + Math.floor(i / 5) * 50}%`,
      });
    }
    return items;
  }, []);

  const nodeData = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      left: `${10 + i * 18}%`,
      top: `${20 + (i % 2) * 50}%`,
    }));
  }, []);

  const dsBarData = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      left: `${3 + i * 6}%`,
      width: `${6 + (i % 3) * 3}px`,
    }));
  }, []);

  const dsCharData = useMemo(() => ["Σ", "π", "∂", "λ", "μ", "σ", "Δ", "∫", "∞", "√"], []);

  const finCandleData = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      left: `${5 + i * 9}%`,
      bottom: `${20 + Math.floor(i / 2) * 22}%`,
      up: i % 2 === 0,
    }));
  }, []);

  return (
    <motion.div
      style={{ opacity: sectionOpacity }}
      className={`absolute inset-0 ${index !== 0 ? "pointer-events-none" : ""}`}
    >
      <div className="absolute inset-0 pointer-events-none">
        {/* Cybersecurity background */}
        {subject.id === 0 && (
          <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0">
            <motion.div className="absolute inset-0 opacity-[0.025]" style={{ rotate: bgRotate }}>
              <svg className="w-full h-full" viewBox="0 0 800 800" preserveAspectRatio="none">
                <defs><pattern id={`hx-${index}`} width="50" height="86.6" patternUnits="userSpaceOnUse">
                  <path d="M25 0L50 14.43V43.3L25 57.74L0 43.3V14.43Z" fill="none" stroke="var(--accent-emerald)" strokeWidth="0.3" />
                  <path d="M25 86.6L50 72.17V43.3L25 57.74L0 43.3V72.17Z" fill="none" stroke="var(--accent-emerald)" strokeWidth="0.3" />
                </pattern></defs>
                <rect width="100%" height="100%" fill={`url(#hx-${index})`} />
              </svg>
            </motion.div>
            {hexData.map((d, i) => (
              <div key={i} className="absolute" style={{ left: d.left, top: d.top }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" strokeWidth="0.5" opacity="0.5">
                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" />
                </svg>
              </div>
            ))}
            {nodeData.map((d, i) => (
              <div key={`nd-${i}`} className="absolute w-2 h-2 rounded-full"
                style={{ left: d.left, top: d.top, background: 'var(--accent-emerald)', boxShadow: '0 0 16px var(--accent-emerald)', opacity: 0.2 }} />
            ))}
          </motion.div>
        )}

        {/* Data Science background */}
        {subject.id === 1 && (
          <motion.div style={{ opacity: dsBgO }} className="absolute inset-0">
            <div className="absolute inset-0 opacity-[0.018]">
              <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
                <defs><pattern id={`dt-${index}`} width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="1" fill="var(--accent-gold)" /></pattern></defs>
                <rect width="100%" height="100%" fill={`url(#dt-${index})`} />
              </svg>
            </div>
            {dsBarData.map((d, i) => (
              <div key={i} className="absolute bottom-0" style={{
                left: d.left, width: d.width,
                borderRadius: '3px 3px 0 0',
                background: 'linear-gradient(to top, rgba(245,158,11,0.02), rgba(245,158,11,0.08))',
                borderTop: '1px solid rgba(245,158,11,0.05)',
                height: `${20 + i * 3}px`, opacity: 0.4,
              }} />
            ))}
            {dsCharData.map((ch, i) => (
              <div key={`ch-${i}`} className="absolute text-base font-mono font-bold"
                style={{ color: 'rgba(245,158,11,0.03)', left: `${5 + i * 9}%`, opacity: 0.08 }}>{ch}</div>
            ))}
          </motion.div>
        )}

        {/* Finance background */}
        {subject.id === 2 && (
          <motion.div style={{ opacity: finBgO }} className="absolute inset-0">
            <div className="absolute inset-0 opacity-[0.018]">
              <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="none">
                <defs><pattern id={`fg-${index}`} width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--accent-rose)" strokeWidth="0.2" /></pattern></defs>
                <rect width="100%" height="100%" fill={`url(#fg-${index})`} />
              </svg>
            </div>
            {finCandleData.map((d, i) => (
              <div key={i} className="absolute" style={{
                left: d.left, bottom: d.bottom, width: 5,
                background: d.up
                  ? 'linear-gradient(to top, rgba(244,63,94,0.02), rgba(244,63,94,0.06))'
                  : 'linear-gradient(to bottom, rgba(244,63,94,0.02), rgba(244,63,94,0.06))',
                borderLeft: '1px solid rgba(244,63,94,0.03)', borderRight: '1px solid rgba(244,63,94,0.03)',
                height: `${15 + i * 3}px`, opacity: 0.3,
              }} />
            ))}
            <div className="absolute bottom-[20%] left-[5%] right-[5%] h-[20%] opacity-[0.03]">
              <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
                <path d="M0,60 C20,55 40,65 60,50 C80,35 100,45 120,30 C140,15 160,25 180,20 C200,10 220,30 240,25 C260,15 280,35 300,28 C320,18 340,38 360,32 C380,22 400,35 400,35"
                  fill="none" stroke="var(--accent-rose)" strokeWidth="0.8" />
              </svg>
            </div>
          </motion.div>
        )}
      </div>

      <div className="relative z-10 w-full h-full flex items-center">
        <div className={`w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-16`}>
          <motion.div
            style={{ scale: iconS, opacity: iconO, y: iconY }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-[2rem] flex items-center justify-center relative"
              style={{
                background: `linear-gradient(135deg, ${subject.color}12, ${subject.color}06)`,
                border: `1px solid ${subject.borderColor}`,
                boxShadow: `0 0 100px ${subject.color}06`,
              }}
            >
              <motion.div style={{ rotate: iconRotate }}>
                {subject.id === 0 && <ShieldIcon size={140} color={subject.color} />}
                {subject.id === 1 && <ChartIcon size={140} color={subject.color} />}
                {subject.id === 2 && <GraphIcon size={140} color={subject.color} />}
              </motion.div>
            </div>
          </motion.div>

          <div className="flex-1 flex flex-col items-start gap-5">
            <motion.h2
              style={{ opacity: titleO, y: titleY2 }}
              className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]"
            >
              <span style={{
                background: `linear-gradient(135deg, ${subject.color}, var(--text-primary) 70%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {subject.title}
              </span>
            </motion.h2>

            <motion.div
              style={{ opacity: bubbleO, x: bubbleX2 }}
              className="relative max-w-sm"
            >
              <div className="glass rounded-2xl p-5" style={{
                border: `1px solid ${subject.borderColor}`,
                boxShadow: `0 4px 30px ${subject.color}06`,
              }}>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {subject.id === 0 && "Master network defense, ethical hacking, incident response, and threat intelligence through hands-on labs and real-world attack simulations."}
                  {subject.id === 1 && "Build predictive models, analyze real datasets, and deploy ML solutions using Python, TensorFlow, and industry-standard tools."}
                  {subject.id === 2 && "Learn quantitative analysis, algorithmic trading, and risk modeling with real financial data and market simulations."}
                </p>
              </div>
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45" style={{
                background: 'var(--glass-bg)',
                borderLeft: `1px solid ${subject.borderColor}`,
                borderBottom: `1px solid ${subject.borderColor}`,
                backdropFilter: 'blur(24px)',
              }} />
            </motion.div>

            <motion.div style={{ opacity: ctaO }}>
              <Link href={subject.cta}
                className="btn-primary px-8 py-3.5 rounded-xl text-base font-semibold relative group overflow-hidden ripple-btn inline-block"
                style={subject.btnStyle as React.CSSProperties}
              >
                <span className="relative z-10">Explore {subject.title}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedGradientWords() {
  const [currentWord, setCurrentWord] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setCurrentWord((prev) => (prev + 1) % titleWords.length), 3000);
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
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}
          initial={{ opacity: 0, y: 50, rotateX: -40, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -50, rotateX: 40, filter: 'blur(6px)' }}
          transition={{ type: "spring", stiffness: 60, damping: 11 }}
        >
          {titleWords[currentWord]}
        </motion.span>
      </AnimatePresence>
    </span>
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
            if (start >= value) { setCount(value); clearInterval(timer); }
            else setCount(start);
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
      ref={ref} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
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
            style={{ left: `${shape.x * 100}%`, top: `${shape.y * 100}%`, width: shape.size, height: shape.size, opacity: 0.1 }}
            animate={{ x: [0, xOffset, 0], y: [0, yOffset, 0], rotate: [0, 180, 360], scale: [1, 1.15, 1] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut", delay: shape.delay }}
          >
            {shape.type === "triangle" && <svg viewBox="0 0 30 30" fill="none"><path d="M15 2L28 27H2L15 2Z" stroke={shape.color} strokeWidth="1" fill="none" /></svg>}
            {shape.type === "diamond" && <svg viewBox="0 0 24 24" fill="none"><path d="M12 2L22 12L12 22L2 12L12 2Z" stroke={shape.color} strokeWidth="1" fill="none" /></svg>}
            {shape.type === "hexagon" && <svg viewBox="0 0 28 28" fill="none"><path d="M14 2L25 8.5V21.5L14 28L3 21.5V8.5L14 2Z" stroke={shape.color} strokeWidth="1" fill="none" /></svg>}
          </motion.div>
        );
      })}
    </div>
  );
}

function CyberLogo() {
  return (
    <motion.svg
      width="34" height="34" viewBox="0 0 32 32" fill="none"
      whileHover={{ rotate: 90, scale: 1.1 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <defs>
        <linearGradient id="gl" x1="4" y1="4" x2="28" y2="28">
          <stop stopColor="#10b981" /><stop offset="1" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="6" stroke="url(#gl)" strokeWidth="2" />
      <path d="M16 8L16 24M8 16L24 16" stroke="url(#gl)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="4" fill="url(#gl)" />
    </motion.svg>
  );
}
