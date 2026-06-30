"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/mentor/courses")
      .then((r) => r.json())
      .then(setCourses)
      .catch(() => {});
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/mentor/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (res.ok) {
      const data = await res.json();
      setCourses((prev) => [data, ...prev]);
      setTitle("");
      setDescription("");
      setShowForm(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold cyber-text-gradient mb-2">Courses</h1>
          <p className="text-[#8888aa]">Create and manage your courses.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="cyber-btn px-4 py-2 rounded-lg text-sm">
          {showForm ? "Cancel" : "+ New Course"}
        </button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="cyber-input w-full px-4 py-2.5 rounded-lg" placeholder="Course title" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="cyber-input w-full px-4 py-2.5 rounded-lg min-h-[80px] resize-y" placeholder="Course description..." />
            <button type="submit" disabled={loading} className="cyber-btn px-6 py-2.5 rounded-lg">{loading ? "Creating..." : "Create Course"}</button>
          </form>
        </motion.div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-12 text-[#8888aa]">No courses yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {courses.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/mentor/courses/${course.id}`} className="glass rounded-2xl p-5 block glass-hover">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                <p className="text-sm text-[#8888aa] mb-2">{course.description || "No description"}</p>
                <div className="flex gap-3 text-xs text-[#555]">
                  <span>{course.lessons?.length || 0} lessons</span>
                  <span>{course.quizzes?.length || 0} quizzes</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
