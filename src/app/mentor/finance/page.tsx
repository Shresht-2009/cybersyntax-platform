"use client";

import { useEffect, useState } from "react";
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold cyber-text-gradient mb-2">Finance</h1>
        <p className="text-[#8888aa]">Manage your internal credits and transactions.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 text-center"
      >
        <p className="text-sm text-[#8888aa] mb-1">Current Balance</p>
        <p className="text-5xl font-bold cyber-text-gradient">${finance.balance?.toFixed(2) || "0.00"}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Add / Remove Funds</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setType("CREDIT")}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${type === "CREDIT" ? "cyber-btn" : "bg-white/5"}`}>
              Add Funds
            </button>
            <button type="button" onClick={() => setType("DEBIT")}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${type === "DEBIT" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-white/5"}`}>
              Remove Funds
            </button>
          </div>
          <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="cyber-input w-full px-4 py-2.5 rounded-lg" placeholder="Amount" required />
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            className="cyber-input w-full px-4 py-2.5 rounded-lg" placeholder="Description" required />
          <button type="submit" disabled={loading} className="cyber-btn px-6 py-2.5 rounded-lg">
            {loading ? "Processing..." : type === "CREDIT" ? "Add Funds" : "Remove Funds"}
          </button>
        </form>
      </motion.div>

      {finance.transactions?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <div className="space-y-2">
            {finance.transactions.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div>
                  <p className="text-sm">{t.description}</p>
                  <p className="text-xs text-[#555]">{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`font-semibold ${t.type === "CREDIT" ? "text-green-400" : "text-red-400"}`}>
                  {t.type === "CREDIT" ? "+" : "-"}${t.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
