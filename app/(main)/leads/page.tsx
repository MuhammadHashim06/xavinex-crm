"use client";

import React, { useState, useEffect } from "react";
import LeadsPipeline from "@/components/Leads/LeadsPipeline";
import AddLeadModal from "@/components/Modals/AddLeadModal";
import OrderLockModal from "@/components/Modals/OrderLockModal";
import { useRouter } from "next/navigation";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isOrderLockModalOpen, setIsOrderLockModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const res = await fetch("/api/leads");
    setLeads(await res.json());
    setLoading(false);
  };

  const updateLeadStatus = async (id: string, status: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchLeads();
  };

  const addFollowUp = async (id: string, note: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        $push: { followUpHistory: { note, date: new Date() } } 
      }),
    });
    fetchLeads();
  };

  const editFollowUp = async (leadId: string, entryId: string, note: string) => {
    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        update: { $set: { "followUpHistory.$[elem].note": note } },
        options: { arrayFilters: [{ "elem._id": entryId }] }
      }),
    });
    fetchLeads();
  };

  const deleteFollowUp = async (leadId: string, entryId: string) => {
    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        $pull: { followUpHistory: { _id: entryId } } 
      }),
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
        loading={loading}
        onAddLeadClick={() => setIsLeadModalOpen(true)}
        onStatusChange={updateLeadStatus}
        onAddFollowUp={addFollowUp}
        onEditFollowUp={editFollowUp}
        onDeleteFollowUp={deleteFollowUp}
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
