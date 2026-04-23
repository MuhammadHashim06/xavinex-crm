"use client";

import React, { useState, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";

interface Wallet {
  _id: string;
  name: string;
  balance: number;
}

interface UpdateBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: Wallet | null;
  onSuccess: () => void;
}

const UpdateBalanceModal: React.FC<UpdateBalanceModalProps> = ({ isOpen, onClose, wallet, onSuccess }) => {
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wallet) setBalance(wallet.balance.toString());
  }, [wallet]);

  if (!isOpen || !wallet) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/wallets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: wallet.name,
          balance: parseFloat(balance)
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

        <h2 className="text-2xl font-bold text-white mb-2">Adjust Balance</h2>
        <p className="text-muted text-sm mb-8">Directly update the current balance for <strong>{wallet.name}</strong>.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest ml-1">New Current Balance ($)</label>
            <input
              required
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-accent transition-all text-lg font-mono"
              placeholder="0.00"
            />
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
             <p className="text-[10px] text-blue-400 font-medium">NOTE: This will override the existing balance. It is usually done for initial setup or corrections.</p>
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`w-full py-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? "Updating..." : "Update Balance"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBalanceModal;
