"use client";

import React, { useState, useEffect } from "react";
import LeadsPipeline from "@/components/Leads/LeadsPipeline";
import AddLeadModal from "@/components/Modals/AddLeadModal";
import OrderLockModal from "@/components/Modals/OrderLockModal";
import { useRouter } from "next/navigation";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isOrderLockModalOpen, setIsOrderLockModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await fetch("/api/leads");
    setLeads(await res.json());
  };

  const updateLeadStatus = async (id: string, status: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchLeads();
  };

  const updateLeadNotes = async (id: string, notes: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followUpNotes: notes }),
    });
    fetchLeads();
  };

  const handleAddLead = async (data: any) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      fetchLeads();
      setIsLeadModalOpen(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    fetchLeads();
  };

  const handleOrderLock = async (data: any) => {
    if (!selectedLead) return;
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: selectedLead.clientName,
        ...data,
        status: "In Progress",
      }),
    });
    if (res.ok) {
      await updateLeadStatus(selectedLead._id, "Order Locked");
      setIsOrderLockModalOpen(false);
      router.push("/projects");
    }
  };

  return (
    <>
      <LeadsPipeline 
        leads={leads} 
        onAddLeadClick={() => setIsLeadModalOpen(true)}
        onStatusChange={updateLeadStatus}
        onNotesChange={updateLeadNotes}
        onDelete={handleDeleteLead}
        onOrderLock={(lead) => { setSelectedLead(lead); setIsOrderLockModalOpen(true); }}
      />

      <AddLeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        onSubmit={handleAddLead} 
      />

      <OrderLockModal 
        isOpen={isOrderLockModalOpen}
        onClose={() => setIsOrderLockModalOpen(false)}
        onSubmit={handleOrderLock}
        lead={selectedLead}
      />
    </>
  );
}
