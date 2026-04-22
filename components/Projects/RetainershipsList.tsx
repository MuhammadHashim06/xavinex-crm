"use client";

import React from "react";

interface Retainership {
  _id: string;
  projectName: string;
  clientName: string;
  date: string;
  duration: string;
  price: number;
}

interface RetainershipsListProps {
  retainerships: Retainership[];
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

const RetainershipsList: React.FC<RetainershipsListProps> = ({ retainerships, onDelete, onAddClick }) => {
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
          <span>+</span> New Retainership
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {retainerships.length > 0 ? (
          <div className="bg-card border border-border rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Project</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Started</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Monthly Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {retainerships.map((r) => (
                  <tr key={r._id} className="hover:bg-accent/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground group-hover:text-emerald-600 transition-colors">{r.projectName}</span>
                        <span className="text-[10px] text-muted">ID: {r._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold text-[10px]">{r.clientName[0]}</div>
                        <span className="text-sm text-foreground">{r.clientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{r.date}</td>
                    <td className="px-6 py-4 text-sm text-emerald-600 font-medium">{r.duration}</td>
                    <td className="px-6 py-4 font-bold text-foreground">${r.price}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => { if(confirm("Are you sure?")) onDelete(r._id); }}
                        className="text-rose-500 hover:text-rose-400 text-xs font-bold"
                      >
                        Terminate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center bg-card border border-border border-dashed rounded-2xl">
            <p className="text-muted italic">No active retainerships found.</p>
            <button onClick={onAddClick} className="mt-4 text-accent text-sm font-bold hover:underline">Start your first retainership</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetainershipsList;
