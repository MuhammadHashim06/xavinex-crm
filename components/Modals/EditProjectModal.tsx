"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import DateInput from "../ui/DateInput";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    _id: string;
    projectName: string;
    clientName: string;
    totalBudget: string;
    outstandingBalance: string;
    startDate: string;
    endDate: string;
  } | null;
  onSubmit: (id: string, data: any) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project, onSubmit }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    totalBudget: "",
    outstandingBalance: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.projectName || "",
        clientName: project.clientName || "",
        totalBudget: project.totalBudget || "",
        outstandingBalance: project.outstandingBalance || "",
        startDate: project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : "",
        endDate: project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : "",
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    onSubmit(project._id, formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Project Details">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-muted uppercase mb-1.5">Project Name</label>
          <input 
            required
            type="text" 
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
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
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted uppercase mb-1.5">Total Budget ($)</label>
            <input 
              required
              type="text" 
              value={formData.totalBudget}
              onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted uppercase mb-1.5">Outstanding ($)</label>
            <input 
              required
              type="text" 
              value={formData.outstandingBalance}
              onChange={(e) => setFormData({ ...formData, outstandingBalance: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DateInput 
            label="Start Date"
            value={formData.startDate}
            onChange={(val) => setFormData({ ...formData, startDate: val })}
          />
          <DateInput 
            label="End Date"
            value={formData.endDate}
            onChange={(val) => setFormData({ ...formData, endDate: val })}
          />
        </div>

        <button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 rounded-xl mt-4 transition-all glow-button">
          Save Changes
        </button>
      </form>
    </Modal>
  );
};

export default EditProjectModal;
