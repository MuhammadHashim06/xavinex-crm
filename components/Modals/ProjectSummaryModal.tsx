"use client";

import React from "react";
import Modal from "../ui/Modal";

interface Payment {
  _id: string;
  projectId: string;
  amount: number;
  date: string;
  description?: string;
}

interface ProjectSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    _id: string;
    projectName: string;
    clientName: string;
    totalBudget: string;
    outstandingBalance: string;
    status: string;
  } | null;
  payments: Payment[];
  onDeletePayment: (id: string) => void;
}

const ProjectSummaryModal: React.FC<ProjectSummaryModalProps> = ({ isOpen, onClose, project, payments, onDeletePayment }) => {
  if (!project) return null;

  const projectPayments = payments.filter(p => p.projectId === project._id);
  const totalCollected = parseFloat(project.totalBudget) - parseFloat(project.outstandingBalance);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Project Summary: ${project.projectName}`}>
      <div className="space-y-6">
        {/* Project Details Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-2xl border border-border">
          <div>
            <p className="text-[10px] font-bold text-muted uppercase">Client Name</p>
            <p className="text-sm font-bold text-white">{project.clientName}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted uppercase">Status</p>
            <p className="text-sm font-bold text-accent">{project.status}</p>
          </div>
          <div className="pt-2 border-t border-border/50">
            <p className="text-[10px] font-bold text-muted uppercase">Total Budget</p>
            <p className="text-lg font-bold text-white">${project.totalBudget}</p>
          </div>
          <div className="pt-2 border-t border-border/50">
            <p className="text-[10px] font-bold text-muted uppercase">Outstanding</p>
            <p className="text-lg font-bold text-orange-400">${project.outstandingBalance}</p>
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Payment History
          </h3>
          
          <div className="space-y-2">
            {projectPayments.length > 0 ? (
              projectPayments.map((payment) => (
                <div key={payment._id} className="flex justify-between items-center p-3 bg-background border border-border rounded-xl group hover:border-accent/30 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-white">${payment.amount}</p>
                    <p className="text-[10px] text-muted italic">{payment.description || "No description"}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[10px] text-muted">{new Date(payment.date).toLocaleDateString()}</p>
                    <button 
                      onClick={() => { if(confirm("Delete this payment?")) onDeletePayment(payment._id); }}
                      className="text-rose-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Payment"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted italic py-4 text-center border border-dashed border-border rounded-xl">No payments recorded yet.</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-between items-center text-[10px] text-muted">
          <p>Total Collected: <span className="text-emerald-500 font-bold">${totalCollected.toFixed(2)}</span></p>
          <p>Project ID: {project._id}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectSummaryModal;
