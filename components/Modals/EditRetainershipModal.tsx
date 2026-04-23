"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import DateInput from "../ui/DateInput";

interface EditRetainershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  retainership: {
    _id: string;
    projectName: string;
    clientName: string;
    startDate: string;
    endDate: string;
    price: number;
  } | null;
  onSubmit: (id: string, data: any) => void;
}

const EditRetainershipModal: React.FC<EditRetainershipModalProps> = ({ isOpen, onClose, retainership, onSubmit }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    startDate: "",
    endDate: "",
    price: "",
  });

  useEffect(() => {
    if (retainership) {
      setFormData({
        projectName: retainership.projectName || "",
        clientName: retainership.clientName || "",
        startDate: retainership.startDate ? new Date(retainership.startDate).toISOString().split("T")[0] : "",
        endDate: retainership.endDate ? new Date(retainership.endDate).toISOString().split("T")[0] : "",
        price: retainership.price.toString(),
      });
    }
  }, [retainership]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retainership) return;
    onSubmit(retainership._id, {
      ...formData,
      price: parseFloat(formData.price),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Retainership Details">
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

        <div>
          <label className="block text-[10px] font-bold text-muted uppercase mb-1.5">Price / Month ($)</label>
          <input 
            required
            type="number" 
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 rounded-xl mt-4 transition-all glow-button">
          Save Changes
        </button>
      </form>
    </Modal>
  );
};

export default EditRetainershipModal;
