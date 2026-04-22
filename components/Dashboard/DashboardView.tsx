"use client";

import React from "react";

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
  
  // Calculate current month income
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyIncome = payments
    .filter(p => {
      const pDate = new Date(p.date);
      return pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear;
    })
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, Admin</h1>
        <p className="text-muted mt-1">Here's what's happening with Xavinex today.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Leads", value: leads.length, icon: "👤", color: "bg-blue-500/10 text-blue-500" },
          { label: "Income (Monthly)", value: `$${monthlyIncome.toLocaleString()}`, icon: "💵", color: "bg-emerald-500/10 text-emerald-500" },
          { label: "Monthly Retainers", value: `$${totalRetainership.toLocaleString()}`, icon: "🔄", color: "bg-purple-500/10 text-purple-500" },
          { label: "Active Projects", value: projects.length, icon: "🚀", color: "bg-amber-500/10 text-amber-500" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-card border border-border rounded-2xl hover:border-accent/50 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>{stat.icon}</div>
              <span className="text-xs font-medium text-muted">+12% from last month</span>
            </div>
            <h3 className="text-muted text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-foreground mt-1 group-hover:text-accent transition-colors">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="p-6 bg-card border border-border rounded-2xl">
            <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {leads.slice(0, 3).map((lead, i) => (
                <div key={lead._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/5 transition-colors border border-transparent hover:border-border">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">{lead.clientName[0]}</div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{lead.clientName}</p>
                    <p className="text-xs text-muted">New lead added via {lead.source}</p>
                  </div>
                  <span className="ml-auto text-[10px] text-muted">{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
              {leads.length === 0 && <p className="text-muted text-sm italic">No recent activity</p>}
            </div>
         </div>
         <div className="p-6 bg-card border border-border rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-3xl mb-4">✨</div>
            <h3 className="text-lg font-bold text-foreground mb-2">Grow your business</h3>
            <p className="text-muted text-sm mb-6 max-w-xs">Start by adding a new lead to your pipeline and track your progress.</p>
            <button 
              onClick={onAddLeadClick}
              className="px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all glow-button"
            >
              Add New Lead
            </button>
         </div>
      </div>
    </div>
  );
};

export default DashboardView;
