"use client";

import React from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";

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
}

interface Retainership {
  _id: string;
  price: number;
}

interface Payment {
  _id: string;
  amount: number;
  date: string;
}

interface DashboardViewProps {
  leads: Lead[];
  projects: Project[];
  retainerships: Retainership[];
  payments: Payment[];
  onAddLeadClick: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ leads, projects, retainerships, payments, onAddLeadClick }) => {
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

  // Revenue Data (Last 6 Months)
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleString('default', { month: 'short' });
    const amount = payments
      .filter(p => {
        const pDate = new Date(p.date);
        return pDate.getMonth() === d.getMonth() && pDate.getFullYear() === d.getFullYear();
      })
      .reduce((sum, p) => sum + p.amount, 0);
    return { name: month, amount };
  });

  // Lead Distribution Data
  const leadDistribution = [
    { name: 'New', value: leads.filter(l => l.status === 'New Leads').length, color: '#3b82f6' },
    { name: 'Active', value: leads.filter(l => ['In Conversation', 'Follow Up', 'Strong Lead'].includes(l.status)).length, color: '#8b5cf6' },
    { name: 'Locked', value: leads.filter(l => l.status === 'Order Locked').length, color: '#10b981' },
    { name: 'Other', value: leads.filter(l => !['New Leads', 'In Conversation', 'Follow Up', 'Strong Lead', 'Order Locked'].includes(l.status)).length, color: '#6b7280' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-muted mt-1">Live metrics and business performance analytics.</p>
        </div>
        <button 
          onClick={onAddLeadClick}
          className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all glow-button flex items-center gap-2"
        >
          <span>+</span> New Lead
        </button>
      </header>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Leads", value: leads.length, icon: "👤", color: "bg-blue-500/10 text-blue-500" },
          { label: "Monthly Revenue", value: `$${monthlyIncome.toLocaleString()}`, icon: "💵", color: "bg-emerald-500/10 text-emerald-500" },
          { label: "Active Retainers", value: `$${totalRetainership.toLocaleString()}`, icon: "🔄", color: "bg-purple-500/10 text-purple-500" },
          { label: "Active Projects", value: projects.length, icon: "🚀", color: "bg-amber-500/10 text-amber-500" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-card border border-border rounded-2xl hover:border-accent/50 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>{stat.icon}</div>
            </div>
            <h3 className="text-muted text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-white mt-1 group-hover:text-accent transition-colors">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="p-6 bg-card border border-border rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Revenue Growth (Last 6 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last6Months}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Distribution */}
        <div className="p-6 bg-card border border-border rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Lead Status Distribution</h3>
          <div className="h-[300px] w-full flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Recent Activity */}
         <div className="p-6 bg-card border border-border rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <span className="text-xs text-muted">Latest Leads</span>
            </div>
            <div className="space-y-4">
              {leads.slice(0, 4).map((lead) => (
                <div key={lead._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-border">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">{lead.clientName[0]}</div>
                  <div>
                    <p className="text-sm font-bold text-white">{lead.clientName}</p>
                    <p className="text-xs text-muted">New lead added via {lead.source}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[10px] text-muted">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    <span className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded-md text-muted mt-1 inline-block">{lead.status}</span>
                  </div>
                </div>
              ))}
              {leads.length === 0 && <p className="text-muted text-sm italic">No recent activity</p>}
            </div>
         </div>

         {/* Retention Bar Chart */}
         <div className="p-6 bg-card border border-border rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Retention Overview</h3>
            <div className="flex flex-col items-center justify-center h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Leads', count: leads.length },
                  { name: 'Projects', count: projects.length },
                  { name: 'Retainers', count: retainerships.length }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DashboardView;
