"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function FinancePage() {
  const [finance, setFinance] = useState<any>({ balance: 0, transactions: [] });
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/mentor/finance")
      .then((r) => r.json())
      .then(setFinance)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/mentor/finance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount), description, type }),
    });
    if (res.ok) {
      const data = await res.json();
      setFinance(data);
      setAmount("");
      setDescription("");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <h1 className="text-3xl font-bold text-gradient mb-2">Finance</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your internal credits and transactions.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 80, damping: 12 }}
        className="stat-card text-center max-w-md mx-auto animate-glow-pulse"
      >
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Current Balance</p>
        <CountUp value={finance.balance || 0} prefix="$" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6 max-w-md mx-auto"
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Add / Remove Funds</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <motion.button type="button" onClick={() => setType("CREDIT")}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${type === "CREDIT" ? "btn-primary" : "btn-outline"}`}
              whileTap={{ scale: 0.95 }}>
              Add Funds
            </motion.button>
            <motion.button type="button" onClick={() => setType("DEBIT")}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${type === "DEBIT" ? "btn-primary" : "btn-outline"}`}
              style={type === "DEBIT" ? { background: 'var(--accent-red)' } : {}}
              whileTap={{ scale: 0.95 }}>
              Remove Funds
            </motion.button>
          </div>
          <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="input w-full" placeholder="Amount" required />
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            className="input w-full" placeholder="Description" required />
          <motion.button type="submit" disabled={loading} className="btn-primary px-6 py-2.5 w-full"
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
            {loading ? "Processing..." : type === "CREDIT" ? "Add Funds" : "Remove Funds"}
          </motion.button>
        </form>
      </motion.div>

      {finance.transactions?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Transaction History</h2>
          <div className="space-y-2">
            {finance.transactions.map((t: any, i: number) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.04 }}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: 'var(--bg-secondary)' }}
                whileHover={{ x: 4, background: 'var(--bg-card-hover)' }}
              >
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{t.description}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <motion.span
                  className="font-semibold"
                  style={{ color: t.type === "CREDIT" ? 'var(--accent-green)' : 'var(--accent-red)' }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.04, type: "spring", stiffness: 150, damping: 10 }}
                >
                  {t.type === "CREDIT" ? "+" : "-"}${t.amount.toFixed(2)}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function CountUp({ value, prefix }: { value: number; prefix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1500;
          const step = Math.ceil(value / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= value) { setCount(value); clearInterval(timer); }
            else setCount(start);
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-5xl font-bold text-gradient"
    >
      {prefix}{count.toFixed(2)}
    </motion.p>
  );
}
