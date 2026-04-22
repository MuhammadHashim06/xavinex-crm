"use client";

import React, { useState } from "react";
import Modal from "../ui/Modal";

interface OrderLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: { clientName: string } | null;
  onSubmit: (data: { projectName: string; date: string; timeline: string; totalBudget: string; outstandingBalance: string }) => void;
}

const OrderLockModal: React.FC<OrderLockModalProps> = ({ isOpen, onClose, lead, onSubmit }) => {
  const [formData, setFormData] = useState({
    projectName: "",
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
      date: new Date().toISOString().split("T")[0],
      timeline: "",
      totalBudget: "",
      outstandingBalance: "",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Confirm Order: ${lead?.clientName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-muted mb-4">Confirming order for <span className="text-white font-bold">{lead?.clientName}</span>. This will move the lead to the Projects tab.</p>
        
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

        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-lg shadow-orange-500/20">
          Lock Order & Create Project
        </button>
      </form>
    </Modal>
  );
};

export default OrderLockModal;
