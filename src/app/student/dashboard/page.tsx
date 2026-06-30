"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="skeleton w-8 h-8 rounded-full" />
        <div className="skeleton w-48 h-4" />
      </div>
    </div>
  );

  if (data.status === "PENDING") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Application Pending</h2>
          <p className="text-[var(--text-secondary)] text-sm">Your application is under review.</p>
        </div>
      </div>
    );
  }

  if (data.status === "REJECTED") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Application Not Accepted</h2>
          <p className="text-[var(--text-secondary)] text-sm">Unfortunately, your application was not accepted at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-header">
          <h1>
            Welcome, <span className="text-gradient">{(session?.user as any)?.name}</span>
          </h1>
          <p>Your learning dashboard.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/student/courses" className="stat-card block">
          <CountUp value={data.courseCount || 0} suffix="" />
          <p className="text-sm text-[var(--text-secondary)]">Active Courses</p>
        </Link>
        <Link href="/student/assignments" className="stat-card block">
          <CountUp value={data.pendingAssignments || 0} suffix="" />
          <p className="text-sm text-[var(--text-secondary)]">Pending Assignments</p>
        </Link>
        <Link href="/student/results" className="stat-card block">
          <CountUp value={data.quizCount || 0} suffix="" />
          <p className="text-sm text-[var(--text-secondary)]">Quizzes Taken</p>
        </Link>
      </motion.div>

      {data.announcements?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-semibold mb-4">Latest Announcements</h2>
          <div className="space-y-3">
            {data.announcements.slice(0, 3).map((ann: any, i: number) => (
              <motion.div key={ann.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="card p-4"
                whileHover={{ x: 4 }}
              >
                <h3 className="font-semibold">{ann.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{ann.content}</p>
                <p className="text-xs text-[var(--text-muted)] mt-2">{new Date(ann.createdAt).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
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
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="text-2xl font-bold text-gradient"
    >
      {count}{suffix}
    </motion.p>
  );
}
