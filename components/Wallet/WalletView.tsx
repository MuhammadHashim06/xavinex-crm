"use client";

import React, { useState, useEffect } from "react";
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  History, 
  TrendingUp,
  CreditCard,
  Banknote,
  MoreVertical,
  Edit2,
  Minus
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie
} from "recharts";

interface Wallet {
  _id: string;
  name: string;
  balance: number;
  updatedAt: string;
}

interface Transaction {
  _id: string;
  walletName: string;
  type: "In" | "Out" | "Adjustment";
  amount: number;
  description: string;
  date: string;
}

interface WalletViewProps {
  onAddTransaction: (walletName: string, type: "In" | "Out") => void;
  onUpdateBalance: (wallet: Wallet) => void;
}

const WalletView: React.FC<WalletViewProps> = ({ onAddTransaction, onUpdateBalance }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [wRes, tRes] = await Promise.all([
      fetch("/api/wallets"),
      fetch("/api/transactions")
    ]);
    setWallets(await wRes.json());
    setTransactions(await tRes.json());
    setLoading(false);
  };

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const getWalletIcon = (name: string) => {
    switch (name) {
      case "Payoneer": return <CreditCard size={20} />;
      case "Bank": return <WalletIcon size={20} />;
      case "Cash": return <Banknote size={20} />;
      default: return <CreditCard size={20} />;
    }
  };

  const getWalletColor = (name: string) => {
    switch (name) {
      case "Payoneer": return "text-blue-500 bg-blue-500/10";
      case "Bank": return "text-purple-500 bg-purple-500/10";
      case "Cash": return "text-emerald-500 bg-emerald-500/10";
      default: return "text-zinc-500 bg-zinc-500/10";
    }
  };

  const pieData = wallets.map(w => ({ name: w.name, value: w.balance }));
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Wallet Management</h1>
          <p className="text-muted">Track balances across Payoneer, Bank, and Cash.</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Total Assets</span>
          <span className="text-3xl font-black text-white glow-text">${totalBalance.toLocaleString()}</span>
        </div>
      </header>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wallets.map((w) => (
          <div key={w._id} className="p-6 bg-card border border-border rounded-[2rem] hover:border-accent/40 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <button 
                onClick={() => onUpdateBalance(w)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-muted hover:text-white transition-all"
               >
                 <Edit2 size={14} />
               </button>
            </div>
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${getWalletColor(w.name)}`}>
              {getWalletIcon(w.name)}
            </div>
            
            <h3 className="text-muted text-xs font-bold uppercase tracking-wider">{w.name} Balance</h3>
            <p className="text-2xl font-black text-white mt-2 group-hover:text-accent transition-colors">${w.balance.toLocaleString()}</p>
            
            <div className="mt-8 grid grid-cols-2 gap-3">
              <button 
                onClick={() => onAddTransaction(w.name, "In")}
                className="flex items-center justify-center gap-2 py-2.5 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                <Plus size={14} /> Add
              </button>
              <button 
                onClick={() => onAddTransaction(w.name, "Out")}
                className="flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                <Minus size={14} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution Chart */}
        <div className="lg:col-span-1 p-6 bg-card border border-border rounded-[2rem]">
          <h3 className="text-lg font-bold text-white mb-6">Asset Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {wallets.map((w, i) => (
              <div key={w._id} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted">{w.name}</span>
                </div>
                <span className="text-white font-bold">{((w.balance / (totalBalance || 1)) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2 p-6 bg-card border border-border rounded-[2rem]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History size={20} className="text-accent" />
              Recent Transactions
            </h3>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {transactions.map((t) => (
              <div key={t._id} className="flex items-center justify-between p-4 bg-background/50 border border-border/50 rounded-2xl hover:border-accent/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'In' ? 'bg-emerald-500/10 text-emerald-500' : t.type === 'Out' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {t.type === 'In' ? <ArrowUpRight size={18} /> : t.type === 'Out' ? <ArrowDownLeft size={18} /> : <Edit2 size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.description || `${t.type === 'In' ? 'Added to' : 'Removed from'} ${t.walletName}`}</p>
                    <p className="text-[10px] text-muted">{new Date(t.date).toLocaleString()} • {t.walletName}</p>
                  </div>
                </div>
                <p className={`font-mono font-bold ${t.type === 'In' ? 'text-emerald-500' : t.type === 'Out' ? 'text-rose-500' : 'text-blue-500'}`}>
                  {t.type === 'In' ? '+' : t.type === 'Out' ? '-' : ''}${t.amount.toLocaleString()}
                </p>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-center text-muted py-10 italic">No transaction history found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletView;
