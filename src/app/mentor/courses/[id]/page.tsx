"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [lessonType, setLessonType] = useState<"TEXT" | "VIDEO">("TEXT");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/mentor/courses/${id}`)
      .then((r) => r.json())
      .then(setCourse)
      .catch(() => {});
  }, [id]);

  const addLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/mentor/courses/${id}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        type: lessonType,
        content: lessonType === "TEXT" ? content : undefined,
        videoUrl: lessonType === "VIDEO" ? videoUrl : undefined,
        order: (course?.lessons?.length || 0) + 1,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setCourse((prev: any) => ({ ...prev, lessons: [...(prev?.lessons || []), data] }));
      setTitle("");
      setContent("");
      setVideoUrl("");
    }
    setLoading(false);
  };

  if (!course) {
    return <div className="text-center py-20 text-[#8888aa]">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold cyber-text-gradient mb-2">{course.title}</h1>
        <p className="text-[#8888aa]">{course.description}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Add Lesson</h2>
        <form onSubmit={addLesson} className="space-y-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setLessonType("TEXT")}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${lessonType === "TEXT" ? "cyber-btn" : "bg-white/5"}`}>
              Text Lesson
            </button>
            <button type="button" onClick={() => setLessonType("VIDEO")}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${lessonType === "VIDEO" ? "cyber-btn" : "bg-white/5"}`}>
              Video Lesson
            </button>
          </div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="cyber-input w-full px-4 py-2.5 rounded-lg" placeholder="Lesson title" required />
          {lessonType === "TEXT" ? (
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              className="cyber-input w-full px-4 py-2.5 rounded-lg min-h-[200px] resize-y" placeholder="Lesson content..." required />
          ) : (
            <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
              className="cyber-input w-full px-4 py-2.5 rounded-lg" placeholder="YouTube/Vimeo URL or direct video URL" required />
          )}
          <button type="submit" disabled={loading} className="cyber-btn px-6 py-2.5 rounded-lg">
            {loading ? "Adding..." : "Add Lesson"}
          </button>
        </form>
      </motion.div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Lessons ({course.lessons?.length || 0})</h2>
        {(!course.lessons || course.lessons.length === 0) && (
          <p className="text-[#8888aa] text-sm">No lessons yet. Add your first lesson above.</p>
        )}
        {course.lessons?.map((lesson: any, i: number) => (
          <motion.div key={lesson.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-xs text-cyan-400 font-semibold">
              {lesson.order}
            </div>
            <div className="flex-1">
              <p className="font-medium">{lesson.title}</p>
              <p className="text-xs text-[#555]">{lesson.type === "VIDEO" ? "📹 Video" : "📝 Text"}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
