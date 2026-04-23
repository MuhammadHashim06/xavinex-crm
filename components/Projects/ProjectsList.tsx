"use client";

import React from "react";
import { 
  Plus, 
  DollarSign, 
  Pencil, 
  Trash2, 
  Wallet,
  CheckCircle2,
  AlertCircle,
  FolderOpen
} from "lucide-react";
import Skeleton from "../ui/Skeleton";

interface Project {
  _id: string;
  projectName: string;
  clientName: string;
  startDate: string;
  endDate: string;
  totalBudget: string;
  outstandingBalance: string;
  status: string;
}

interface ProjectsListProps {
  projects: Project[];
  loading?: boolean;
  onStatusChange: (id: string, status: string) => void;
  onAddProjectClick: () => void;
  onAddPaymentClick: (project: Project) => void;
  onViewSummaryClick: (project: Project) => void;
  onEditProjectClick: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, loading, onStatusChange, onAddProjectClick, onAddPaymentClick, onViewSummaryClick, onEditProjectClick, onDeleteProject }) => {
  const statuses = ["All Projects", "In Progress", "Completed", "On Hold", "Cancelled", "Unpaid"];
  const [activeTab, setActiveTab] = React.useState(statuses[0]);

  const filteredProjects = projects.filter(p => {
    if (activeTab === "All Projects") return true;
    if (activeTab === "Unpaid") return parseFloat(p.outstandingBalance || "0") > 0;
    return p.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "In Progress": return "bg-blue-500";
      case "Completed": return "bg-emerald-500";
      case "On Hold": return "bg-amber-500";
      case "Cancelled": return "bg-rose-500";
      case "Unpaid": return "bg-orange-500";
      default: return "bg-zinc-600";
    }
  };

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

  const activeProjects = projects.filter(p => p.status !== "Cancelled");
  const totalBudget = activeProjects.reduce((sum, p) => sum + parseFloat(p.totalBudget || "0"), 0);
  const totalOutstanding = activeProjects.reduce((sum, p) => sum + parseFloat(p.outstandingBalance || "0"), 0);
  const totalCollected = totalBudget - totalOutstanding;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Project Pipeline</h1>
          <p className="text-muted">Tracking your active orders and financial overview.</p>
        </div>
        <button 
          onClick={onAddProjectClick}
          className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all glow-button flex items-center gap-2"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Active Pipeline", value: `$${totalBudget.toLocaleString()}`, color: "text-blue-500", bg: "bg-blue-500/10", icon: FolderOpen },
          { label: "Total Collected", value: `$${totalCollected.toLocaleString()}`, color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
          { label: "Total Outstanding", value: `$${totalOutstanding.toLocaleString()}`, color: "text-orange-500", bg: "bg-orange-500/10", icon: AlertCircle },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-5 bg-card border border-border rounded-2xl flex items-center justify-between">
              {loading ? (
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-20 h-2" />
                  <Skeleton className="w-24 h-6" />
                </div>
              ) : (
                <div>
                  <h3 className="text-muted text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</h3>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              )}
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
          const count = status === "All Projects" 
            ? projects.length 
            : status === "Unpaid"
              ? projects.filter(p => parseFloat(p.outstandingBalance || "0") > 0).length
              : projects.filter(p => p.status === status).length;
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
              {status !== "All Projects" && (
                <span className={`w-2 h-2 rounded-full ${getStatusColor(status)} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
              )}
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

      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.length > 0 ? (
          <div className="bg-card border border-border rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-background/50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider text-left">Project</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider text-left">Client</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider text-left">Timeline & Progress</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider text-left">Budget</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider text-left text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-48" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-6 py-4 text-center"><Skeleton className="h-6 w-20 rounded-full mx-auto" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-8 w-24" /></td>
                    </tr>
                  ))
                ) : (
                  filteredProjects.map((project) => {
                    const progress = calculateProgress(project.startDate, project.endDate);
                    return (
                      <tr key={project._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => onViewSummaryClick(project)}
                            className="flex flex-col items-start text-left hover:text-accent transition-colors"
                          >
                            <span className="font-bold text-white group-hover:text-accent transition-colors">{project.projectName || "N/A"}</span>
                            <span className="text-[10px] text-muted">{project._id.slice(-6)}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center text-accent font-bold text-[10px]">{project.clientName[0]}</div>
                            <span className="text-sm text-zinc-300">{project.clientName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2 min-w-[150px]">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-muted">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "N/A"}</span>
                              <span className="text-accent">{progress}%</span>
                              <span className="text-muted">{project.endDate ? new Date(project.endDate).toLocaleDateString() : "N/A"}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <div 
                                className={`h-full transition-all duration-1000 rounded-full ${
                                  progress > 90 ? "bg-rose-500" : progress > 50 ? "bg-amber-500" : "bg-accent"
                                }`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">${project.totalBudget}</span>
                            <span className="text-[10px] text-orange-400">Bal: ${project.outstandingBalance}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <select 
                            onChange={(e) => onStatusChange(project._id, e.target.value)}
                            value={project.status || "In Progress"}
                            className={`text-[10px] font-bold px-2 py-1 rounded-full bg-background border border-border focus:outline-none focus:border-accent uppercase ${
                              project.status === "Completed" ? "text-emerald-500" :
                              project.status === "On Hold" ? "text-amber-500" :
                              project.status === "Cancelled" ? "text-rose-500" : "text-blue-500"
                            }`}
                          >
                            {statuses.filter(s => s !== "All Projects" && s !== "Unpaid").map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => onAddPaymentClick(project)}
                              title="Record Payment"
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                            >
                              <Wallet size={16} />
                            </button>
                            <button 
                              onClick={() => onEditProjectClick(project)}
                              title="Edit Project"
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => { if(confirm("Are you sure?")) onDeleteProject(project._id); }}
                              title="Delete Project"
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed border-border rounded-2xl opacity-50">
            <FolderOpen size={48} className="text-muted/20 mb-4" />
            <p className="text-muted font-medium">No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
