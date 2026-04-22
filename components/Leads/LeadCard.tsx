"use client";

import React from "react";

interface Lead {
  _id: string;
  clientName: string;
  source: string;
  status: string;
  followUpNotes?: string;
  createdAt: string;
}

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (id: string, status: string) => void;
  onNotesChange: (id: string, notes: string) => void;
  onOrderLock: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onStatusChange, onNotesChange, onOrderLock }) => {
  const [notes, setNotes] = React.useState(lead.followUpNotes || "");
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved">("idle");
  const statuses = ["New Leads", "In Conversation", "Follow Up", "Strong Lead", "Not Interested"];

  React.useEffect(() => {
    setNotes(lead.followUpNotes || "");
  }, [lead.followUpNotes]);

  const handleSave = async () => {
    setSaveStatus("saving");
    await onNotesChange(lead._id, notes);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  return (
    <div 
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("leadId", lead._id);
        e.currentTarget.style.opacity = "0.5";
      }}
      onDragEnd={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
      className="p-4 bg-card border border-border rounded-xl hover:border-accent/40 transition-all group animate-in fade-in slide-in-from-top-2 cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${lead.source === "Fiverr" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"}`}>
          {lead.source}
        </span>
        <div className="flex gap-1">
          <select 
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(lead._id, e.target.value);
            }}
            value={lead.status}
            className="text-[10px] bg-background border border-border rounded px-2 py-0.5 text-zinc-300 focus:outline-none focus:border-accent cursor-pointer hover:bg-white/5 transition-colors"
          >
            {statuses.map(s => (
              <option key={s} value={s} className="bg-card text-white">{s}</option>
            ))}
          </select>
        </div>
      </div>
      <h4 className="font-bold text-white group-hover:text-accent transition-colors">{lead.clientName}</h4>
      <p className="text-xs text-muted mt-1 italic">Added on {new Date(lead.createdAt).toLocaleDateString()}</p>
      
      {lead.status === "Follow Up" && (
        <div className="mt-3 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[10px] font-bold text-muted uppercase">Follow-up Notes</label>
            {saveStatus === "saving" ? (
              <span className="text-[10px] text-accent animate-pulse">Saving...</span>
            ) : saveStatus === "saved" ? (
              <span className="text-[10px] text-emerald-500 font-bold">Saved!</span>
            ) : notes !== (lead.followUpNotes || "") && (
              <button 
                onClick={handleSave}
                className="text-[10px] text-accent hover:underline font-bold"
              >
                Save
              </button>
            )}
          </div>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add description..."
            className="w-full bg-background/50 border border-border rounded-lg p-2 text-xs text-zinc-300 focus:outline-none focus:border-accent min-h-[60px] resize-none"
          />
        </div>
      )}

      {lead.status === "Strong Lead" && (
        <button 
          onClick={() => onOrderLock(lead)}
          className="w-full mt-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          🔒 Order Lock
        </button>
      )}
    </div>
  );
};

export default LeadCard;
