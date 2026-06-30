"use client";

import { useEffect, useState } from "react";
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

  if (!data) return <div className="text-center py-20 text-[#8888aa]">Loading...</div>;

  if (data.status === "PENDING") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Application Pending</h2>
          <p className="text-[#8888aa] text-sm">Your application is under review.</p>
        </div>
      </div>
    );
  }

  if (data.status === "REJECTED") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Application Not Accepted</h2>
          <p className="text-[#8888aa] text-sm">Unfortunately, your application was not accepted at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">
          Welcome, <span className="cyber-text-gradient">{(session?.user as any)?.name}</span>
        </h1>
        <p className="text-[#8888aa]">Your learning dashboard.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/student/courses" className="glass rounded-2xl p-5 glass-hover">
          <p className="text-2xl font-bold">{data.courseCount || 0}</p>
          <p className="text-sm text-[#8888aa]">Active Courses</p>
        </Link>
        <Link href="/student/assignments" className="glass rounded-2xl p-5 glass-hover">
          <p className="text-2xl font-bold">{data.pendingAssignments || 0}</p>
          <p className="text-sm text-[#8888aa]">Pending Assignments</p>
        </Link>
        <Link href="/student/results" className="glass rounded-2xl p-5 glass-hover">
          <p className="text-2xl font-bold">{data.quizCount || 0}</p>
          <p className="text-sm text-[#8888aa]">Quizzes Taken</p>
        </Link>
      </motion.div>

      {data.announcements?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-semibold mb-4">Latest Announcements</h2>
          <div className="space-y-3">
            {data.announcements.slice(0, 3).map((ann: any) => (
              <div key={ann.id} className="glass rounded-xl p-4">
                <h3 className="font-semibold">{ann.title}</h3>
                <p className="text-sm text-[#8888aa]">{ann.content}</p>
                <p className="text-xs text-[#555] mt-2">{new Date(ann.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
