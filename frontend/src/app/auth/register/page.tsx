"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/config";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Phone,
  BookOpen,
  Users,
  Award,
  Clock,
  Sparkles,
  GraduationCap,
} from "lucide-react";

export default function StudentRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/student/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("studentToken", data.token);
        localStorage.setItem("studentInfo", JSON.stringify(data.student));
        router.push("/");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Server is unreachable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Smart Library Access",
      desc: "24/7 library access with AC, Wi-Fi and power backup.",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Expert Faculty",
      desc: "Learn from Bihar's top educators and mentors.",
      color: "from-orange-500 to-yellow-400",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Proven Results",
      desc: "Bihar Topper produced with 1000+ success stories.",
      color: "from-green-500 to-emerald-400",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Flexible Shifts",
      desc: "Morning, evening and full-day study shift options.",
      color: "from-purple-500 to-pink-400",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#f0f4ff] via-white to-[#fff7ed]">
      {/* ===== LEFT SIDE — Content ===== */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#0a1c5d] via-[#001235] to-[#040814] px-12 py-10">
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-[#f48c06]/15 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] bg-[#0a1c5d]/40 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[#f48c06]/5 rounded-full blur-[60px]" />

        {/* Top — Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <img src="/images/jms.logo.png" alt="JMS Logo" className="w-14 h-14 object-contain rounded-xl" />
            <div>
              <h1 className="text-white font-black text-2xl tracking-tight leading-none">JMS Modern Classes</h1>
              <span className="text-[#f48c06] text-[10px] font-bold uppercase tracking-[3px]">Learn • Grow • Succeed</span>
            </div>
          </div>
        </div>

        {/* Middle — Headline + Features */}
        <div className="relative z-10 flex-1 flex flex-col justify-center -mt-8">
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 bg-[#f48c06]/10 border border-[#f48c06]/20 text-[#f48c06] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Join Our Family
            </span>
          </div>
          <h2 className="text-[42px] font-black text-white leading-[1.1] tracking-tight mb-4">
            Smart Coaching.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f48c06] to-[#fbbf24]">
              Brighter Future.
            </span>
          </h2>
          <p className="text-gray-400 text-[15px] leading-relaxed max-w-[440px] mb-10 font-medium">
            Create your account and get access to premium courses, study materials and 24/7 library access at Bihar&apos;s best coaching institute.
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
        <div className="relative z-10 flex items-center gap-4 bg-gradient-to-r from-[#f48c06]/10 to-transparent border border-[#f48c06]/10 rounded-2xl p-4">
          <div className="w-11 h-11 bg-[#f48c06] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#f48c06]/20">
            <GraduationCap className="w-6 h-6 text-[#0a1c5d]" />
          </div>
          <div>
            <p className="text-gray-300 text-[12px] leading-relaxed italic">
              &ldquo;Education is the most powerful weapon which you can use to change the world.&rdquo;
            </p>
            <span className="text-[#f48c06] text-[11px] font-bold mt-1 block">— Nelson Mandela</span>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE — Register Form ===== */}
      <div className="w-full lg:w-[48%] flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[440px]">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            <img src="/images/jms.logo.png" alt="JMS Logo" className="w-16 h-16 object-contain rounded-xl shadow-lg" />
          </div>

          {/* Desktop Logo Icon */}
          <div className="hidden lg:flex justify-center mb-5">
            <div className="w-20 h-20 bg-gradient-to-br from-[#0a1c5d] to-[#1e3a8a] rounded-3xl flex items-center justify-center shadow-xl shadow-[#0a1c5d]/15 border border-[#0a1c5d]/10">
              <img src="/images/jms.logo.png" alt="JMS Logo" className="w-12 h-12 object-contain" />
            </div>
          </div>

          <div className="text-center mb-7">
            <h2 className="text-3xl font-black text-[#0a1c5d] tracking-tight mb-2">Create Account</h2>
            <p className="text-sm text-gray-500 font-medium">Join JMS Modern Classes today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-[#0a1c5d] mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0a1c5d] focus:bg-white transition-all text-sm font-medium"
                  placeholder="e.g. Rahul Kumar"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#0a1c5d] mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0a1c5d] focus:bg-white transition-all text-sm font-medium"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-[#0a1c5d] mb-1.5">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0a1c5d] focus:bg-white transition-all text-sm font-medium"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-[#0a1c5d] mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-10 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0a1c5d] focus:bg-white transition-all text-sm font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0a1c5d] mb-1.5">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="block w-full pl-10 pr-10 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0a1c5d] focus:bg-white transition-all text-sm font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 py-3 rounded-xl border border-red-200 font-medium">
                {error}
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-[#f48c06] to-[#d07403] hover:from-[#d07403] hover:to-[#b56502] text-white font-black rounded-2xl transition-all shadow-xl shadow-[#f48c06]/20 disabled:opacity-70 active:scale-[0.98] text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Creating account...
                </span>
              ) : (
                <>
                  <Users className="w-5 h-5" /> Sign Up
                </>
              )}
            </button>

            {/* OR Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-xs font-bold uppercase">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Login Button */}
            <Link href="/auth/login">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-white border-2 border-[#0a1c5d] text-[#0a1c5d] font-black rounded-2xl transition-all hover:bg-[#0a1c5d] hover:text-white active:scale-[0.98] text-sm"
              >
                <ArrowRight className="w-5 h-5" /> Login
              </button>
            </Link>
          </form>

          {/* Footer Links */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400 font-medium">
            <button className="hover:text-[#0a1c5d] transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3" /> Privacy Policy
            </button>
            <button className="hover:text-[#0a1c5d] transition-colors flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
