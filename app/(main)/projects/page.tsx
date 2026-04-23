"use client";

import React, { useState, useEffect } from "react";
import ProjectsList from "@/components/Projects/ProjectsList";
import ManualProjectModal from "@/components/Modals/ManualProjectModal";
import AddPaymentModal from "@/components/Modals/AddPaymentModal";
import ProjectSummaryModal from "@/components/Modals/ProjectSummaryModal";
import EditProjectModal from "@/components/Modals/EditProjectModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [pRes, payRes] = await Promise.all([
      fetch("/api/projects"),
      fetch("/api/payments"),
    ]);
    setProjects(await pRes.json());
    setPayments(await payRes.json());
    setLoading(false);
  };

  const handleAddProject = async (data: any) => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      fetchData();
      setIsProjectModalOpen(false);
    }
  };

  const handleAddPayment = async (data: any) => {
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      fetchData();
      setIsPaymentModalOpen(false);
    }
  };

  const handleEditProject = async (id: string, data: any) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      fetchData();
      setIsEditModalOpen(false);
    }
  };

  const updateProjectStatus = async (id: string, status: string) => {
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  const handleDeleteProject = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleDeletePayment = async (id: string) => {
    await fetch(`/api/payments/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <>
      <ProjectsList 
        projects={projects} 
        loading={loading}
        onStatusChange={updateProjectStatus}
        onAddProjectClick={() => setIsProjectModalOpen(true)}
        onAddPaymentClick={(project: any) => { setSelectedProject(project); setIsPaymentModalOpen(true); }}
        onViewSummaryClick={(project: any) => { setSelectedProject(project); setIsSummaryModalOpen(true); }}
        onEditProjectClick={(project: any) => { setSelectedProject(project); setIsEditModalOpen(true); }}
        onDeleteProject={handleDeleteProject}
      />

      <ManualProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        onSubmit={handleAddProject} 
      />

      <AddPaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => { setIsPaymentModalOpen(false); setSelectedProject(null); }}
        project={selectedProject}
        onSubmit={handleAddPayment}
      />

      <ProjectSummaryModal 
        isOpen={isSummaryModalOpen}
        onClose={() => { setIsSummaryModalOpen(false); setSelectedProject(null); }}
        project={selectedProject}
        payments={payments}
        onDeletePayment={handleDeletePayment}
      />

      <EditProjectModal 
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedProject(null); }}
        project={selectedProject}
        onSubmit={handleEditProject}
      />
    </>
  );
}
