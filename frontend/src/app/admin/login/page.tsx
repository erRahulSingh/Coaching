"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Users,
  BookOpen,
  BarChart3,
  Layers,
  GraduationCap,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server is unreachable. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Student Management",
      desc: "Add, manage and track student information effortlessly.",
      color: "from-violet-500 to-indigo-400",
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: "Course & Batch Management",
      desc: "Organize courses, batches, subjects and study materials.",
      color: "from-blue-500 to-cyan-400",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Library Management",
      desc: "Manage books, issue/return, due dates and fines.",
      color: "from-orange-500 to-amber-400",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Reports & Analytics",
      desc: "Get detailed reports on students, fees, attendance and more.",
      color: "from-emerald-500 to-teal-400",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#f0f0ff] via-white to-[#f5f0ff]">
      {/* ===== LEFT SIDE — Content ===== */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#2e1065] via-[#1e1b4b] to-[#0f0a2e] px-12 py-10">
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-violet-500/15 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] bg-violet-400/5 rounded-full blur-[60px]" />

        {/* Decorative curved shape */}
        <div className="absolute top-0 right-0 w-[55%] h-full z-0 opacity-[0.07]">
          <svg viewBox="0 0 400 800" className="w-full h-full" preserveAspectRatio="none">
            <path d="M200,0 C350,150 400,300 350,450 C300,600 250,700 400,800 L400,0 Z" fill="white" />
          </svg>
        </div>

        {/* Student studying image overlay */}
        <div className="absolute bottom-0 right-0 w-[55%] h-[70%] z-[1] opacity-20">
          <img
            src="/images/hero.png"
            alt="Student"
            className="w-full h-full object-cover object-top"
            style={{ maskImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)" }}
          />
        </div>

        {/* Top — Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <img src="/images/jms.logo.png" alt="JMS Logo" className="w-14 h-14 object-contain rounded-xl" />
            <div>
              <h1 className="text-white font-black text-2xl tracking-tight leading-none">JMS Modern Classes</h1>
              <span className="text-violet-300 text-[10px] font-bold uppercase tracking-[3px]">Learn • Grow • Succeed</span>
            </div>
          </div>
        </div>

        {/* Middle — Headline + Features */}
        <div className="relative z-10 flex-1 flex flex-col justify-center -mt-8">
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-400/20 text-violet-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Admin Portal
            </span>
          </div>
          <h2 className="text-[42px] font-black text-white leading-[1.1] tracking-tight mb-4">
            Smart Coaching.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">
              Smarter Management.
            </span>
          </h2>
          <p className="text-gray-400 text-[15px] leading-relaxed max-w-[440px] mb-10 font-medium">
            JMS Admin is an all-in-one platform to manage students, courses, attendance, fees, books and much more — easily and efficiently.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/[0.06] rounded-2xl p-4 group hover:bg-white/[0.08] transition-all duration-300">
                <div className={`w-10 h-10 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{f.title}</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Quote */}
        <div className="relative z-10 flex items-center gap-4 bg-gradient-to-r from-violet-500/15 to-transparent border border-violet-400/10 rounded-2xl p-4">
          <div className="w-11 h-11 bg-violet-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-300 text-[12px] leading-relaxed italic">
              &ldquo;Education is the most powerful weapon which you can use to change the world.&rdquo;
            </p>
            <span className="text-violet-300 text-[11px] font-bold mt-1 block">— Nelson Mandela</span>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE — Login Form ===== */}
      <div className="w-full lg:w-[48%] flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[440px]">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            <img src="/images/jms.logo.png" alt="JMS Logo" className="w-16 h-16 object-contain rounded-xl shadow-lg" />
          </div>

          {/* Desktop Icon */}
          <div className="hidden lg:flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-xl shadow-violet-500/10 border border-violet-200/50">
              <ShieldCheck className="w-10 h-10 text-violet-600" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Welcome Back!</h2>
            <p className="text-sm text-gray-500 font-medium">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:bg-white transition-all text-sm font-medium"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:bg-white transition-all text-sm font-medium"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-violet-600 accent-violet-600" />
                <span className="text-gray-600 font-medium">Remember me</span>
              </label>
              <button type="button" className="text-violet-600 font-bold hover:text-violet-800 transition-colors">
                Forgot Password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 py-3 rounded-xl border border-red-200 font-medium">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-violet-500/20 disabled:opacity-70 active:scale-[0.98] text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" /> Login
                </>
              )}
            </button>

          </form>

          {/* Footer Links */}
          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-400 font-medium">
            <button className="hover:text-violet-600 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Privacy Policy
            </button>
            <span className="text-gray-300">|</span>
            <button className="hover:text-violet-600 transition-colors flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
