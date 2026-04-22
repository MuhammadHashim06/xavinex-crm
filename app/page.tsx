"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import DashboardView from "@/components/Dashboard/DashboardView";
import LeadsPipeline from "@/components/Leads/LeadsPipeline";
import ProjectsList from "@/components/Projects/ProjectsList";
import AddLeadModal from "@/components/Modals/AddLeadModal";
import OrderLockModal from "@/components/Modals/OrderLockModal";
import ManualProjectModal from "@/components/Modals/ManualProjectModal";
import AddRetainershipModal from "@/components/Modals/AddRetainershipModal";
import RetainershipsList from "@/components/Projects/RetainershipsList";
import AddPaymentModal from "@/components/Modals/AddPaymentModal";

// --- Types ---
interface Lead {
  _id: string;
  clientName: string;
  source: "Direct" | "Fiverr";
  status: string;
  whatsapp?: string;
  email?: string;
  fiverrUsername?: string;
  orderId?: string;
  followUpNotes?: string;
  createdAt: string;
}

interface Project {
  _id: string;
  projectName: string;
  clientName: string;
  date: string;
  timeline: string;
  totalBudget: string;
  outstandingBalance: string;
  status: string;
  createdAt: string;
}

interface Retainership {
  _id: string;
  projectName: string;
  clientName: string;
  date: string;
  duration: string;
  price: number;
  createdAt: string;
}

interface Payment {
  _id: string;
  projectId: string;
  clientName: string;
  amount: number;
  date: string;
  description?: string;
  createdAt: string;
}

export default function XavinexCRM() {
  const [activeTab, setActiveTab] = useState<"Dashboard" | "Leads" | "Projects" | "Retainerships">("Dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [retainerships, setRetainerships] = useState<Retainership[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isOrderLockModalOpen, setIsOrderLockModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isRetainershipModalOpen, setIsRetainershipModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch Data
  const fetchData = async () => {
    try {
      const [leadsRes, projectsRes, retainershipsRes, paymentsRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/projects"),
        fetch("/api/retainerships"),
        fetch("/api/payments"),
      ]);
      const leadsData = await leadsRes.json();
      const projectsData = await projectsRes.json();
      const retainershipsData = await retainershipsRes.json();
      const paymentsData = await paymentsRes.json();
      
      if (Array.isArray(leadsData)) setLeads(leadsData);
      else setLeads([]);
      
      if (Array.isArray(projectsData)) setProjects(projectsData);
      else setProjects([]);

      if (Array.isArray(retainershipsData)) setRetainerships(retainershipsData);
      else setRetainerships([]);

      if (Array.isArray(paymentsData)) setPayments(paymentsData);
      else setPayments([]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddLead = async (data: any) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchData();
        setIsLeadModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to add lead:", error);
    }
  };

  const handleAddRetainership = async (data: any) => {
    try {
      const res = await fetch("/api/retainerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchData();
        setIsRetainershipModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to add retainership:", error);
    }
  };

  const handleAddPayment = async (data: any) => {
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchData();
        setIsPaymentModalOpen(false);
        setSelectedProject(null);
      }
    } catch (error) {
      console.error("Failed to add payment:", error);
    }
  };

  const deleteRetainership = async (id: string) => {
    try {
      const res = await fetch(`/api/retainerships/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Failed to delete retainership:", error);
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const updateLeadNotes = async (id: string, followUpNotes: string) => {
    console.log("Updating Lead Notes:", { id, followUpNotes });
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followUpNotes }),
      });
      if (res.ok) {
        console.log("Notes updated successfully");
        await fetchData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update notes:", error);
      return false;
    }
  };

  const updateProjectStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to update project status:", error);
    }
  };

  const handleOrderLock = async (data: any) => {
    if (!selectedLead) return;
    try {
      // 1. Create Project
      const projectRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: selectedLead.clientName,
          ...data,
          status: "In Progress",
        }),
      });

      if (projectRes.ok) {
        // 2. Delete Lead
        await fetch(`/api/leads/${selectedLead._id}`, {
          method: "DELETE",
        });
        
        fetchData();
        setIsOrderLockModalOpen(false);
        setSelectedLead(null);
        setActiveTab("Projects");
      }
    } catch (error) {
      console.error("Failed to lock order:", error);
    }
  };

  const handleManualProjectAdd = async (data: any) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "In Progress" }),
      });
      if (res.ok) {
        fetchData();
        setIsProjectModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-accent/30">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "Dashboard" && (
          <DashboardView 
            leads={leads} 
            projects={projects} 
            retainerships={retainerships}
            payments={payments}
            onAddLeadClick={() => { setActiveTab("Leads"); setIsLeadModalOpen(true); }} 
          />
        )}

        {activeTab === "Leads" && (
          <LeadsPipeline 
            leads={leads} 
            onAddLeadClick={() => setIsLeadModalOpen(true)}
            onStatusChange={updateLeadStatus}
            onNotesChange={updateLeadNotes}
            onOrderLock={(lead) => { setSelectedLead(lead); setIsOrderLockModalOpen(true); }}
          />
        )}

        {activeTab === "Projects" && (
          <ProjectsList 
            projects={projects} 
            onStatusChange={updateProjectStatus}
            onAddProjectClick={() => setIsProjectModalOpen(true)}
            onAddPaymentClick={(project: any) => { setSelectedProject(project); setIsPaymentModalOpen(true); }}
          />
        )}

        {activeTab === "Retainerships" && (
          <RetainershipsList 
            retainerships={retainerships}
            onAddClick={() => setIsRetainershipModalOpen(true)}
            onDelete={deleteRetainership}
          />
        )}
      </main>

      <AddLeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        onSubmit={handleAddLead} 
      />

      <OrderLockModal 
        isOpen={isOrderLockModalOpen} 
        onClose={() => setIsOrderLockModalOpen(false)} 
        lead={selectedLead}
        onSubmit={handleOrderLock}
      />

      <ManualProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        onSubmit={handleManualProjectAdd} 
      />

      <AddRetainershipModal 
        isOpen={isRetainershipModalOpen}
        onClose={() => setIsRetainershipModalOpen(false)}
        onSubmit={handleAddRetainership}
      />

      <AddPaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => { setIsPaymentModalOpen(false); setSelectedProject(null); }}
        project={selectedProject}
        onSubmit={handleAddPayment}
      />

      <footer className="py-8 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center text-xs text-muted">
          <p>© 2026 Xavinex CRM. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> System Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
