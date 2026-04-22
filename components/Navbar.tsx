"use client";

import React from "react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-white">X</div>
            <span className="text-xl font-bold tracking-tight text-white">XAVINEX <span className="text-accent">CRM</span></span>
          </div>
          <div className="flex space-x-1">
            {["Dashboard", "Leads", "Projects", "Retainerships"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab 
                    ? "bg-accent text-white shadow-lg shadow-accent/20" 
                    : "text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
