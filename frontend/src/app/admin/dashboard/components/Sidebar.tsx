"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, LogOut, Settings, ShieldCheck, CreditCard, BookOpen } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", tab: "dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "All Enquiries", tab: "enquiries", path: "/admin/dashboard?tab=enquiries", icon: <Users className="w-5 h-5" /> },
    { name: "Payment Logs", tab: "payments", path: "/admin/dashboard?tab=payments", icon: <CreditCard className="w-5 h-5" /> },
    { name: "Manage Plans", tab: "plans", path: "/admin/dashboard?tab=plans", icon: <BookOpen className="w-5 h-5" /> },
    { name: "Settings", tab: "settings", path: "/admin/dashboard?tab=settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 h-screen bg-[#001235] border-r border-white/5 flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 bg-gradient-to-br from-[#f48c06] to-[#d07403] rounded-xl flex items-center justify-center shadow-lg shadow-[#f48c06]/20 shrink-0">
          <ShieldCheck className="w-6 h-6 text-[#000a20]" />
        </div>
        <div>
          <h1 className="text-white font-black tracking-tight text-lg leading-none">JMS Admin</h1>
          <span className="text-[#f48c06] text-[10px] font-bold uppercase tracking-widest">Portal</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <Link key={item.name} href={item.path} className="w-full">
              <button
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm w-full text-left
                  ${isActive 
                    ? "bg-[#f48c06]/10 text-[#f48c06] border border-[#f48c06]/20" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"}
                `}
              >
                {item.icon}
                {item.name}
              </button>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm w-full text-left text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5" />
          Logout Session
        </button>
      </div>
    </div>
  );
}
