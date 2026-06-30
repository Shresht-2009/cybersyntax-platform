"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";

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
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="cyber-text-gradient">{(session?.user as any)?.name}</span>
        </h1>
        <p className="text-[#8888aa]">Here&apos;s what&apos;s happening with your mentorship program.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Active Students", value: stats?.studentCount ?? 0, icon: "👥", href: "/mentor/students" },
          { label: "Pending Applications", value: stats?.pendingApps ?? 0, icon: "📋", href: "/mentor/applications" },
          { label: "Announcements", value: stats?.announcementCount ?? 0, icon: "📢", href: "/mentor/announcements" },
          { label: "Balance", value: `$${stats?.totalFunds ?? 0}`, icon: "💰", href: "/mentor/finance" },
        ].map((card, i) => (
          <Link key={i} href={card.href}>
            <div className="glass rounded-2xl p-5 glass-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-sm text-[#8888aa]">{card.label}</p>
            </div>
          </Link>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "New Announcement", href: "/mentor/announcements", icon: "📢" },
            { label: "Review Applications", href: "/mentor/applications", icon: "📋" },
            { label: "Create Assignment", href: "/mentor/assignments", icon: "📝" },
            { label: "Manage Courses", href: "/mentor/courses", icon: "📚" },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-cyan-500/10 transition-all"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
