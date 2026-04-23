"use client";

import React from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";
import { 
  Users, 
  DollarSign, 
  RefreshCw, 
  Rocket, 
  TrendingUp, 
  PlusCircle,
  Search,
  Activity,
  Wallet,
  AlertCircle
} from "lucide-react";
import Skeleton from "../ui/Skeleton";

interface Lead {
  _id: string;
  clientName: string;
  source: string;
  status: string;
  createdAt: string;
}

interface Project {
  _id: string;
  clientName: string;
  status: string;
  totalBudget: string;
  outstandingBalance: string;
  startDate: string;
}

interface Retainership {
  _id: string;
  price: number;
  startDate: string;
}

interface Payment {
  _id: string;
  amount: number;
  date: string;
}

interface Wallet {
  _id: string;
  name: string;
  balance: number;
}

interface Transaction {
  _id: string;
  walletName: string;
  type: "In" | "Out" | "Adjustment";
  amount: number;
  date: string;
  description: string;
}

interface DashboardViewProps {
  leads: Lead[];
  projects: Project[];
  retainerships: Retainership[];
  payments: Payment[];
  wallets: Wallet[];
  transactions: Transaction[];
  loading?: boolean;
  onAddLeadClick: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  leads, projects, retainerships, payments, wallets, transactions, loading, onAddLeadClick 
}) => {
  // Active Projects filtering
  const activeProjects = projects.filter(p => ["In Progress", "On Hold"].includes(p.status));
  
  const totalActiveBudget = activeProjects.reduce((sum, p) => sum + (parseFloat(p.totalBudget) || 0), 0);
  const totalActiveOutstanding = activeProjects.reduce((sum, p) => sum + (parseFloat(p.outstandingBalance) || 0), 0);
  
  const totalRetainership = retainerships.reduce((sum, r) => sum + r.price, 0);

  // Total Wallet Balance
  const totalWalletBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  
  // Stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyIncome = payments
    .filter(p => {
      const pDate = new Date(p.date);
      return pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear;
    })
    .reduce((sum, p) => sum + p.amount, 0);

  // Conversion Rate (Percentage)
  const lockedLeads = leads.filter(l => l.status === "Order Locked").length;
  const conversionRate = leads.length > 0 
    ? ((lockedLeads / leads.length) * 100).toFixed(1) 
    : "0";

  // Revenue Data (Last 12 Months)
  const last12MonthsRevenue = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    const month = d.toLocaleString('default', { month: 'short' });
    const amount = payments
      .filter(p => {
        const pDate = new Date(p.date);
        return pDate.getMonth() === d.getMonth() && pDate.getFullYear() === d.getFullYear();
      })
      .reduce((sum, p) => sum + p.amount, 0);
    return { name: month, amount };
  });

  // Project Lock Volume (Last 12 Months)
  const last12MonthsProjects = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    const month = d.toLocaleString('default', { month: 'short' });
    const volume = projects
      .filter(p => {
        const pDate = new Date(p.startDate || (p as any).date);
        return pDate.getMonth() === d.getMonth() && pDate.getFullYear() === d.getFullYear();
      })
      .reduce((sum, p) => sum + (parseFloat(p.totalBudget) || 0), 0);
    return { name: month, volume };
  });

  // Retainership Growth (Last 12 Months)
  const last12MonthsRetainers = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    const month = d.toLocaleString('default', { month: 'short' });
    const amount = retainerships
      .filter(r => {
        const rDate = new Date(r.startDate);
        // Count it if it started on or before this month
        return rDate <= d;
      })
      .reduce((sum, r) => sum + r.price, 0);
    return { name: month, amount };
  });

  // Lead Distribution Data
  const leadDistribution = [
    { name: 'New', value: leads.filter(l => l.status === 'New Leads').length, color: '#3b82f6' },
    { name: 'Active', value: leads.filter(l => ['In Conversation', 'Follow Up', 'Strong Lead'].includes(l.status)).length, color: '#8b5cf6' },
    { name: 'Locked', value: lockedLeads, color: '#10b981' },
    { name: 'Other', value: leads.filter(l => !['New Leads', 'In Conversation', 'Follow Up', 'Strong Lead', 'Order Locked'].includes(l.status)).length, color: '#6b7280' },
  ].filter(d => d.value > 0);


  // Wallet History Data (Last 12 Months)
  const getWalletHistoryData = () => {
    const wNames = wallets.map(w => w.name);
    const currentBalances: Record<string, number> = {};
    wallets.forEach(w => {
      currentBalances[w.name] = w.balance;
    });

    const transactionsByMonth: Record<string, Transaction[]> = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!transactionsByMonth[key]) transactionsByMonth[key] = [];
      transactionsByMonth[key].push(t);
    });

    const result = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.toLocaleString('default', { month: 'short' });
      const yearMonthKey = `${d.getFullYear()}-${d.getMonth()}`;
      
      const dataPoint: any = { name: month };
      let monthTotal = 0;
      wNames.forEach(name => {
        dataPoint[name] = currentBalances[name] || 0;
        monthTotal += dataPoint[name];
      });
      dataPoint.Total = monthTotal;
      result.unshift(dataPoint);

      const monthTx = transactionsByMonth[yearMonthKey] || [];
      monthTx.forEach(t => {
        if (currentBalances[t.walletName] === undefined) currentBalances[t.walletName] = 0;
        if (t.type === "In") {
          currentBalances[t.walletName] -= t.amount;
        } else if (t.type === "Out" || t.type === "Adjustment") {
          currentBalances[t.walletName] += t.amount; 
        }
      });
    }
    return result;
  };

  const walletHistoryData = getWalletHistoryData();
  const walletNames = wallets.map(w => w.name);
  const getWalletColor = (index: number) => {
    const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899"];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white glow-text">Dashboard Overview</h1>
          <p className="text-muted mt-1 font-medium text-sm">Live metrics and business performance analytics.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={onAddLeadClick}
            className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all glow-button flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">New Lead</span>
          </button>
        </div>
      </header>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Leads", value: leads.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Monthly Revenue", value: `$${monthlyIncome.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Monthly Retainers", value: `$${totalRetainership.toLocaleString()}`, icon: RefreshCw, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Wallet Balance", value: `$${totalWalletBalance.toLocaleString()}`, icon: Wallet, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Active Projects", value: activeProjects.length, icon: Rocket, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Active Budget", value: `$${totalActiveBudget.toLocaleString()}`, icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Active Outstanding", value: `$${totalActiveOutstanding.toLocaleString()}`, icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
          { label: "Conversion Rate", value: `${conversionRate}%`, icon: Activity, color: "text-rose-500", bg: "bg-rose-500/10" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-4 bg-card border border-border rounded-2xl hover:border-accent/50 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="w-16 h-2" />
                  <Skeleton className="w-24 h-5" />
                </div>
              ) : (
                <>
                  <h3 className="text-muted text-[9px] font-bold uppercase tracking-wider">{stat.label}</h3>
                  <p className="text-lg font-bold text-white mt-1 group-hover:text-accent transition-colors truncate">{stat.value}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Wallet History (12 Months) */}
        <div className="p-6 bg-card border border-border rounded-[2rem]">
          <h3 className="text-lg font-black text-white mb-6">Wallet Balances (Last 12 Months)</h3>
          <div className="h-[250px] md:h-[350px] w-full">
            {loading ? (
              <Skeleton className="w-full h-full rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={walletHistoryData}>
                  <defs>
                    {walletNames.map((name, index) => (
                      <linearGradient key={`color-${name}`} id={`color-${name.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getWalletColor(index)} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={getWalletColor(index)} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} strokeOpacity={0.5} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px' }}
                  />
                  <Area key="Bank" type="monotone" dataKey="Bank" stackId="a" stroke={getWalletColor(0)} strokeWidth={2} fillOpacity={1} fill={`url(#color-Bank)`} />
                  <Area key="Cash" type="monotone" dataKey="Cash" stackId="a" stroke={getWalletColor(1)} strokeWidth={2} fillOpacity={1} fill={`url(#color-Cash)`} />
                  <Area key="Payoneer" type="monotone" dataKey="Payoneer" stackId="a" stroke={getWalletColor(2)} strokeWidth={2} fillOpacity={1} fill={`url(#color-Payoneer)`} />
                  <Area type="monotone" dataKey="Total" stroke="#ffffff" strokeWidth={3} fill="transparent" stackId="b" />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Revenue Growth (12 Months) */}
        <div className="p-6 bg-card border border-border rounded-[2rem]">
          <h3 className="text-lg font-black text-white mb-6">Revenue Growth (Last 12 Months)</h3>
          <div className="h-[250px] md:h-[350px] w-full">
            {loading ? (
              <Skeleton className="w-full h-full rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last12MonthsRevenue}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} strokeOpacity={0.5} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px' }} />
                  <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Retainership & Project Lock Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retainership Growth (12 Months) */}
        <div className="p-6 bg-card border border-border rounded-[2rem]">
          <h3 className="text-lg font-bold text-white mb-6">Retainership Revenue (Last 12 Months)</h3>
          <div className="h-[250px] md:h-[350px] w-full">
            {loading ? (
              <Skeleton className="w-full h-full rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last12MonthsRetainers}>
                  <defs>
                    <linearGradient id="colorRetain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} strokeOpacity={0.5} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px' }} />
                  <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorRetain)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Project Lock Volume (12 Months) */}
        <div className="p-6 bg-card border border-border rounded-[2rem]">
          <h3 className="text-lg font-bold text-white mb-6">Project Lock Volume ($) - Last 12 Months</h3>
          <div className="h-[250px] md:h-[350px] w-full">
            {loading ? (
              <Skeleton className="w-full h-full rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last12MonthsProjects}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} strokeOpacity={0.5} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px' }} />
                  <Bar dataKey="volume" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardView;
