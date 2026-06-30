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
  const [publishMsg, setPublishMsg] = useState("");

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

  const handlePublish = async () => {
    const res = await fetch(`/api/mentor/courses/${id}/publish`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setCourse((prev: any) => ({ ...prev, status: data.status }));
      setPublishMsg("Course published successfully!");
      setTimeout(() => setPublishMsg(""), 3000);
    }
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="skeleton h-8 w-48 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">{course.title}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{course.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`badge ${course.status === 'PUBLISHED' ? 'badge-cyan' : 'badge-yellow'}`}>
              {course.status || "DRAFT"}
            </span>
            {course.status === "DRAFT" && (
              <button onClick={handlePublish} className="btn-primary px-4 py-1.5 text-sm">
                Publish
              </button>
            )}
          </div>
          {publishMsg && <p className="text-sm mt-2" style={{ color: 'var(--accent-green)' }}>{publishMsg}</p>}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Add Lesson</h2>
        <form onSubmit={addLesson} className="space-y-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setLessonType("TEXT")}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${lessonType === "TEXT" ? "btn-primary" : "bg-[var(--bg-secondary)]"}`}
              style={lessonType === "TEXT" ? {} : { color: 'var(--text-secondary)' }}>
              Text Lesson
            </button>
            <button type="button" onClick={() => setLessonType("VIDEO")}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${lessonType === "VIDEO" ? "btn-primary" : "bg-[var(--bg-secondary)]"}`}
              style={lessonType === "VIDEO" ? {} : { color: 'var(--text-secondary)' }}>
              Video Lesson
            </button>
          </div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="input w-full" placeholder="Lesson title" required />
          {lessonType === "TEXT" ? (
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              className="textarea w-full min-h-[200px]" placeholder="Lesson content..." required />
          ) : (
            <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
              className="input w-full" placeholder="YouTube/Vimeo URL or direct video URL" required />
          )}
          <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5">
            {loading ? "Adding..." : "Add Lesson"}
          </button>
        </form>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Lessons ({course.lessons?.length || 0})</h2>
        {(!course.lessons || course.lessons.length === 0) && (
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">No lessons yet. Add your first lesson above.</p>
        )}
        {course.lessons?.map((lesson: any, i: number) => (
          <motion.div key={lesson.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="card p-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold" style={{ background: 'rgba(var(--accent-cyan-rgb), 0.1)', color: 'var(--accent-cyan)' }}>
              {lesson.order}
            </div>
            <div className="flex-1">
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{lesson.title}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className={`badge ${lesson.type === 'VIDEO' ? 'badge-purple' : 'badge-cyan'}`}>
                  {lesson.type === "VIDEO" ? "Video" : "Text"}
                </span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
