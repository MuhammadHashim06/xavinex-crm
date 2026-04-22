"use client";

import React, { useState } from "react";
import Modal from "../ui/Modal";

interface ManualProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ManualProjectModal: React.FC<ManualProjectModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    date: new Date().toISOString().split("T")[0],
    timeline: "",
    totalBudget: "",
    outstandingBalance: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      projectName: "",
      clientName: "",
      date: new Date().toISOString().split("T")[0],
      timeline: "",
      totalBudget: "",
      outstandingBalance: "",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Manual Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-muted uppercase mb-1.5">Project Name</label>
          <input 
            required
            type="text" 
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            placeholder="e.g. Website Redesign"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-muted uppercase mb-1.5">Client Name</label>
          <input 
            required
            type="text" 
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            placeholder="e.g. John Doe"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase mb-1.5">Date</label>
            <input 
              required
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase mb-1.5">Timeline</label>
            <input 
              required
              type="text" 
              placeholder="e.g. 2 weeks"
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-muted uppercase mb-1.5">Total Budget ($)</label>
          <input 
            required
            type="number" 
            placeholder="0.00"
            value={formData.totalBudget}
            onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-muted uppercase mb-1.5">Outstanding Balance ($)</label>
          <input 
            required
            type="number" 
            placeholder="0.00"
            value={formData.outstandingBalance}
            onChange={(e) => setFormData({ ...formData, outstandingBalance: e.target.value })}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent"
          />
        </div>

        <button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 rounded-xl mt-4 transition-all glow-button">
          Create Project
        </button>
      </form>
    </Modal>
  );
};

export default ManualProjectModal;
