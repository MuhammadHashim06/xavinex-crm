"use client";

import React, { useState } from "react";
import LeadCard from "./LeadCard";
import { Plus, Search, Filter, Users, Target, TrendingUp, Calendar } from "lucide-react";

interface Lead {
  _id: string;
  clientName: string;
  source: "Direct" | "Fiverr";
  status: string;
  createdAt: string;
}

interface LeadsPipelineProps {
  leads: Lead[];
  onAddLeadClick: () => void;
  onStatusChange: (id: string, status: string) => void;
  onNotesChange: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
  onOrderLock: (lead: Lead) => void;
}

const LeadsPipeline: React.FC<LeadsPipelineProps> = ({ leads, onAddLeadClick, onStatusChange, onNotesChange, onDelete, onOrderLock }) => {
  const statuses = ["New Leads", "In Conversation", "Follow Up", "Strong Lead", "Order Locked", "Not Interested"];
  const [activeTab, setActiveTab] = useState(statuses[0]);
  const [sourceFilter, setSourceFilter] = useState("All");

  const filteredLeads = leads.filter(l => {
    const matchesStatus = l.status === activeTab;
    const matchesSource = sourceFilter === "All" || l.source === sourceFilter;
    return matchesStatus && matchesSource;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "New Leads": return "bg-blue-500";
      case "Strong Lead": return "bg-orange-500";
      case "Order Locked": return "bg-emerald-500";
      case "In Conversation": return "bg-purple-500";
      case "Follow Up": return "bg-amber-500";
      default: return "bg-zinc-600";
    }
  };

  // Stats Calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const totalLeads = leads.length;
  const lockedLeads = leads.filter(l => l.status === "Order Locked").length;
  const conversionRate = totalLeads > 0 ? ((lockedLeads / totalLeads) * 100).toFixed(1) : "0";
  const newLeadsThisMonth = leads.filter(l => {
    const d = new Date(l.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;
  const activeLeads = leads.filter(l => ["In Conversation", "Follow Up", "Strong Lead"].includes(l.status)).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Lead Pipeline</h1>
          <p className="text-muted">Manage and track your potential clients.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-1">
            <div className="pl-2 text-muted">
              <Filter size={12} />
            </div>
            {["All", "Fiverr", "Direct"].map((src) => (
              <button
                key={src}
                onClick={() => setSourceFilter(src)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sourceFilter === src 
                    ? "bg-accent text-white shadow-lg shadow-accent/20" 
                    : "text-muted hover:text-white"
                }`}
              >
                {src}
              </button>
            ))}
          </div>
          <button 
            onClick={onAddLeadClick}
            className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all glow-button flex items-center gap-2"
          >
            <Plus size={18} />
            New Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: totalLeads, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Active Pursuits", value: activeLeads, icon: Target, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "New This Month", value: newLeadsThisMonth, icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-5 bg-card border border-border rounded-2xl flex items-center justify-between group hover:border-accent/30 transition-all">
              <div>
                <h3 className="text-muted text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</h3>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border pb-px">
        {statuses.map((status) => {
          const count = leads.filter(l => l.status === status && (sourceFilter === "All" || l.source === sourceFilter)).length;
          return (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all relative group rounded-t-xl mb-[-1px] ${
                activeTab === status 
                  ? "border-accent text-accent bg-accent/10" 
                  : "border-transparent text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${getStatusColor(status)} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
              <span className="text-[11px] font-bold uppercase tracking-[0.1em]">{status}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${activeTab === status ? "bg-accent/20 text-accent" : "bg-white/5 text-muted"}`}>
                {count.toString().padStart(2, '0')}
              </span>
              {activeTab === status && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <LeadCard 
            key={lead._id} 
            lead={lead} 
            onStatusChange={onStatusChange} 
            onNotesChange={onNotesChange}
            onDelete={onDelete}
            onOrderLock={onOrderLock} 
          />
        ))}
        {filteredLeads.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-card/30 border border-dashed border-border rounded-2xl opacity-50">
            <Search size={40} className="text-muted mb-4" />
            <p className="text-muted font-medium">No leads found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsPipeline;
