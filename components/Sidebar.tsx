"use client";

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Target, 
  Rocket, 
  RefreshCw, 
  LogOut,
  Wallet,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Leads", icon: Target, href: "/leads" },
    { name: "Projects", icon: Rocket, href: "/projects" },
    { name: "Retainerships", icon: RefreshCw, href: "/retainerships" },
    { name: "Wallet", icon: Wallet, href: "/wallet" },
  ];

  const navContent = (
    <>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-accent/20">X</div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-white leading-tight">XAVINEX</span>
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Management</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                pathname === item.href 
                  ? "bg-accent text-white shadow-xl shadow-accent/10" 
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-border bg-white/[0.02]">
        <div className="flex items-center gap-3 p-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold text-sm border border-accent/20 shadow-inner">
            {session?.user?.name?.[0] || "A"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate">{session?.user?.name || "Admin User"}</span>
            <span className="text-[10px] text-muted truncate">{session?.user?.email || "admin@xavinex.com"}</span>
          </div>
        </div>
        
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all duration-300 group"
        >
          <LogOut size={16} className="group-hover:scale-110 transition-transform" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card/95 backdrop-blur-lg border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-accent/20">X</div>
          <span className="text-sm font-bold text-white tracking-tight">XAVINEX</span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-white hover:bg-white/5 transition-all"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-Out Drawer */}
      <aside className={`md:hidden fixed top-14 left-0 bottom-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {navContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen sticky top-0 flex-col bg-card border-r border-border overflow-hidden">
        {navContent}
      </aside>
    </>
  );
};

export default Sidebar;
