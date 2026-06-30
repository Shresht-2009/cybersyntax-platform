"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IconCheckCircle } from "@/components/shared/Icons";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonType, setLessonType] = useState<"TEXT" | "VIDEO">("TEXT");
  const [lessonLoading, setLessonLoading] = useState(false);

  const [publishMsg, setPublishMsg] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [quizTimeLimit, setQuizTimeLimit] = useState("");
  const [quizLoading, setQuizLoading] = useState(false);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);

  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<"MCQ" | "TRUE_FALSE" | "SHORT_ANSWER">("MCQ");
  const [options, setOptions] = useState<string[]>([""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [points, setPoints] = useState(1);
  const [selectedQuizForQuestion, setSelectedQuizForQuestion] = useState<string | null>(null);
  const [questionLoading, setQuestionLoading] = useState(false);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { delay, type: "spring" as const, stiffness: 80, damping: 12 },
  });

  useEffect(() => {
    fetch(`/api/mentor/courses/${id}`)
      .then((r) => r.json())
      .then(setCourse)
      .catch(() => {});
  }, [id]);

  const addLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setLessonLoading(true);
    const res = await fetch(`/api/mentor/courses/${id}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: lessonTitle,
        type: lessonType,
        content: lessonType === "TEXT" ? lessonContent : undefined,
        videoUrl: lessonType === "VIDEO" ? lessonVideoUrl : undefined,
        order: (course?.lessons?.length || 0) + 1,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setCourse((prev: any) => ({ ...prev, lessons: [...(prev?.lessons || []), data] }));
      setLessonTitle("");
      setLessonContent("");
      setLessonVideoUrl("");
    }
    setLessonLoading(false);
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

  const createQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuizLoading(true);
    const res = await fetch("/api/mentor/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: quizTitle,
        timeLimit: quizTimeLimit ? parseInt(quizTimeLimit) : null,
        courseId: id,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setCourse((prev: any) => ({
        ...prev,
        quizzes: [...(prev?.quizzes || []), { ...data, questions: [] }],
      }));
      setQuizTitle("");
      setQuizTimeLimit("");
    }
    setQuizLoading(false);
  };

  const addQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuizForQuestion) return;
    setQuestionLoading(true);
    const res = await fetch(`/api/mentor/quizzes/${selectedQuizForQuestion}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: questionText,
        type: questionType,
        options: questionType === "MCQ" ? options.filter((o) => o.trim()) : questionType === "TRUE_FALSE" ? ["True", "False"] : [],
        correctAnswer,
        points,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setCourse((prev: any) => ({
        ...prev,
        quizzes: prev.quizzes.map((q: any) =>
          q.id === selectedQuizForQuestion ? { ...q, questions: [...(q.questions || []), data] } : q
        ),
      }));
      setQuestionText("");
      setOptions([""]);
      setCorrectAnswer("");
      setPoints(1);
    }
    setQuestionLoading(false);
  };

  const addOption = () => setOptions([...options, ""]);
  const updateOption = (i: number, v: string) => {
    const newOpts = [...options];
    newOpts[i] = v;
    setOptions(newOpts);
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="space-y-3 w-64">
          <div className="skeleton h-6 w-48" />
          <div className="skeleton h-4 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div {...fadeUp(0)} className="page-header flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">{course.title}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{course.description}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className={`badge ${course.status === 'PUBLISHED' ? 'badge-emerald' : 'badge-yellow'}`}>
              {course.status || "DRAFT"}
            </span>
            {course.status === "DRAFT" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePublish}
                className="btn-primary px-4 py-1.5 text-sm"
              >
                Publish Course
              </motion.button>
            )}
          </div>
          <AnimatePresence>
            {publishMsg && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm mt-2 flex items-center gap-1.5"
                style={{ color: 'var(--accent-green)' }}
              >
                <IconCheckCircle className="w-4 h-4" />
                {publishMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div {...fadeUp(0.08)} className="card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <BookOpen />
          Add Lesson
        </h2>
        <form onSubmit={addLesson} className="space-y-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setLessonType("TEXT")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${lessonType === "TEXT" ? "btn-primary" : "bg-[var(--bg-secondary)]"}`}
              style={lessonType === "TEXT" ? {} : { color: 'var(--text-secondary)' }}>
              Text Lesson
            </button>
            <button type="button" onClick={() => setLessonType("VIDEO")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${lessonType === "VIDEO" ? "btn-primary" : "bg-[var(--bg-secondary)]"}`}
              style={lessonType === "VIDEO" ? {} : { color: 'var(--text-secondary)' }}>
              Video Lesson
            </button>
          </div>
          <input type="text" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)}
            className="input w-full" placeholder="Lesson title" required />
          {lessonType === "TEXT" ? (
            <textarea value={lessonContent} onChange={(e) => setLessonContent(e.target.value)}
              className="textarea w-full min-h-[200px]" placeholder="Lesson content..." required />
          ) : (
            <input type="url" value={lessonVideoUrl} onChange={(e) => setLessonVideoUrl(e.target.value)}
              className="input w-full" placeholder="YouTube / Vimeo URL or direct video URL" required />
          )}
          <motion.button type="submit" disabled={lessonLoading} className="btn-primary px-6 py-2.5"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {lessonLoading ? "Adding..." : "Add Lesson"}
          </motion.button>
        </form>
      </motion.div>

      <motion.div {...fadeUp(0.12)} className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <PlayList />
          Lessons ({course.lessons?.length || 0})
        </h2>
        {(!course.lessons || course.lessons.length === 0) && (
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">No lessons yet.</p>
        )}
        <AnimatePresence>
          {course.lessons?.map((lesson: any, i: number) => (
            <motion.div key={lesson.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 80, damping: 14 }}
              className="card p-4 flex items-center gap-4"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: 'rgba(var(--accent-emerald-rgb), 0.1)', color: 'var(--accent-emerald)' }}>
                {lesson.order}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{lesson.title}</p>
                <span className={`badge ${lesson.type === 'VIDEO' ? 'badge-gold' : 'badge-emerald'} mt-1`}>
                  {lesson.type === "VIDEO" ? "Video" : "Text"}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div {...fadeUp(0.16)} className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <QuizIcon2 />
          Quizzes ({course.quizzes?.length || 0})
        </h2>

        <div className="card p-6">
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Create Quiz</h3>
          <form onSubmit={createQuiz} className="space-y-4">
            <input type="text" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)}
              className="input w-full" placeholder="Quiz title" required />
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Time limit (minutes, optional)</label>
                <input type="number" min={1} value={quizTimeLimit} onChange={(e) => setQuizTimeLimit(e.target.value)}
                  className="input" placeholder="e.g. 15" />
              </div>
              <motion.button type="submit" disabled={quizLoading} className="btn-primary px-6 py-2.5"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {quizLoading ? "Creating..." : "Create Quiz"}
              </motion.button>
            </div>
          </form>
        </div>

        {(!course.quizzes || course.quizzes.length === 0) ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No quizzes yet. Create one above.</p>
        ) : (
          course.quizzes.map((quiz: any, qi: number) => (
            <motion.div key={quiz.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qi * 0.05 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{quiz.title}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {quiz.questions?.length || 0} questions{quiz.timeLimit ? ` · ${quiz.timeLimit} min` : ""}
                  </p>
                </div>
                <motion.svg
                  animate={{ rotate: expandedQuiz === quiz.id ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-5 h-5"
                  style={{ color: 'var(--text-muted)' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {expandedQuiz === quiz.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 18 }}
                    className="overflow-hidden"
                  >
                    <div className="divider" />
                    <div className="p-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Add Question</h4>
                        <form onSubmit={(e) => { e.preventDefault(); setSelectedQuizForQuestion(quiz.id); addQuestion(e); }} className="space-y-3">
                          <div className="flex gap-2">
                            {(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"] as const).map((t) => (
                              <button key={t} type="button" onClick={() => { setQuestionType(t); setOptions(t === "TRUE_FALSE" ? ["True", "False"] : [""]); setCorrectAnswer(""); }}
                                className={`flex-1 py-1.5 rounded-lg text-xs transition-all ${questionType === t ? "btn-primary text-xs" : "bg-[var(--bg-secondary)]"}`}
                                style={questionType !== t ? { color: 'var(--text-secondary)' } : {}}>
                                {t === "MCQ" ? "Multiple Choice" : t === "TRUE_FALSE" ? "True/False" : "Short Answer"}
                              </button>
                            ))}
                          </div>
                          <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)}
                            className="textarea w-full min-h-[60px]" placeholder="Question text" required />
                          {questionType === "MCQ" && (
                            <div className="space-y-2">
                              <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Options</label>
                              {options.map((opt, i) => (
                                <div key={i} className="flex gap-2">
                                  <input type="text" value={opt} onChange={(e) => updateOption(i, e.target.value)}
                                    className="input flex-1 text-sm" placeholder={`Option ${i + 1}`} />
                                </div>
                              ))}
                              <button type="button" onClick={addOption} className="text-xs font-medium"
                                style={{ color: 'var(--accent-emerald)' }}>+ Add option</button>
                            </div>
                          )}
                          <div>
                            <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Correct Answer</label>
                            {questionType === "MCQ" ? (
                              <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}
                                className="select" required>
                                <option value="">Select correct answer</option>
                                {options.filter((o) => o.trim()).map((opt, i) => (
                                  <option key={i} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : questionType === "TRUE_FALSE" ? (
                              <div className="flex gap-2">
                                <button type="button" onClick={() => setCorrectAnswer("True")}
                                  className={`flex-1 py-1.5 rounded-lg text-xs ${correctAnswer === "True" ? "btn-primary" : "bg-[var(--bg-secondary)]"}`}
                                  style={correctAnswer !== "True" ? { color: 'var(--text-secondary)' } : {}}>True</button>
                                <button type="button" onClick={() => setCorrectAnswer("False")}
                                  className={`flex-1 py-1.5 rounded-lg text-xs ${correctAnswer === "False" ? "btn-primary" : "bg-[var(--bg-secondary)]"}`}
                                  style={correctAnswer !== "False" ? { color: 'var(--text-secondary)' } : {}}>False</button>
                              </div>
                            ) : (
                              <input type="text" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}
                                className="input" placeholder="Expected answer" required />
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <div>
                              <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Points</label>
                              <input type="number" min={1} value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
                                className="input w-20" />
                            </div>
                            <motion.button type="submit" disabled={questionLoading} className="btn-primary px-4 py-2 text-sm mt-auto"
                              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              {questionLoading ? "Adding..." : "Add Question"}
                            </motion.button>
                          </div>
                        </form>
                      </div>

                      {quiz.questions && quiz.questions.length > 0 && (
                        <div className="space-y-2">
                          <div className="divider" />
                          <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Questions ({quiz.questions.length})</h4>
                          {quiz.questions.map((q: any, i: number) => (
                            <motion.div key={q.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03 }}
                              className="p-3 rounded-xl"
                              style={{ background: 'var(--bg-secondary)' }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                  {i + 1}. {q.text}
                                </p>
                                <span className="badge badge-emerald text-xs whitespace-nowrap">{q.type}</span>
                              </div>
                              {q.options?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {q.options.map((o: string, j: number) => (
                                    <span key={j}
                                      className={`text-xs px-2 py-0.5 rounded ${o === q.correctAnswer ? "bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20" : "text-[var(--text-muted)]"}`}
                                    >
                                      {o} {o === q.correctAnswer ? <IconCheckCircle className="w-3 h-3 inline-block" /> : ""}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{q.points} pt</p>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}

function BookOpen() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function PlayList() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function QuizIcon2() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}
