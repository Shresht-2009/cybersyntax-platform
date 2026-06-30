"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [violations, setViolations] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const intervalRef = useRef<any>(null);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    fetch(`/api/student/quizzes/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setQuiz(data);
        if (data.timeLimit) setTimeLeft(data.timeLimit * 60);
        startFullscreen();
      })
      .catch(() => {});
  }, [id]);

  const startFullscreen = async () => {
    try { await document.documentElement.requestFullscreen(); setFullscreen(true); } catch {}
  };

  const handleViolation = useCallback(() => {
    setViolations((v) => {
      const newCount = v + 1;
      if (newCount >= 3) { submitQuiz(true); return newCount; }
      return newCount;
    });
  }, [answers, quiz]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !submitted) {
        handleViolation();
        if (violations < 2) startFullscreen();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [submitted, handleViolation, violations]);

  useEffect(() => {
    const handleVisibility = () => { if (document.hidden && !submitted) handleViolation(); };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [submitted, handleViolation]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    if (!submitted) {
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("copy", handleCopy);
      return () => { document.removeEventListener("contextmenu", handleContextMenu); document.removeEventListener("copy", handleCopy); };
    }
  }, [submitted]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) { submitQuiz(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [timeLeft, submitted]);

  const submitQuiz = async (autoSubmit = false) => {
    if (submitted) return;
    setSubmitted(true);
    clearInterval(intervalRef.current);
    if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch {} }

    const res = await fetch(`/api/student/quizzes/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, violations, autoSubmit }),
    });
    if (res.ok) {
      const data = await res.json();
      setAttempt(data);
      if ((data.score || 0) >= 70) setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const goToQuestion = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  if (submitted && attempt) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        {showConfetti && <Confetti />}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          className="card p-8 text-center"
        >
          <motion.div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: attempt.score >= 70 ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
          >
            <motion.svg className={`w-8 h-8 ${attempt.score >= 70 ? "text-green-400" : "text-red-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {attempt.score >= 70 ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </motion.svg>
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Quiz Submitted</h2>
          <motion.p
            className="text-lg text-gradient font-semibold mb-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.6 }}
          >
            Score: {attempt.score?.toFixed(0) || 0}%
          </motion.p>
          {violations > 0 && <p className="text-sm text-yellow-400 mb-2">{violations} violation(s) recorded</p>}
          {attempt.autoSubmit && (
            <p className="text-sm text-red-400 mb-2">Auto-submitted due to {timeLeft === 0 ? "time limit" : "security violation"}</p>
          )}
          <motion.button
            onClick={() => router.push("/student/results")}
            className="btn-primary mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Results
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!quiz) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="skeleton w-8 h-8 rounded-full" />
        <div className="skeleton w-48 h-4" />
      </div>
    </div>
  );

  const questions = quiz.questions || [];
  const current = questions[currentIndex];
  const totalTime = quiz.timeLimit ? quiz.timeLimit * 60 : 1;
  const timerProgress = timeLeft !== null ? (timeLeft / totalTime) * 100 : 100;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gradient">{quiz.title}</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {timeLeft !== null && (
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="absolute inset-0 w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke={timeLeft < 60 ? "var(--accent-rose)" : "var(--accent-emerald)"}
                  strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={`${timerProgress * 0.9424} 94.24`}
                />
              </svg>
              <motion.span
                className={`text-sm font-mono font-bold ${timeLeft < 60 ? "animate-timer-pulse" : ""}`}
                style={{ color: timeLeft < 60 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}
              >
                {formatTime(timeLeft)}
              </motion.span>
            </div>
          )}
          {violations > 0 && (
            <motion.span
              className="badge badge-yellow"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {violations}/3 violations
            </motion.span>
          )}
        </div>
      </div>

      <div className="w-full bg-[var(--border-primary)] rounded-full h-1.5 mb-8">
        <motion.div
          className="h-1.5 rounded-full"
          style={{ background: 'var(--gradient-primary)' }}
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        {current && (
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, rotateY: direction * -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: direction * 90 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="card p-6 mb-6 perspective-1000 preserve-3d"
          >
            <h2 className="text-xl font-semibold mb-6">{current.text}</h2>

            <div className="space-y-3">
              {current.type === "SHORT_ANSWER" ? (
                <motion.textarea
                  value={answers[current.id] || ""}
                  onChange={(e) => selectAnswer(current.id, e.target.value)}
                  className="textarea w-full min-h-[100px]"
                  placeholder="Type your answer..."
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                />
              ) : (
                current.options?.map((option: string, i: number) => {
                  const isSelected = answers[current.id] === option;
                  return (
                    <motion.button
                      key={i}
                      onClick={() => selectAnswer(current.id, option)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isSelected
                          ? "border-2 text-cyan-300"
                          : "card hover:bg-white/10"
                      }`}
                      style={{
                        borderColor: isSelected ? 'rgba(16,185,129,0.4)' : 'transparent',
                        background: isSelected ? 'rgba(16,185,129,0.08)' : undefined,
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: isSelected ? 'var(--accent-emerald)' : 'var(--text-muted)' }}
                          animate={{ scale: isSelected ? [1, 1.3, 1] : 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {isSelected && (
                            <motion.div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ background: 'var(--accent-emerald)' }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            />
                          )}
                        </motion.div>
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <motion.button
          onClick={() => goToQuestion(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="btn-secondary disabled:opacity-30"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Previous
        </motion.button>

        <div className="flex gap-2">
          {currentIndex < questions.length - 1 ? (
            <motion.button
              onClick={() => goToQuestion(currentIndex + 1)}
              className="btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Next
            </motion.button>
          ) : (
            <motion.button
              onClick={() => submitQuiz()}
              className="btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Submit Quiz
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex gap-1.5 mt-6 justify-center">
        {questions.map((_: any, i: number) => (
          <motion.button
            key={i}
            onClick={() => goToQuestion(i)}
            className="h-2 rounded-full transition-all"
            style={{
              background: i === currentIndex ? 'var(--gradient-primary)' : answers[questions[i]?.id] ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.05)',
            }}
            animate={{ width: i === currentIndex ? 24 : 8 }}
            whileHover={{ scale: 1.3 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

function Confetti() {
  const particles = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 30,
      color: ["#10b981", "#f59e0b", "#f43f5e", "#2dd4bf", "#fbbf24"][i % 5],
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
      xSpeed: (Math.random() - 0.5) * 2,
      ySpeed: 1 + Math.random() * 2,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.current.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            rotate: p.rotation,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.xSpeed * 20],
            rotate: p.rotation + 360,
            opacity: [1, 0.8, 0],
          }}
          transition={{ duration: 2 + p.ySpeed, repeat: Infinity, delay: p.id * 0.03, ease: "linear" }}
        />
      ))}
    </div>
  );
}
