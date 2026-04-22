"use client";

import React from "react";

interface Project {
  _id: string;
  projectName: string;
  clientName: string;
  date: string;
  timeline: string;
  totalBudget: string;
  outstandingBalance: string;
  status: string;
}

interface ProjectsListProps {
  projects: Project[];
  onStatusChange: (id: string, status: string) => void;
  onAddProjectClick: () => void;
  onAddPaymentClick: (project: Project) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onStatusChange, onAddProjectClick, onAddPaymentClick }) => {
  const statuses = ["In Progress", "Completed", "On Hold", "Cancelled"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Active Projects</h1>
          <p className="text-muted">Tracking your confirmed orders and deliverables.</p>
        </div>
        <button 
          onClick={onAddProjectClick}
          className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all glow-button flex items-center gap-2"
        >
          <span>+</span> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.length > 0 ? (
          <div className="bg-card border border-border rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/5 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Project</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Timeline</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Total Budget</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Outstanding</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-accent transition-colors">{project.projectName || "N/A"}</span>
                        <span className="text-[10px] text-muted">{project._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center text-accent font-bold text-[10px]">{project.clientName[0]}</div>
                        <span className="text-sm text-zinc-300">{project.clientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{project.date}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{project.timeline}</td>
                    <td className="px-6 py-4 font-bold text-white">${project.totalBudget}</td>
                    <td className="px-6 py-4 font-bold text-orange-400">${project.outstandingBalance}</td>
                    <td className="px-6 py-4">
                      <select 
                        onChange={(e) => onStatusChange(project._id, e.target.value)}
                        value={project.status || "In Progress"}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full bg-background border border-border focus:outline-none focus:border-accent uppercase ${
                          project.status === "Completed" ? "text-emerald-500" :
                          project.status === "On Hold" ? "text-amber-500" :
                          project.status === "Cancelled" ? "text-rose-500" : "text-blue-500"
                        }`}
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => onAddPaymentClick(project)}
                        className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1"
                      >
                        💰 Record Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed border-border rounded-2xl">
            <div className="text-4xl mb-4 opacity-20">📁</div>
            <p className="text-muted font-medium">No projects yet. Convert a strong lead to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
