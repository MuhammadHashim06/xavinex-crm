"use client";

import React from "react";
import { Trash2, Lock, Save, Clock } from "lucide-react";

interface Lead {
  _id: string;
  clientName: string;
  source: "Direct" | "Fiverr";
  status: string;
  notes?: string;
  followUpHistory?: { _id: string, note: string, date: string }[];
  createdAt: string;
}

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (id: string, status: string) => void;
  onAddFollowUp: (id: string, note: string) => void;
  onEditFollowUp: (leadId: string, entryId: string, note: string) => void;
  onDeleteFollowUp: (leadId: string, entryId: string) => void;
  onDelete: (id: string) => void;
  onOrderLock: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onStatusChange, onAddFollowUp, onEditFollowUp, onDeleteFollowUp, onDelete, onOrderLock }) => {
  const [newFollowUp, setNewFollowUp] = React.useState("");
  const [showHistory, setShowHistory] = React.useState(false);
  const [editingEntryId, setEditingEntryId] = React.useState<string | null>(null);
  const [editingNote, setEditingNote] = React.useState("");
  const statuses = ["New Leads", "In Conversation", "Follow Up", "Strong Lead", "Order Locked", "Not Interested"];

  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFollowUp.trim()) return;
    onAddFollowUp(lead._id, newFollowUp);
    setNewFollowUp("");
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

      {lead.notes && (
        <div className="mt-3 p-2 bg-white/5 rounded-lg border border-border/50">
          <p className="text-[10px] text-zinc-400 leading-relaxed italic">"{lead.notes}"</p>
        </div>
      )}
      
      {/* Follow-up Section */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex justify-between items-center mb-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Follow-Up History</label>
          {lead.followUpHistory && lead.followUpHistory.length > 0 && (
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="text-[9px] text-accent hover:underline font-bold"
            >
              {showHistory ? "Hide History" : `View ${lead.followUpHistory.length} Entries`}
            </button>
          )}
        </div>

        {showHistory && lead.followUpHistory && (
          <div className="space-y-2 mb-3 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
            {lead.followUpHistory.map((entry) => (
              <div key={entry._id} className="p-2 bg-background/50 border border-border/30 rounded-lg text-[10px] group/item">
                <div className="flex justify-between text-muted mb-1 font-mono text-[8px]">
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setEditingEntryId(entry._id); setEditingNote(entry.note); }}
                      className="text-accent hover:text-white"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => { if(confirm("Delete this note?")) onDeleteFollowUp(lead._id, entry._id); }}
                      className="text-rose-500 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {editingEntryId === entry._id ? (
                  <div className="flex gap-2">
                    <input 
                      autoFocus
                      value={editingNote}
                      onChange={(e) => setEditingNote(e.target.value)}
                      className="flex-1 bg-background border border-accent rounded px-1.5 py-0.5 text-white focus:outline-none"
                    />
                    <button 
                      onClick={() => { onEditFollowUp(lead._id, entry._id, editingNote); setEditingEntryId(null); }}
                      className="text-emerald-500 font-bold"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingEntryId(null)}
                      className="text-muted"
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <p className="text-zinc-300 leading-tight">{entry.note}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddFollowUp} className="flex gap-2">
          <input 
            type="text"
            value={newFollowUp}
            onChange={(e) => setNewFollowUp(e.target.value)}
            placeholder="Add new follow-up..."
            className="flex-1 bg-background/50 border border-border rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-300 focus:outline-none focus:border-accent transition-all placeholder:text-muted/30"
          />
          <button 
            type="submit"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/10"
            title="Save Follow-up"
          >
            <Save size={14} />
          </button>
        </form>
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
