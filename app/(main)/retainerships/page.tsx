"use client";

import React, { useState, useEffect } from "react";
import RetainershipsList from "@/components/Projects/RetainershipsList";
import AddRetainershipModal from "@/components/Modals/AddRetainershipModal";

export default function RetainershipsPage() {
  const [retainerships, setRetainerships] = useState([]);
  const [isRetainershipModalOpen, setIsRetainershipModalOpen] = useState(false);

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
      setIsRetainershipModalOpen(false);
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
        onAddClick={() => setIsRetainershipModalOpen(true)} 
        onDelete={handleDeleteRetainership} 
      />

      <AddRetainershipModal 
        isOpen={isRetainershipModalOpen} 
        onClose={() => setIsRetainershipModalOpen(false)} 
        onSubmit={handleAddRetainership} 
      />
    </>
  );
}
