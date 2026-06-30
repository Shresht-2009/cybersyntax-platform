"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IconUsers, IconClipboard, IconMegaphone, IconDollar, IconPencil, IconBookOpen } from "@/components/shared/Icons";

const statCards = [
  { label: "Active Students", key: "studentCount" as const, icon: IconUsers, href: "/mentor/students", format: (v: any) => v ?? 0, isNumber: true },
  { label: "Pending Applications", key: "pendingApps" as const, icon: IconClipboard, href: "/mentor/applications", format: (v: any) => v ?? 0, isNumber: true },
  { label: "Announcements", key: "announcementCount" as const, icon: IconMegaphone, href: "/mentor/announcements", format: (v: any) => v ?? 0, isNumber: true },
  { label: "Balance", key: "totalFunds" as const, icon: IconDollar, href: "/mentor/finance", format: (v: any) => `$${(v ?? 0).toFixed(0)}`, isNumber: false },
];

const quickActions = [
  { label: "New Announcement", href: "/mentor/announcements", icon: IconMegaphone },
  { label: "Review Applications", href: "/mentor/applications", icon: IconClipboard },
  { label: "Create Assignment", href: "/mentor/assignments", icon: IconPencil },
  { label: "Manage Courses", href: "/mentor/courses", icon: IconBookOpen },
];

export default function MentorDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/mentor/dashboard")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 14 }}
        className="page-header"
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Welcome back, <span className="text-gradient">{(session?.user as any)?.name}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Here&apos;s what&apos;s happening with your mentorship program.</p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 80, damping: 12 } },
            }}
          >
            <Link href={card.href}>
              <div className="stat-card">
                <div className="flex items-center justify-between mb-3">
                  <card.icon />
                </div>
                {card.isNumber ? (
                  <CountUp value={card.format(stats?.[card.key]) as number} />
                ) : (
                  <motion.p
                    className="text-2xl font-bold text-gradient"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {card.format(stats?.[card.key])}
                  </motion.p>
                )}
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{card.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 70, damping: 12 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
            >
              <Link
                href={action.href}
                className="flex flex-col items-center gap-3 p-5 rounded-xl transition-all"
                style={{ background: 'rgba(var(--accent-emerald-rgb), 0.04)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(var(--accent-emerald-rgb), 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(var(--accent-emerald-rgb), 0.04)'}
              >
                <action.icon />
                <span className="text-sm text-center font-medium" style={{ color: 'var(--text-secondary)' }}>{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function CountUp({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1500;
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
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-2xl font-bold text-gradient"
    >
      {count}
    </motion.p>
  );
}
