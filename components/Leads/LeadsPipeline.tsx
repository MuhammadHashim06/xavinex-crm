"use client";

import React from "react";
import LeadCard from "./LeadCard";

interface Lead {
  _id: string;
  clientName: string;
  source: string;
  status: string;
  createdAt: string;
}

interface LeadsPipelineProps {
  leads: Lead[];
  onAddLeadClick: () => void;
  onStatusChange: (id: string, status: string) => void;
  onNotesChange: (id: string, notes: string) => void;
  onOrderLock: (lead: Lead) => void;
}

const LeadsPipeline: React.FC<LeadsPipelineProps> = ({ leads, onAddLeadClick, onStatusChange, onNotesChange, onOrderLock }) => {
  const statuses = ["New Leads", "In Conversation", "Follow Up", "Strong Lead", "Not Interested"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Lead Pipeline</h1>
          <p className="text-muted">Manage and track your potential clients.</p>
        </div>
        <button 
          onClick={onAddLeadClick}
          className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all glow-button flex items-center gap-2"
        >
          <span>+</span> New Lead
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {statuses.map((status) => (
          <div key={status} className="flex-shrink-0 w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-muted flex items-center gap-2 uppercase tracking-widest">
                <span className={`w-2 h-2 rounded-full ${
                  status === "New Leads" ? "bg-blue-500" : 
                  status === "Strong Lead" ? "bg-orange-500" : 
                  status === "In Conversation" ? "bg-purple-500" :
                  status === "Follow Up" ? "bg-amber-500" : "bg-zinc-600"
                }`} />
                {status}
              </h3>
              <span className="text-xs bg-white/5 text-muted px-2 py-0.5 rounded-full">
                {leads.filter(l => l.status === status).length}
              </span>
            </div>
            
            <div 
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("bg-white/5");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("bg-white/5");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("bg-white/5");
                const leadId = e.dataTransfer.getData("leadId");
                if (leadId) {
                  onStatusChange(leadId, status);
                }
              }}
              className="kanban-column p-3 space-y-3 custom-scrollbar overflow-y-auto max-h-[calc(100vh-250px)] transition-colors"
            >
              {leads.filter(l => l.status === status).map((lead) => (
                <LeadCard 
                  key={lead._id} 
                  lead={lead} 
                  onStatusChange={onStatusChange} 
                  onNotesChange={onNotesChange}
                  onOrderLock={onOrderLock} 
                />
              ))}
              {leads.filter(l => l.status === status).length === 0 && (
                <div className="h-20 flex items-center justify-center border border-dashed border-border/50 rounded-xl text-muted/30 text-sm">
                  No leads here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadsPipeline;
