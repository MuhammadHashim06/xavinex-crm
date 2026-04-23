"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-accent/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto pt-14 md:pt-0">
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <footer className="py-8 border-t border-border mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center text-xs text-muted">
            <p>© 2026 Xavinex CRM. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> System Online
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
