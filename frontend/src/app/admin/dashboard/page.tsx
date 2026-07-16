"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "./components/Sidebar";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  ChevronDown, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  IndianRupee, 
  CreditCard, 
  RefreshCw,
  Settings
} from "lucide-react";

interface Admission {
  _id: string;
  name: string;
  phone: string;
  whatsapp: string;
  course: string;
  shift: string;
  status: string;
  createdAt: string;
}

interface Payment {
  _id: string;
  studentName: string;
  studentEmail: string;
  batchName: string;
  amount: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: string;
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  contacted: number;
  admitted: number;
  totalRevenue: number;
  successfulPayments: number;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // Fetch Stats
      const statsRes = await fetch("http://localhost:5000/api/admin/dashboard-stats", { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else if (statsRes.status === 401 || statsRes.status === 403) {
         localStorage.removeItem("adminToken");
         router.push("/admin/login");
         return;
      }

      // Fetch Admissions
      const admissionsRes = await fetch("http://localhost:5000/api/admin/admissions", { headers });
      if (admissionsRes.ok) {
        const admissionsData = await admissionsRes.json();
        setAdmissions(admissionsData);
      }

      // Fetch Payments
      const paymentsRes = await fetch("http://localhost:5000/api/admin/payments", { headers });
      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData);
      }

    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/admin/admissions/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Optimistic update
        setAdmissions(admissions.map(adm => adm._id === id ? { ...adm, status: newStatus } : adm));
        // Refresh stats
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Contacted": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Admitted": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Cancelled": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040814]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f48c06] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040814] flex">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "enquiries" && "All Enquiries"}
              {activeTab === "payments" && "Razorpay Payment Logs"}
              {activeTab === "settings" && "Admin Portal Settings"}
            </h1>
            <p className="text-gray-400 font-medium text-sm">
              Welcome back, Admin! Here is the latest system data.
            </p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl border border-white/10 transition-colors font-bold shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Enquiries", value: stats?.total || 0, icon: <FileText className="w-5 h-5 text-blue-400" />, color: "from-blue-600 to-blue-400" },
            { label: "Total Admitted", value: stats?.admitted || 0, icon: <CheckCircle className="w-5 h-5 text-green-400" />, color: "from-green-600 to-emerald-400" },
            { label: "Total Revenue", value: `₹${stats?.totalRevenue || 0}`, icon: <IndianRupee className="w-5 h-5 text-[#f48c06]" />, color: "from-amber-500 to-yellow-400" },
            { label: "Online Course Sales", value: stats?.successfulPayments || 0, icon: <CreditCard className="w-5 h-5 text-purple-400" />, color: "from-purple-500 to-pink-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#001235] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
              <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 blur-xl`} />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl text-white">
                  {stat.icon}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Content Views */}
        {activeTab === "dashboard" || activeTab === "enquiries" ? (
          <div className="bg-[#001235] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#00173d]/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#f48c06]" />
                Recent Student Enquiries
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#001235] border-b border-white/5 text-xs uppercase tracking-wider text-gray-500 font-bold">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Course & Shift</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {admissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No applications found yet.
                      </td>
                    </tr>
                  ) : (
                    admissions.map((adm) => (
                      <tr key={adm._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm">{adm.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <a href={`tel:${adm.phone}`} className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 font-medium">
                              <Phone className="w-3 h-3" /> {adm.phone}
                            </a>
                            <a href={`https://wa.me/91${adm.whatsapp}`} target="_blank" rel="noreferrer" className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1.5 font-medium">
                              <MessageCircle className="w-3 h-3" /> {adm.whatsapp} <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300 font-semibold">{adm.course}</div>
                          <div className="text-xs text-gray-500 mt-0.5 font-medium">{adm.shift}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-400 font-semibold">
                            {new Date(adm.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(adm.status)}`}>
                            {adm.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right relative">
                          <select
                            value={adm.status}
                            disabled={updatingId === adm._id}
                            onChange={(e) => handleStatusUpdate(adm._id, e.target.value)}
                            className="appearance-none bg-[#040814] border border-white/10 text-white text-xs px-3 py-1.5 pr-8 rounded-lg cursor-pointer focus:outline-none focus:border-[#f48c06]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Admitted">Admitted</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-gray-400 absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "payments" ? (
          <div className="bg-[#001235] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#00173d]/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#f48c06]" />
                Successful Razorpay Transactions
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#001235] border-b border-white/5 text-xs uppercase tracking-wider text-gray-500 font-bold">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Batch / Package</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Razorpay Payment ID</th>
                    <th className="px-6 py-4">Razorpay Order ID</th>
                    <th className="px-6 py-4">Payment Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No transactions captured yet.
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm">{payment.studentName}</div>
                          <div className="text-xs text-gray-500 font-medium mt-0.5">{payment.studentEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-[#f48c06]">{payment.batchName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-white">₹{payment.amount}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-green-400">{payment.razorpayPaymentId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-gray-400">{payment.razorpayOrderId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-400 font-semibold">
                            {new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-[#001235] border border-white/5 rounded-2xl p-8 text-center text-gray-400">
            <Settings className="w-12 h-12 text-[#f48c06] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Settings & Configuration</h3>
            <p className="max-w-md mx-auto text-sm leading-relaxed">
              JMS Modern Classes admin portal settings can be customized here in future releases.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#040814]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f48c06] border-t-transparent"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
