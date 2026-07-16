"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      const isLoginPage = pathname === "/admin/login";

      if (!token && !isLoginPage) {
        router.push("/admin/login");
      } else if (token && (isLoginPage || pathname === "/admin")) {
        router.push("/admin/dashboard");
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#001235]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f48c06] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040814] text-gray-200 selection:bg-[#f48c06] selection:text-[#0a1c5d] font-sans">
      {children}
    </div>
  );
}
