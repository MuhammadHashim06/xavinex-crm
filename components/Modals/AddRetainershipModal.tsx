"use client";

import React, { useState } from "react";
import Modal from "../ui/Modal";

interface AddRetainershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddRetainershipModal: React.FC<AddRetainershipModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    duration: "",
    price: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price as string),
    });
    setFormData({
      projectName: "",
      clientName: "",
      duration: "",
      price: "",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Monthly Retainership">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-muted uppercase mb-1.5">Project Name</label>
          <input 
            required
            type="text" 
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            placeholder="e.g. Social Media Management"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-muted uppercase mb-1.5">Client Name</label>
          <input 
            required
            type="text" 
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            placeholder="e.g. Acme Corp"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase mb-1.5">Duration</label>
            <input 
              required
              type="text" 
              placeholder="e.g. 6 Months"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase mb-1.5">Price / Month ($)</label>
            <input 
              required
              type="number" 
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl mt-4 transition-all glow-button">
          Activate Retainership
        </button>
      </form>
    </Modal>
  );
};

export default AddRetainershipModal;
