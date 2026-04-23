"use client";

import React, { useState } from "react";
import Modal from "../ui/Modal";
import { CheckCircle2 } from "lucide-react";

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: { _id: string; projectName: string; clientName: string; outstandingBalance: string } | null;
  onSubmit: (data: any) => void;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ isOpen, onClose, project, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [walletName, setWalletName] = useState("");
  const [wallets, setWallets] = useState<any[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      fetch("/api/wallets")
        .then(res => res.json())
        .then(data => {
          setWallets(data);
          if (data.length > 0) setWalletName(data[0].name);
        });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !walletName) return;

    onSubmit({
      projectId: project._id,
      amount: parseFloat(amount),
      description,
      walletName
    });

    setAmount("");
    setDescription("");
    setWalletName(wallets[0]?.name || "");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Record Payment: ${project?.projectName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl mb-4">
          <p className="text-xs text-muted">Client: <span className="text-white font-bold">{project?.clientName}</span></p>
          <p className="text-xs text-muted mt-1">Outstanding Balance: <span className="text-orange-400 font-bold">${project?.outstandingBalance}</span></p>
        </div>

        <div>
          <label className="block text-xs font-bold text-muted uppercase mb-1.5">Payment Amount ($)</label>
          <input
            required
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-muted uppercase mb-1.5">Description (Optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Initial Deposit, Milestone 1"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-muted uppercase mb-1.5">Target Wallet</label>
          <select
            required
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors cursor-pointer"
          >
            {wallets.map(w => (
              <option key={w._id} value={w.name}>{w.name} (Current: ${w.balance})</option>
            ))}
          </select>
        </div>

        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl mt-4 transition-all glow-button flex items-center justify-center gap-2">
          <CheckCircle2 size={18} /> Confirm Payment
        </button>
      </form>
    </Modal>
  );
};

export default AddPaymentModal;
