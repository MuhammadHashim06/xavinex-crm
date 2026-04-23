"use client";

import React, { useState, useEffect } from "react";
import DashboardView from "@/components/Dashboard/DashboardView";
import AddLeadModal from "@/components/Modals/AddLeadModal";

export default function DashboardPage() {
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [retainerships, setRetainerships] = useState([]);
  const [payments, setPayments] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [lRes, pRes, rRes, payRes, wRes, tRes] = await Promise.all([
      fetch("/api/leads"),
      fetch("/api/projects"),
      fetch("/api/retainerships"),
      fetch("/api/payments"),
      fetch("/api/wallets"),
      fetch("/api/transactions"),
    ]);
    setLeads(await lRes.json());
    setProjects(await pRes.json());
    setRetainerships(await rRes.json());
    setPayments(await payRes.json());
    setWallets(await wRes.json());
    setTransactions(await tRes.json());
  };

  const handleAddLead = async (data: any) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      fetchData();
      setIsLeadModalOpen(false);
    }
  };

  return (
    <>
      <DashboardView 
        leads={leads} 
        projects={projects} 
        retainerships={retainerships}
        payments={payments}
        wallets={wallets}
        transactions={transactions}
        onAddLeadClick={() => setIsLeadModalOpen(true)} 
      />

      <AddLeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        onSubmit={handleAddLead} 
      />
    </>
  );
}
