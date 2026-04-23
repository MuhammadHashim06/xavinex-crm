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
  Minus,
  Calendar,
  Activity
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, AreaChart, Area, Legend
} from "recharts";
import Skeleton from "../ui/Skeleton";

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
  const [timeFilter, setTimeFilter] = useState<"Daily" | "Weekly" | "Monthly">("Monthly");

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

  const getFilteredHistoryData = () => {
    if (wallets.length === 0) return [];

    const result: any[] = [];
    const now = new Date();
    
    // We reverse engineer the balance from current state
    const currentBalances = wallets.reduce((acc: any, w) => {
      acc[w.name] = w.balance;
      return acc;
    }, {});

    const sortedTxs = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let iterations = 12; // Default for Monthly
    let bucketSize = 1; // months
    if (timeFilter === "Daily") { iterations = 14; bucketSize = 1; } // days
    if (timeFilter === "Weekly") { iterations = 12; bucketSize = 7; } // weeks

    for (let i = 0; i < iterations; i++) {
      const date = new Date(now);
      if (timeFilter === "Daily") date.setDate(now.getDate() - i);
      else if (timeFilter === "Weekly") date.setDate(now.getDate() - (i * 7));
      else date.setMonth(now.getMonth() - i);

      let label = "";
      if (timeFilter === "Daily") label = date.toLocaleDateString([], { day: 'numeric', month: 'short' });
      else if (timeFilter === "Weekly") label = `Week ${i + 1}`;
      else label = date.toLocaleDateString([], { month: 'short' });

      const dataPoint: any = { name: label };
      let total = 0;
      wallets.forEach(w => {
        dataPoint[w.name] = currentBalances[w.name] || 0;
        total += dataPoint[w.name];
      });
      dataPoint.Total = total;
      result.unshift(dataPoint);

      // Adjust balances backward for the transactions in this period
      const nextDate = new Date(date);
      if (timeFilter === "Daily") nextDate.setDate(date.getDate() - 1);
      else if (timeFilter === "Weekly") nextDate.setDate(date.getDate() - 7);
      else nextDate.setMonth(date.getMonth() - 1);

      while (sortedTxs.length > 0 && new Date(sortedTxs[0].date) > nextDate) {
        const tx = sortedTxs.shift()!;
        if (currentBalances[tx.walletName] !== undefined) {
          if (tx.type === "In") currentBalances[tx.walletName] -= tx.amount;
          else if (tx.type === "Out") currentBalances[tx.walletName] += tx.amount;
        }
      }
    }
    return result;
  };

  const historyData = getFilteredHistoryData();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Wallet Management</h1>
          <p className="text-muted text-sm">Track balances across Payoneer, Bank, and Cash.</p>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Total Assets</span>
          <span className="text-2xl sm:text-3xl font-black text-white glow-text">${totalBalance.toLocaleString()}</span>
        </div>
      </header>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-card border border-border rounded-[2rem]">
              <Skeleton className="w-12 h-12 rounded-2xl mb-6" />
              <Skeleton className="w-24 h-3 mb-2" />
              <Skeleton className="w-32 h-8 mb-8" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10 rounded-xl" />
                <Skeleton className="h-10 rounded-xl" />
              </div>
            </div>
          ))
        ) : (
          wallets.map((w) => (
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
          ))
        )}
      </div>

      {/* History Graph Row */}
      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 bg-card border border-border rounded-[2.5rem]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Wallet Performance</h3>
                <p className="text-xs text-muted">Historical balance trends across all wallets.</p>
              </div>
            </div>
            
            <div className="flex bg-background/50 border border-border rounded-xl p-1.5 self-stretch md:self-auto">
              {(["Daily", "Weekly", "Monthly"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`flex-1 md:px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                    timeFilter === filter 
                      ? "bg-accent text-white shadow-lg shadow-accent/20" 
                      : "text-muted hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] md:h-[450px] w-full">
            {loading ? (
              <Skeleton className="w-full h-full rounded-[2rem]" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    {wallets.map((w, index) => (
                      <linearGradient key={w._id} id={`color${w.name.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={index === 0 ? "#3b82f6" : index === 1 ? "#8b5cf6" : "#10b981"} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={index === 0 ? "#3b82f6" : index === 1 ? "#8b5cf6" : "#10b981"} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} strokeOpacity={0.5} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  {wallets.map((w, index) => (
                    <Area 
                      key={w._id}
                      type="monotone" 
                      dataKey={w.name} 
                      stackId="1" 
                      stroke={index === 0 ? "#3b82f6" : index === 1 ? "#8b5cf6" : "#10b981"} 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill={`url(#color${w.name.replace(/\s+/g, '')})`} 
                    />
                  ))}
                  <Area type="monotone" dataKey="Total" stroke="#ffffff" strokeWidth={2} fill="transparent" stackId="2" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution Chart */}
        <div className="lg:col-span-1 p-6 bg-card border border-border rounded-[2rem]">
          <h3 className="text-lg font-bold text-white mb-6">Asset Distribution</h3>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="w-48 h-48 rounded-full mx-auto" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
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
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-background/50 border border-border/50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="w-48 h-3" />
                      <Skeleton className="w-32 h-2" />
                    </div>
                  </div>
                  <Skeleton className="w-16 h-4" />
                </div>
              ))
            ) : (
              transactions.map((t) => (
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
              ))
            )}
            {!loading && transactions.length === 0 && <p className="text-center text-muted py-10 italic">No transaction history found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletView;
