"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001235]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f48c06] border-t-transparent"></div>
    </div>
  );
}
