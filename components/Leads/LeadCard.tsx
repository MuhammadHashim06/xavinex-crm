"use client";

import React from "react";
import { Trash2, Lock, Save, Clock } from "lucide-react";

interface Lead {
  _id: string;
  clientName: string;
  source: "Direct" | "Fiverr";
  status: string;
  followUpNotes?: string;
  createdAt: string;
}

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (id: string, status: string) => void;
  onNotesChange: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
  onOrderLock: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onStatusChange, onNotesChange, onDelete, onOrderLock }) => {
  const [notes, setNotes] = React.useState(lead.followUpNotes || "");
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved">("idle");
  const statuses = ["New Leads", "In Conversation", "Follow Up", "Strong Lead", "Order Locked", "Not Interested"];

  React.useEffect(() => {
    setNotes(lead.followUpNotes || "");
  }, [lead.followUpNotes]);

  const handleSave = async () => {
    setSaveStatus("saving");
    await onNotesChange(lead._id, notes);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "New Leads": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Strong Lead": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Order Locked": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "In Conversation": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Follow Up": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  return (
    <div 
      className="p-4 bg-card border border-border rounded-xl hover:border-accent/40 transition-all group animate-in fade-in slide-in-from-top-2"
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${lead.source === "Fiverr" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"}`}>
            {lead.source}
          </span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${getStatusColor(lead.status)}`}>
            {lead.status}
          </span>
        </div>
        <div className="flex gap-1 shrink-0">
          <select 
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(lead._id, e.target.value);
            }}
            value={lead.status}
            className="text-[10px] bg-background border border-border rounded px-1.5 py-0.5 text-zinc-300 focus:outline-none focus:border-accent cursor-pointer hover:bg-white/5 transition-colors"
          >
            {statuses.map(s => (
              <option key={s} value={s} className="bg-card text-white">{s}</option>
            ))}
          </select>
          <button 
            onClick={() => { if(confirm("Are you sure?")) onDelete(lead._id); }}
            className="w-6 h-6 flex items-center justify-center rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
            title="Delete Lead"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <h4 className="font-bold text-white group-hover:text-accent transition-colors truncate">{lead.clientName}</h4>
      <div className="flex items-center gap-1 mt-1 text-muted">
        <Clock size={10} />
        <p className="text-[10px]">Added {new Date(lead.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-[10px] font-bold text-muted uppercase tracking-wider">Internal Notes</label>
          {saveStatus === "saving" ? (
            <span className="text-[10px] text-accent animate-pulse">Saving...</span>
          ) : saveStatus === "saved" ? (
            <span className="text-[10px] text-emerald-500 font-bold">Saved!</span>
          ) : notes !== (lead.followUpNotes || "") && (
            <button 
              onClick={handleSave}
              className="text-[10px] text-accent hover:underline font-bold flex items-center gap-1"
            >
              <Save size={10} />
              Save
            </button>
          )}
        </div>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add follow-up notes or internal details..."
          className="w-full bg-background/50 border border-border rounded-lg p-2.5 text-[11px] text-zinc-300 focus:outline-none focus:border-accent min-h-[70px] resize-none transition-all placeholder:text-muted/30"
        />
      </div>

      {lead.status === "Strong Lead" && (
        <button 
          onClick={() => onOrderLock(lead)}
          className="w-full mt-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 uppercase tracking-widest"
        >
          <Lock size={12} />
          Order Lock
        </button>
      )}
    </div>
  );
};

export default LeadCard;
