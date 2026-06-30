"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

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

  if (!quiz) return <div className="text-center py-20 text-[#8888aa]">Loading...</div>;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold cyber-text-gradient mb-2">{quiz.title}</h1>
        <p className="text-[#8888aa]">{quiz.timeLimit ? `${quiz.timeLimit} min time limit` : "No time limit"}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Add Question</h2>
        <form onSubmit={addQuestion} className="space-y-4">
          <div className="flex gap-2">
            {(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"] as const).map((t) => (
              <button key={t} type="button" onClick={() => { setQuestionType(t); setOptions(t === "TRUE_FALSE" ? ["True", "False"] : [""]); setCorrectAnswer(""); }}
                className={`flex-1 py-2 rounded-lg text-sm transition-all ${questionType === t ? "cyber-btn" : "bg-white/5"}`}>
                {t === "MCQ" ? "Multiple Choice" : t === "TRUE_FALSE" ? "True/False" : "Short Answer"}
              </button>
            ))}
          </div>
          <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)}
            className="cyber-input w-full px-4 py-2.5 rounded-lg min-h-[60px]" placeholder="Question text" required />

          {questionType === "MCQ" && (
            <div className="space-y-2">
              <label className="text-sm text-[#8888aa]">Options</label>
              {options.map((opt, i) => (
                <input key={i} type="text" value={opt} onChange={(e) => updateOption(i, e.target.value)}
                  className="cyber-input w-full px-4 py-2 rounded-lg text-sm" placeholder={`Option ${i + 1}`} />
              ))}
              <button type="button" onClick={addOption} className="text-sm text-cyan-400 hover:underline">+ Add option</button>
            </div>
          )}

          <div>
            <label className="text-sm text-[#8888aa] block mb-1">Correct Answer</label>
            {questionType === "MCQ" ? (
              <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}
                className="cyber-input w-full px-4 py-2.5 rounded-lg" required>
                <option value="">Select correct answer</option>
                {options.filter((o) => o.trim()).map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            ) : questionType === "TRUE_FALSE" ? (
              <div className="flex gap-2">
                <button type="button" onClick={() => setCorrectAnswer("True")}
                  className={`flex-1 py-2 rounded-lg text-sm ${correctAnswer === "True" ? "cyber-btn" : "bg-white/5"}`}>True</button>
                <button type="button" onClick={() => setCorrectAnswer("False")}
                  className={`flex-1 py-2 rounded-lg text-sm ${correctAnswer === "False" ? "cyber-btn" : "bg-white/5"}`}>False</button>
              </div>
            ) : (
              <input type="text" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}
                className="cyber-input w-full px-4 py-2.5 rounded-lg" placeholder="Expected answer" required />
            )}
          </div>

          <div>
            <label className="text-sm text-[#8888aa] block mb-1">Points</label>
            <input type="number" min={1} value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
              className="cyber-input w-24 px-4 py-2.5 rounded-lg" />
          </div>

          <button type="submit" className="cyber-btn px-6 py-2.5 rounded-lg">Add Question</button>
        </form>
      </motion.div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Questions ({quiz.questions?.length || 0})</h2>
        {(!quiz.questions || quiz.questions.length === 0) && (
          <p className="text-[#8888aa] text-sm">No questions yet.</p>
        )}
        {quiz.questions?.map((q: any, i: number) => (
          <motion.div key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            className="glass rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium">{i + 1}. {q.text}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">{q.type}</span>
                  <span className="text-xs text-[#8888aa]">{q.points} pt</span>
                </div>
                {q.options?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {q.options.map((o: string, j: number) => (
                      <span key={j} className={`text-xs px-2 py-1 rounded ${o === q.correctAnswer ? "bg-green-500/10 text-green-400" : "bg-white/5 text-[#8888aa]"}`}>
                        {o} {o === q.correctAnswer ? "✓" : ""}
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
