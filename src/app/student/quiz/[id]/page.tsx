"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
  const intervalRef = useRef<any>(null);

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
    try {
      await document.documentElement.requestFullscreen();
      setFullscreen(true);
    } catch {}
  };

  const handleViolation = useCallback(() => {
    setViolations((v) => {
      const newCount = v + 1;
      if (newCount >= 3) {
        submitQuiz(true);
        return newCount;
      }
      return newCount;
    });
  }, [answers, quiz]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !submitted) {
        handleViolation();
        if (violations < 2) {
          startFullscreen();
        }
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [submitted, handleViolation, violations]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !submitted) {
        handleViolation();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [submitted, handleViolation]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    if (!submitted) {
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("copy", handleCopy);
      return () => {
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("copy", handleCopy);
      };
    }
  }, [submitted]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          submitQuiz(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [timeLeft, submitted]);

  const submitQuiz = async (autoSubmit = false) => {
    if (submitted) return;
    setSubmitted(true);
    clearInterval(intervalRef.current);
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch {}
    }

    const res = await fetch(`/api/student/quizzes/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, violations, autoSubmit }),
    });
    if (res.ok) {
      const data = await res.json();
      setAttempt(data);
    }
  };

  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  if (submitted && attempt) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Quiz Submitted</h2>
          <p className="text-lg text-gradient font-semibold mb-2">
            Score: {attempt.score?.toFixed(0) || 0}%
          </p>
          {violations > 0 && (
            <p className="text-sm text-yellow-400 mb-2">{violations} violation(s) recorded</p>
          )}
          {attempt.autoSubmit && (
            <p className="text-sm text-red-400 mb-2">Auto-submitted due to {timeLeft === 0 ? "time limit" : "security violation"}</p>
          )}
          <button onClick={() => router.push("/student/results")}
            className="btn-primary mt-4">
            View Results
          </button>
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
            <div className={`text-lg font-mono font-bold ${timeLeft < 60 ? "text-red-400" : "text-cyan-400"}`}>
              {formatTime(timeLeft)}
            </div>
          )}
          {violations > 0 && (
            <span className="badge badge-yellow">{violations}/3 violations</span>
          )}
        </div>
      </div>

      <div className="w-full bg-[var(--border-primary)] rounded-full h-1.5 mb-8">
        <div className="bg-cyan-400 h-1.5 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
      </div>

      {current && (
        <motion.div key={current.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">{current.text}</h2>

          <div className="space-y-3">
            {current.type === "SHORT_ANSWER" ? (
              <textarea value={answers[current.id] || ""} onChange={(e) => selectAnswer(current.id, e.target.value)}
                className="textarea w-full min-h-[100px]" placeholder="Type your answer..." />
            ) : (
              current.options?.map((option: string, i: number) => (
                <button key={i} onClick={() => selectAnswer(current.id, option)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    answers[current.id] === option
                      ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                      : "card hover:bg-white/10"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[current.id] === option ? "border-cyan-400 bg-cyan-400/20" : "border-[#555]"
                    }`}>
                      {answers[current.id] === option && (
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}
          className="btn-outline disabled:opacity-30">
          Previous
        </button>

        <div className="flex gap-2">
          {currentIndex < questions.length - 1 ? (
            <button onClick={() => setCurrentIndex((i) => i + 1)}
              className="btn-primary">
              Next
            </button>
          ) : (
            <button onClick={() => submitQuiz()} className="btn-primary">
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1.5 mt-6 justify-center">
        {questions.map((_: any, i: number) => (
          <button key={i} onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === currentIndex ? "bg-cyan-400 w-8" : answers[questions[i]?.id] ? "bg-cyan-500/40 w-2" : "bg-[var(--border-primary)] w-2"
            }`} />
        ))}
      </div>
    </div>
  );
}
