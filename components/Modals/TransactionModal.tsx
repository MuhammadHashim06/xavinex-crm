"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletName: string;
  initialType?: "In" | "Out";
  onSuccess: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, walletName, initialType = "In", onSuccess }) => {
  const [type, setType] = useState<"In" | "Out">(initialType);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setAmount("");
      setDescription("");
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletName,
          type,
          amount: parseFloat(amount),
          description,
          date: new Date().toISOString()
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-muted hover:text-white transition-colors">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">{type === "In" ? "Add to" : "Remove from"} {walletName}</h2>
        <p className="text-muted text-sm mb-8">Record a new transaction to track your funds.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex bg-background border border-border rounded-xl p-1">
            <button
              type="button"
              onClick={() => setType("In")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${type === "In" ? "bg-emerald-500 text-white" : "text-muted hover:text-white"}`}
            >
              <ArrowUpRight size={14} /> Cash In
            </button>
            <button
              type="button"
              onClick={() => setType("Out")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${type === "Out" ? "bg-rose-500 text-white" : "text-muted hover:text-white"}`}
            >
              <ArrowDownLeft size={14} /> Cash Out
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Amount ($)</label>
            <input
              required
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-accent transition-all text-lg font-mono"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-accent transition-all resize-none h-24 text-sm"
              placeholder="e.g. Project payment, Withdrawal, etc."
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
              type === "In" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
            } text-white ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Processing..." : `Confirm ${type === "In" ? "Addition" : "Removal"}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
