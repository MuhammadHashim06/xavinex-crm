"use client";

import React, { useState, useEffect } from "react";
import RetainershipsList from "@/components/Projects/RetainershipsList";
import AddRetainershipModal from "@/components/Modals/AddRetainershipModal";
import EditRetainershipModal from "@/components/Modals/EditRetainershipModal";

export default function RetainershipsPage() {
  const [retainerships, setRetainerships] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRetainership, setSelectedRetainership] = useState<any>(null);

  useEffect(() => {
    fetchRetainerships();
  }, []);

  const fetchRetainerships = async () => {
    const res = await fetch("/api/retainerships");
    setRetainerships(await res.json());
  };

  const handleAddRetainership = async (data: any) => {
    const res = await fetch("/api/retainerships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      fetchRetainerships();
      setIsAddModalOpen(false);
    }
  };

  const handleEditRetainership = async (id: string, data: any) => {
    const res = await fetch(`/api/retainerships/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      fetchRetainerships();
      setIsEditModalOpen(false);
      setSelectedRetainership(null);
    }
  };

  const handleDeleteRetainership = async (id: string) => {
    if (confirm("Are you sure you want to delete this retainership?")) {
      await fetch(`/api/retainerships/${id}`, { method: "DELETE" });
      fetchRetainerships();
    }
  };

  return (
    <>
      <RetainershipsList 
        retainerships={retainerships} 
        onAddClick={() => setIsAddModalOpen(true)} 
        onDelete={handleDeleteRetainership} 
        onEditClick={(r) => { setSelectedRetainership(r); setIsEditModalOpen(true); }}
      />

      <AddRetainershipModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddRetainership} 
      />

      <EditRetainershipModal 
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedRetainership(null); }}
        retainership={selectedRetainership}
        onSubmit={handleEditRetainership}
      />
    </>
  );
}
