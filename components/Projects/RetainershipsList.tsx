"use client";

import React from "react";
import { Plus, Pencil, Trash2, ShieldAlert } from "lucide-react";

interface Retainership {
  _id: string;
  projectName: string;
  clientName: string;
  startDate: string;
  endDate: string;
  price: number;
}

interface RetainershipsListProps {
  retainerships: Retainership[];
  onDelete: (id: string) => void;
  onAddClick: () => void;
  onEditClick: (retainership: Retainership) => void;
}

const RetainershipsList: React.FC<RetainershipsListProps> = ({ retainerships, onDelete, onAddClick, onEditClick }) => {
  const calculateProgress = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const today = new Date().getTime();
    
    if (today < startDate) return 0;
    if (today > endDate) return 100;
    
    const total = endDate - startDate;
    const elapsed = today - startDate;
    return Math.round((elapsed / total) * 100);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Monthly Retainerships</h1>
          <p className="text-muted">Managing recurring revenue and long-term contracts.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all glow-button flex items-center gap-2"
        >
          <Plus size={18} />
          New Retainership
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {retainerships.length > 0 ? (
          <div className="bg-card border border-border rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/5 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Project</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Timeline & Progress</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Monthly Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {retainerships.map((r) => {
                  const progress = calculateProgress(r.startDate, r.endDate);
                  return (
                    <tr key={r._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">{r.projectName}</span>
                          <span className="text-[10px] text-muted">ID: {r._id.slice(-6)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-[10px]">{r.clientName[0]}</div>
                          <span className="text-sm text-zinc-300">{r.clientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 min-w-[150px]">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-muted">{r.startDate ? new Date(r.startDate).toLocaleDateString() : "N/A"}</span>
                            <span className="text-emerald-500">{progress}%</span>
                            <span className="text-muted">{r.endDate ? new Date(r.endDate).toLocaleDateString() : "N/A"}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-1000 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-white">${r.price}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <button 
                          onClick={() => onEditClick(r)}
                          className="w-8 h-8 flex items-center justify-center bg-white/5 text-muted hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => { if(confirm("Are you sure?")) onDelete(r._id); }}
                          className="px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <Trash2 size={12} />
                          Terminate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center bg-card border border-border border-dashed rounded-2xl">
            <ShieldAlert size={48} className="mx-auto text-muted/20 mb-4" />
            <p className="text-muted italic">No active retainerships found.</p>
            <button onClick={onAddClick} className="mt-4 text-accent text-sm font-bold hover:underline">Start your first retainership</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetainershipsList;
