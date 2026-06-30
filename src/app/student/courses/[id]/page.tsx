"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function StudentCourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/student/courses/${id}`)
      .then((r) => r.json())
      .then(setCourse)
      .catch(() => {});
  }, [id]);

  if (!course) return <div className="text-center py-20 text-[#8888aa]">Loading...</div>;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold cyber-text-gradient mb-2">{course.title}</h1>
        <p className="text-[#8888aa]">{course.description}</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeLesson ? (
            <motion.div key={activeLesson.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-4">{activeLesson.title}</h2>
              {activeLesson.type === "VIDEO" && activeLesson.videoUrl ? (
                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-black">
                  {activeLesson.videoUrl.includes("youtube") || activeLesson.videoUrl.includes("youtu.be") ? (
                    <iframe src={activeLesson.videoUrl.replace("watch?v=", "embed/")} className="w-full h-full" allowFullScreen />
                  ) : activeLesson.videoUrl.includes("vimeo") ? (
                    <iframe src={activeLesson.videoUrl.replace("vimeo.com", "player.vimeo.com/video")} className="w-full h-full" allowFullScreen />
                  ) : (
                    <video controls className="w-full h-full">
                      <source src={activeLesson.videoUrl} type="video/mp4" />
                    </video>
                  )}
                </div>
              ) : null}
              {activeLesson.content && (
                <div className="prose prose-invert max-w-none text-[#e0e0f0] whitespace-pre-wrap">
                  {activeLesson.content}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="glass rounded-2xl p-6 text-center text-[#8888aa]">
              Select a lesson to start learning
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-4">
          <h3 className="font-semibold mb-3">Lessons ({course.lessons?.length || 0})</h3>
          <div className="space-y-1">
            {(!course.lessons || course.lessons.length === 0) && (
              <p className="text-sm text-[#8888aa]">No lessons yet.</p>
            )}
            {course.lessons?.sort((a: any, b: any) => a.order - b.order).map((lesson: any) => (
              <button key={lesson.id} onClick={() => setActiveLesson(lesson)}
                className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                  activeLesson?.id === lesson.id ? "bg-cyan-500/10 border border-cyan-500/20" : "hover:bg-white/5"
                }`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-cyan-400">#{lesson.order}</span>
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-xs text-[#555]">{lesson.type === "VIDEO" ? "📹" : "📝"}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {course.quizzes?.length > 0 && (
            <>
              <h3 className="font-semibold mt-6 mb-3">Quizzes</h3>
              <div className="space-y-1">
                {course.quizzes.map((quiz: any) => (
                  <a key={quiz.id} href={`/student/quiz/${quiz.id}`}
                    className="block p-3 rounded-xl text-sm hover:bg-white/5 transition-all">
                    <p className="font-medium">{quiz.title}</p>
                    <p className="text-xs text-[#555]">{quiz.questions?.length || 0} questions{quiz.timeLimit ? ` · ${quiz.timeLimit}min` : ""}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
