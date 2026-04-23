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
  onAddLeadClick: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  leads, projects, retainerships, payments, wallets, transactions, onAddLeadClick 
}) => {
  const [timeFilter, setTimeFilter] = React.useState<"daily" | "weekly" | "monthly">("monthly");
  const [walletFilter, setWalletFilter] = React.useState<string>("All");

  // Filtering Logic
  const filteredTransactions = transactions.filter(t => {
    const matchesWallet = walletFilter === "All" || t.walletName === walletFilter;
    return matchesWallet;
  });

  const filteredPayments = payments.filter(p => {
    // Payments don't have wallet info in the model currently, but we can filter by date
    return true; 
  });
  // Active Projects filtering
  const activeProjects = projects.filter(p => ["In Progress", "On Hold"].includes(p.status));
  
  const totalActiveBudget = activeProjects.reduce((sum, p) => sum + (parseFloat(p.totalBudget) || 0), 0);
  const totalActiveOutstanding = activeProjects.reduce((sum, p) => sum + (parseFloat(p.outstandingBalance) || 0), 0);
  
  const totalRetainership = retainerships.reduce((sum, r) => sum + r.price, 0);
  
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

  // Transaction Flow Data (Monthly/Weekly/Daily)
  const getTransactionFlowData = () => {
    if (timeFilter === "monthly") {
      return Array.from({ length: 12 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (11 - i));
        const month = d.toLocaleString('default', { month: 'short' });
        const income = filteredTransactions
          .filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear() && t.type === "In";
          })
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = filteredTransactions
          .filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear() && t.type === "Out";
          })
          .reduce((sum, t) => sum + t.amount, 0);
        return { name: month, income, expense };
      });
    } else if (timeFilter === "weekly") {
      return Array.from({ length: 8 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (7 * (7 - i)));
        const dateStr = `Week ${i + 1}`;
        const startOfWeek = new Date(d);
        startOfWeek.setDate(d.getDate() - d.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const income = filteredTransactions
          .filter(t => {
            const tDate = new Date(t.date);
            return tDate >= startOfWeek && tDate <= endOfWeek && t.type === "In";
          })
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = filteredTransactions
          .filter(t => {
            const tDate = new Date(t.date);
            return tDate >= startOfWeek && tDate <= endOfWeek && t.type === "Out";
          })
          .reduce((sum, t) => sum + t.amount, 0);
        return { name: dateStr, income, expense };
      });
    } else {
      // Daily
      return Array.from({ length: 14 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        const day = d.toLocaleDateString('default', { day: '2-digit', month: 'short' });
        const income = filteredTransactions
          .filter(t => {
            const tDate = new Date(t.date);
            return tDate.toDateString() === d.toDateString() && t.type === "In";
          })
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = filteredTransactions
          .filter(t => {
            const tDate = new Date(t.date);
            return tDate.toDateString() === d.toDateString() && t.type === "Out";
          })
          .reduce((sum, t) => sum + t.amount, 0);
        return { name: day, income, expense };
      });
    }
  };

  const transactionFlowData = getTransactionFlowData();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-white glow-text">Dashboard Overview</h1>
          <p className="text-muted mt-1 font-medium">Live metrics and business performance analytics.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-card border border-border p-1 rounded-xl">
            {(['daily', 'weekly', 'monthly'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${timeFilter === f ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-muted hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <select 
            value={walletFilter}
            onChange={(e) => setWalletFilter(e.target.value)}
            className="bg-card border border-border text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-xl outline-none focus:border-accent transition-colors"
          >
            <option value="All">All Wallets</option>
            {wallets.map(w => (
              <option key={w._id} value={w.name}>{w.name}</option>
            ))}
          </select>

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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {[
          { label: "Total Leads", value: leads.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Monthly Revenue", value: `$${monthlyIncome.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Monthly Retainers", value: `$${totalRetainership.toLocaleString()}`, icon: RefreshCw, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Active Projects", value: activeProjects.length, icon: Rocket, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Active Budget", value: `$${totalActiveBudget.toLocaleString()}`, icon: Wallet, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Active Outstanding", value: `$${totalActiveOutstanding.toLocaleString()}`, icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
          { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-500/10" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-4 bg-card border border-border rounded-2xl hover:border-accent/50 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <h3 className="text-muted text-[9px] font-bold uppercase tracking-wider">{stat.label}</h3>
              <p className="text-lg font-bold text-white mt-1 group-hover:text-accent transition-colors truncate">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1: Transaction Flow & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Flow (The "Monthly Graph") */}
        <div className="p-6 bg-card border border-border rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6">
             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-accent/10 text-accent`}>
                <TrendingUp size={20} />
             </div>
          </div>
          <h3 className="text-lg font-black text-white mb-1">Transaction Flow</h3>
          <p className="text-xs text-muted mb-6 uppercase tracking-widest font-bold">In vs Out • {timeFilter}</p>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionFlowData}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} 
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorIn)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Growth (12 Months) */}
        <div className="p-6 bg-card border border-border rounded-[2rem]">
          <h3 className="text-lg font-black text-white mb-6">Revenue Growth (Last 12 Months)</h3>
          <div className="h-[300px] w-full">
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
          </div>
        </div>
      </div>

      {/* Charts Row 2: Retainership & Project Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retainership Growth (12 Months) */}
        <div className="p-6 bg-card border border-border rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Retainership Revenue (Last 12 Months)</h3>
          <div className="h-[300px] w-full">
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
          </div>
        </div>
      </div>

      {/* Charts Row 3: Projects & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Lock Volume (12 Months) */}
        <div className="p-6 bg-card border border-border rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Project Lock Volume ($) - Last 12 Months</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last12MonthsProjects}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px' }} />
                <Bar dataKey="volume" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Distribution */}
        <div className="p-6 bg-card border border-border rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Lead Status Distribution</h3>
          <div className="h-[300px] w-full flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leadDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {leadDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity */}
      <div className="grid grid-cols-1 gap-6">
         <div className="p-6 bg-card border border-border rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity size={20} className="text-accent" />
                Recent Activity
              </h3>
              <span className="text-xs text-muted">Latest Leads</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leads.slice(0, 6).map((lead) => (
                <div key={lead._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-border">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">{lead.clientName[0]}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{lead.clientName}</p>
                    <p className="text-[10px] text-muted truncate">Via {lead.source} • {new Date(lead.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded-md text-muted border border-border/50">{lead.status}</span>
                  </div>
                </div>
              ))}
              {leads.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <Search size={32} className="mx-auto text-muted/20 mb-3" />
                  <p className="text-muted text-sm italic">No recent activity</p>
                </div>
              )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default DashboardView;
