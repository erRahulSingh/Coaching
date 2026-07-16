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

  // Plans CRUD States
  const [plans, setPlans] = useState<any[]>([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    type: "library",
    time: "",
    price: 0,
    admissionFee: 0,
    features: "",
    color: "bg-[#0a1c5d] hover:bg-[#071444] text-white",
    bulletColor: "text-[#0a1c5d]",
    badge: ""
  });
  const [planError, setPlanError] = useState("");
  const [planSuccess, setPlanSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

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

      // Fetch Plans
      const plansRes = await fetch("http://localhost:5000/api/plans");
      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData);
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

  const handleOpenAddPlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: "",
      type: "library",
      time: "",
      price: 0,
      admissionFee: 0,
      features: "",
      color: "bg-[#0a1c5d] hover:bg-[#071444] text-white",
      bulletColor: "text-[#0a1c5d]",
      badge: ""
    });
    setPlanError("");
    setPlanSuccess("");
    setShowPlanModal(true);
  };

  const handleOpenEditPlan = (plan: any) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      type: plan.type,
      time: plan.time,
      price: plan.price,
      admissionFee: plan.admissionFee,
      features: plan.features.join("\n"),
      color: plan.color,
      bulletColor: plan.bulletColor,
      badge: plan.badge || ""
    });
    setPlanError("");
    setPlanSuccess("");
    setShowPlanModal(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlanError("");
    setPlanSuccess("");
    setActionLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const featuresArray = planForm.features.split("\n").map(f => f.trim()).filter(f => f !== "");
      
      const payload = {
        ...planForm,
        features: featuresArray
      };

      const url = editingPlan 
        ? `http://localhost:5000/api/admin/plans/${editingPlan._id}`
        : "http://localhost:5000/api/admin/plans";
        
      const method = editingPlan ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (res.ok) {
        setPlanSuccess(editingPlan ? "Plan updated successfully!" : "Plan created successfully!");
        fetchDashboardData();
        setTimeout(() => {
          setShowPlanModal(false);
        }, 1500);
      } else {
        setPlanError(resData.error || "Failed to save plan");
      }
    } catch (err) {
      setPlanError("Network error. Failed to save plan.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/admin/plans/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        setPlans(plans.filter(p => p._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete plan");
      }
    } catch (err) {
      alert("Network error. Failed to delete plan.");
    }
  };

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
        ) : activeTab === "plans" ? (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-[#001235] border border-white/5 rounded-2xl p-6 shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white">Manage Slots & Coaching Plans</h2>
                <p className="text-gray-400 text-xs mt-1">Configure pricing plans, shift timings, and courses shown on the website.</p>
              </div>
              <button
                onClick={handleOpenAddPlan}
                className="px-5 py-2.5 bg-[#f48c06] hover:bg-[#d07403] text-navy-deep font-bold rounded-xl transition-all shadow-lg text-sm"
              >
                + Add New Plan
              </button>
            </div>

            {/* Grid of Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Library Shifts Column */}
              <div className="bg-[#001235] border border-white/5 rounded-2xl p-6 shadow-xl">
                <h3 className="text-md font-bold text-white mb-6 border-b border-white/5 pb-3">Library Shift Slots</h3>
                <div className="space-y-4">
                  {plans.filter(p => p.type === "library").length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">No library shifts configured.</p>
                  ) : (
                    plans.filter(p => p.type === "library").map((plan) => (
                      <div key={plan._id} className="border border-white/5 rounded-xl p-4 bg-[#000a20] flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                          <span className="text-[10px] font-bold text-[#f48c06] bg-[#f48c06]/10 px-2 py-0.5 rounded-full mt-1 inline-block uppercase tracking-wider">{plan.time}</span>
                          <p className="text-xs font-bold text-white mt-2">Price: ₹{plan.price} | Fee: ₹{plan.admissionFee}</p>
                          <p className="text-[11px] text-gray-400 mt-2 font-medium">Features count: {plan.features.length}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleOpenEditPlan(plan)}
                            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-bold rounded-lg transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan._id)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Coaching Courses Column */}
              <div className="bg-[#001235] border border-white/5 rounded-2xl p-6 shadow-xl">
                <h3 className="text-md font-bold text-white mb-6 border-b border-white/5 pb-3">Coaching Classroom Programs</h3>
                <div className="space-y-4">
                  {plans.filter(p => p.type === "course").length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">No coaching programs configured.</p>
                  ) : (
                    plans.filter(p => p.type === "course").map((plan) => (
                      <div key={plan._id} className="border border-white/5 rounded-xl p-4 bg-[#000a20] flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                          <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full mt-1 inline-block uppercase tracking-wider">{plan.time}</span>
                          {plan.badge && <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full mt-1 ml-2 inline-block uppercase tracking-wider">{plan.badge}</span>}
                          <p className="text-xs font-semibold text-gray-400 mt-2">Admission form linked (Inquiry mode)</p>
                          <p className="text-[11px] text-gray-400 mt-2 font-medium">Features count: {plan.features.length}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleOpenEditPlan(plan)}
                            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-bold rounded-lg transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan._id)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* CRUD Edit/Add Modal Overlay */}
            {showPlanModal && (
              <div className="fixed inset-0 bg-[#000a20]/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                <div className="bg-[#001235] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">{editingPlan ? "Edit Plan / Fix Price" : "Add New Slot/Course"}</h3>
                    <button
                      onClick={() => setShowPlanModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSavePlan} className="p-6 space-y-4 font-sans text-left">
                    {planError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">{planError}</div>}
                    {planSuccess && <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs text-center">{planSuccess}</div>}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">Plan/Slot Name</label>
                        <input
                          type="text"
                          required
                          value={planForm.name}
                          onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                          placeholder="e.g. Special Shift"
                          className="w-full bg-[#000a20] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f48c06]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">Type</label>
                        <select
                          value={planForm.type}
                          onChange={(e) => setPlanForm({ ...planForm, type: e.target.value })}
                          className="w-full bg-[#000a20] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f48c06]"
                        >
                          <option value="library">Library Shift</option>
                          <option value="course">Academic Course</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">
                          {planForm.type === "library" ? "Shift Timing" : "Sub-timing / Affiliation"}
                        </label>
                        <input
                          type="text"
                          required
                          value={planForm.time}
                          onChange={(e) => setPlanForm({ ...planForm, time: e.target.value })}
                          placeholder={planForm.type === "library" ? "06:00 AM - 11:00 AM" : "Science, Commerce & Arts"}
                          className="w-full bg-[#000a20] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f48c06]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">Badge (Optional)</label>
                        <input
                          type="text"
                          value={planForm.badge}
                          onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                          placeholder="e.g. Coaching Class"
                          className="w-full bg-[#000a20] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f48c06]"
                        />
                      </div>
                    </div>

                    {planForm.type === "library" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1.5">Monthly Price (₹)</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={planForm.price}
                            onChange={(e) => setPlanForm({ ...planForm, price: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#000a20] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f48c06]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1.5">One-time Admission Fee (₹)</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={planForm.admissionFee}
                            onChange={(e) => setPlanForm({ ...planForm, admissionFee: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#000a20] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f48c06]"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Features / Bullet Points (One per line)</label>
                      <textarea
                        required
                        rows={4}
                        value={planForm.features}
                        onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                        placeholder="AC Study Hall&#10;High Speed Free Wi-Fi&#10;Comfortable Seat"
                        className="w-full bg-[#000a20] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f48c06] font-mono leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">Color Palette (CSS classes)</label>
                        <select
                          value={planForm.color}
                          onChange={(e) => setPlanForm({ ...planForm, color: e.target.value })}
                          className="w-full bg-[#000a20] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f48c06]"
                        >
                          <option value="bg-[#0a1c5d] hover:bg-[#071444] text-white">Deep Navy</option>
                          <option value="bg-[#f48c06] hover:bg-[#d07403] text-white">Vibrant Orange</option>
                          <option value="bg-[#10b981] hover:bg-[#059669] text-white">Emerald Green</option>
                          <option value="bg-[#6366f1] hover:bg-[#4f46e5] text-white">Indigo Blue</option>
                          <option value="bg-[#ec4899] hover:bg-[#db2777] text-white">Pink Rose</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">Bullet Mark Color</label>
                        <select
                          value={planForm.bulletColor}
                          onChange={(e) => setPlanForm({ ...planForm, bulletColor: e.target.value })}
                          className="w-full bg-[#000a20] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f48c06]"
                        >
                          <option value="text-[#0a1c5d]">Navy Blue</option>
                          <option value="text-[#f48c06]">Orange</option>
                          <option value="text-[#10b981]">Emerald Green</option>
                          <option value="text-[#6366f1]">Indigo</option>
                          <option value="text-[#ec4899]">Pink</option>
                          <option value="text-blue-500">Bright Blue</option>
                          <option value="text-purple-500">Purple</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowPlanModal(false)}
                        className="flex-1 py-3 bg-[#000a20] border border-white/5 hover:bg-white/5 text-gray-300 font-bold rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="flex-1 py-3 bg-[#f48c06] hover:bg-[#d07403] disabled:opacity-50 text-navy-deep font-bold rounded-xl transition-all shadow-lg"
                      >
                        {actionLoading ? "Saving..." : "Save Plan Configuration"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
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
