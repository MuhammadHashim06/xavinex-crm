"use client";

import React, { useState } from "react";
import Modal from "../ui/Modal";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: any) => void;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    source: "Direct" as "Direct" | "Fiverr",
    whatsapp: "",
    email: "",
    fiverrUsername: "",
    orderId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      clientName: "",
      source: "Direct",
      whatsapp: "",
      email: "",
      fiverrUsername: "",
      orderId: "",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Lead">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-muted uppercase mb-1.5">Client Name</label>
          <input 
            required
            type="text" 
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            placeholder="e.g. John Doe"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-muted uppercase mb-1.5">Lead Source</label>
          <div className="grid grid-cols-2 gap-3">
            {(["Direct", "Fiverr"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFormData({ ...formData, source: s })}
                className={`py-3 rounded-xl border font-bold transition-all ${
                  formData.source === s 
                    ? "bg-accent/10 border-accent text-accent shadow-inner" 
                    : "bg-background border-border text-muted hover:border-accent"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {formData.source === "Direct" ? (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-xs font-bold text-muted uppercase mb-1.5">WhatsApp</label>
              <input 
                type="text" 
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+1..."
                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase mb-1.5">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@..."
                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-xs font-bold text-muted uppercase mb-1.5">Fiverr Username</label>
              <input 
                type="text" 
                value={formData.fiverrUsername}
                onChange={(e) => setFormData({ ...formData, fiverrUsername: e.target.value })}
                placeholder="username"
                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase mb-1.5">Order ID</label>
              <input 
                type="text" 
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                placeholder="#FO..."
                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        )}

        <button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 rounded-xl mt-4 transition-all glow-button">
          Create Lead
        </button>
      </form>
    </Modal>
  );
};

export default AddLeadModal;
