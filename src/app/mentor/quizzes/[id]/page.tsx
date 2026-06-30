"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { IconCheckCircle } from "@/components/shared/Icons";

export default function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<"MCQ" | "TRUE_FALSE" | "SHORT_ANSWER">("MCQ");
  const [options, setOptions] = useState<string[]>([""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [points, setPoints] = useState(1);

  useEffect(() => {
    fetch(`/api/mentor/quizzes/${id}`)
      .then((r) => r.json())
      .then(setQuiz)
      .catch(() => {});
  }, [id]);

  const addQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/mentor/quizzes/${id}/questions`, {
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
      setQuiz((prev: any) => ({ ...prev, questions: [...(prev?.questions || []), data] }));
      setQuestionText("");
      setOptions([""]);
      setCorrectAnswer("");
      setPoints(1);
    }
  };

  const addOption = () => setOptions([...options, ""]);
  const updateOption = (i: number, v: string) => {
    const newOpts = [...options];
    newOpts[i] = v;
    setOptions(newOpts);
  };

  if (!quiz) return (
    <div className="flex items-center justify-center py-20">
      <div className="skeleton h-8 w-48 rounded-lg" />
    </div>
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <h1 className="text-3xl font-bold text-gradient mb-2">{quiz.title}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{quiz.timeLimit ? `${quiz.timeLimit} min time limit` : "No time limit"}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Add Question</h2>
        <form onSubmit={addQuestion} className="space-y-4">
          <div className="flex gap-2">
            {(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"] as const).map((t) => (
              <button key={t} type="button" onClick={() => { setQuestionType(t); setOptions(t === "TRUE_FALSE" ? ["True", "False"] : [""]); setCorrectAnswer(""); }}
                className={`flex-1 py-2 rounded-lg text-sm transition-all ${questionType === t ? "btn-primary" : "bg-[var(--bg-secondary)]"}`}
                style={questionType === t ? {} : { color: 'var(--text-secondary)' }}>
                {t === "MCQ" ? "Multiple Choice" : t === "TRUE_FALSE" ? "True/False" : "Short Answer"}
              </button>
            ))}
          </div>
          <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)}
            className="textarea w-full min-h-[60px]" placeholder="Question text" required />

          {questionType === "MCQ" && (
            <div className="space-y-2">
              <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Options</label>
              {options.map((opt, i) => (
                <input key={i} type="text" value={opt} onChange={(e) => updateOption(i, e.target.value)}
                  className="input w-full text-sm" placeholder={`Option ${i + 1}`} />
              ))}
              <button type="button" onClick={addOption} className="text-sm" style={{ color: 'var(--accent-emerald)' }}>
                + Add option
              </button>
            </div>
          )}

          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Correct Answer</label>
            {questionType === "MCQ" ? (
              <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}
                className="select w-full" required>
                <option value="">Select correct answer</option>
                {options.filter((o) => o.trim()).map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            ) : questionType === "TRUE_FALSE" ? (
              <div className="flex gap-2">
                <button type="button" onClick={() => setCorrectAnswer("True")}
                  className={`flex-1 py-2 rounded-lg text-sm ${correctAnswer === "True" ? "btn-primary" : "bg-[var(--bg-secondary)]"}`}
                  style={correctAnswer === "True" ? {} : { color: 'var(--text-secondary)' }}>True</button>
                <button type="button" onClick={() => setCorrectAnswer("False")}
                  className={`flex-1 py-2 rounded-lg text-sm ${correctAnswer === "False" ? "btn-primary" : "bg-[var(--bg-secondary)]"}`}
                  style={correctAnswer === "False" ? {} : { color: 'var(--text-secondary)' }}>False</button>
              </div>
            ) : (
              <input type="text" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}
                className="input w-full" placeholder="Expected answer" required />
            )}
          </div>

          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Points</label>
            <input type="number" min={1} value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
              className="input w-24" />
          </div>

          <button type="submit" className="btn-primary px-6 py-2.5">Add Question</button>
        </form>
      </motion.div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Questions ({quiz.questions?.length || 0})</h2>
        {(!quiz.questions || quiz.questions.length === 0) && (
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">No questions yet.</p>
        )}
        {quiz.questions?.map((q: any, i: number) => (
          <motion.div key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            className="card p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{i + 1}. {q.text}</p>
                <div className="flex gap-2 mt-1">
                  <span className="badge badge-emerald">{q.type}</span>
                  <span style={{ color: 'var(--text-secondary)' }} className="text-xs">{q.points} pt</span>
                </div>
                {q.options?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {q.options.map((o: string, j: number) => (
                      <span key={j} className={`text-xs px-2 py-1 rounded ${o === q.correctAnswer ? "badge-green" : ""}`}
                        style={o !== q.correctAnswer ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
                        {o} {o === q.correctAnswer ? <IconCheckCircle className="w-3 h-3 inline-block" /> : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
