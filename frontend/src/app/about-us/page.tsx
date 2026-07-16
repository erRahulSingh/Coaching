"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  Users,
  TrendingUp,
  Landmark,
  Headphones,
  Wallet,
  GraduationCap,
  Trophy,
  Target
} from "lucide-react";
import { useTheme } from "@/components/AppWrapper";
import AdmissionModal from "@/components/AdmissionModal";

export default function AboutUsPage() {
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [student, setStudent] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    const info = localStorage.getItem("studentInfo");
    if (token && info) {
      try {
        setStudent(JSON.parse(info));
      } catch (e) {
        setStudent(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentInfo");
    setStudent(null);
    window.location.reload();
  };

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    if (id === "home") {
      window.location.href = "/";
    } else if (id === "facilities") {
      window.location.href = "/facilities";
    } else if (id === "pricing") {
      window.location.href = "/pricing";
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent("Hello JMS, I'm interested in taking admission in Coaching / Library. Please share details.");
    window.open(`https://wa.me/917352527752?text=${text}`, "_blank");
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-gold selection:text-slate-800 overflow-hidden">
      
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-gold/5 blur-[120px] animate-blob" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] md:w-[700px] h-[400px] md:h-[700px] rounded-full bg-blue-900/10 blur-[130px] animate-blob animation-delay-2000" />
      </div>

      {/* --- Floating Icons Side panel --- */}
      <div className="fixed right-4 bottom-24 flex flex-col gap-3.5 z-50">
        <button
          onClick={() => window.open("tel:7352527752")}
          className="p-3.5 bg-gold hover:bg-gold-dark text-navy-deep rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group relative"
          aria-label="Call Us"
        >
          <Phone className="w-5 h-5" />
          <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-navy-muted border border-gold/30 px-3 py-1 rounded text-xs text-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            Call Us
          </span>
        </button>
        <button
          onClick={openWhatsApp}
          className="p-3.5 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group relative"
          aria-label="WhatsApp Us"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-navy-muted border border-gold/30 px-3 py-1 rounded text-xs text-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            WhatsApp Chat
          </span>
        </button>
      </div>

      {/* --- Sticky Header --- */}
      <header className="sticky top-0 z-[100] w-full bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="max-w-[1250px] mx-auto px-4 md:px-8 h-[90px] flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer h-full" onClick={() => window.location.href = "/"}>
            <img src="/images/jms.logo.png" alt="JMS Logo" className="h-[90px] w-auto object-contain" onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
              e.currentTarget.nextElementSibling?.classList.add('flex');
            }} />
            <div className="hidden flex-col">
               <BookOpen className="w-16 h-16 text-[#0a1c5d]" />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {["Home", "Facilities", "Courses", "Pricing"].map((item) => {
                const id = item.toLowerCase().replace(" ", "-");
                return (
                  <button
                    key={item}
                    onClick={() => handleNavClick(id)}
                    className="text-[15px] font-bold transition-colors duration-300 relative py-2 text-[#0a1c5d] hover:text-[#f48c06]"
                  >
                    {item}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-4 border-l border-gray-250 pl-8">
              {student ? (
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-black text-[#0a1c5d]">Hi, {student.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-[13px] rounded-full"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href="/auth/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0a1c5d] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#2563eb] text-white font-black text-[13px] rounded-full shadow-lg shadow-[#0a1c5d]/10 transition-all hover:scale-105 active:scale-95"
                >
                  Login
                </a>
              )}
            </div>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg text-[#0a1c5d]"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            className="absolute top-[90px] left-0 w-full bg-white border-b border-gray-100 py-6 px-6 shadow-2xl flex flex-col gap-4 lg:hidden z-50"
          >
            {["Home", "Facilities", "Courses", "Pricing"].map((item) => {
              const id = item.toLowerCase().replace(" ", "-");
              return (
                <button
                  key={item}
                  onClick={() => handleNavClick(id)}
                  className="text-left py-2.5 text-base font-bold text-[#0a1c5d] hover:text-[#f48c06] border-b border-gray-100 transition-colors duration-200"
                >
                  {item}
                </button>
              );
            })}

            <div className="pt-2">
              {student ? (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-black text-[#0a1c5d]">Hi, {student.name}</span>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-sm rounded-xl text-center"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href="/auth/login"
                  className="block w-full py-3.5 bg-gradient-to-r from-[#0a1c5d] to-[#1e3a8a] text-white font-black text-sm rounded-xl text-center shadow-lg"
                >
                  Login / Sign Up
                </a>
              )}
            </div>
          </div>
        )}
      </header>

      {/* --- Breadcrumb & Hero Section (Image 1) --- */}
      <section className="py-8 lg:py-12 bg-transparent relative z-10">
        <div className="max-w-[1250px] mx-auto px-4 md:px-8">
          


          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              <span className="text-[12px] md:text-[13px] font-black text-[#f48c06] uppercase tracking-[0.15em] mb-4 inline-block">
                ABOUT JMS MODERN CLASSES
              </span>
              
              <h2 className="text-[36px] md:text-[48px] lg:text-[54px] font-sans font-black tracking-tight text-[#0a1c5d] leading-[1.1] mb-6">
                Helping Students<br/>
                Build A <span className="text-[#f48c06]">Better Future</span>
              </h2>

              <p className="text-gray-600 text-[15px] md:text-[17px] font-medium leading-relaxed mb-8 max-w-[600px]">
                JMS Modern Classes is a premium study destination for students who dream big and work hard. We provide the perfect blend of peaceful environment, expert guidance, and 24x7 access to help you achieve your goals.
              </p>

              <div className="flex flex-row gap-2 sm:gap-4 w-full">
                <button
                  onClick={() => setIsAdmissionOpen(true)}
                  className="flex-1 sm:flex-none px-2 sm:px-8 py-3.5 bg-[#0a1c5d] hover:bg-[#071444] text-white font-bold rounded-[8px] transition-all duration-300 text-[10px] sm:text-[14px] tracking-wide flex items-center justify-center gap-1 sm:gap-2 shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  ENROLL NOW <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => handleNavClick("courses")}
                  className="flex-1 sm:flex-none px-2 sm:px-8 py-3.5 border-2 border-[#0a1c5d] text-[#0a1c5d] font-bold rounded-[8px] transition-all duration-300 text-[10px] sm:text-[14px] tracking-wide flex items-center justify-center gap-1 sm:gap-2 hover:bg-[#0a1c5d] hover:text-white hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  EXPLORE <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 z-10">
                <img 
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800" 
                  alt="Students Studying in JMS Library"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating 24/7 Badge overlay */}
              <div className="absolute -bottom-6 left-4 md:-left-6 bg-white rounded-[24px] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.15)] p-4 flex items-center gap-4 border border-gray-50 z-20 w-[240px] md:w-[260px]">
                <div className="w-14 h-14 rounded-full bg-[#0a1c5d] flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[13px] uppercase font-black text-gray-400 tracking-wider">OPEN</p>
                  <p className="text-[26px] font-black text-[#f48c06] leading-none my-0.5">24/7</p>
                  <p className="text-[12px] font-bold text-[#0a1c5d]">Library Access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="card-style-2 p-4 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-4 w-full mt-10 sm:mt-20">
            {[
              { 
                value: "1000+", 
                label: "Happy Students", 
                icon: <Users className="w-6 h-6 text-orange-500" />,
                iconBg: "bg-orange-100" 
              },
              { 
                value: "24/7", 
                label: "Library Access", 
                icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
                iconBg: "bg-blue-100" 
              },
              { 
                value: "1", 
                label: "Bihar Topper", 
                icon: <Trophy className="w-6 h-6 text-orange-500" />,
                iconBg: "bg-orange-100" 
              },
              { 
                value: "100%", 
                label: "Dedicated to Success", 
                icon: <Target className="w-6 h-6 text-blue-600" />,
                iconBg: "bg-blue-100" 
              },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 md:justify-center">
                <div className={`w-12 h-12 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0`}>
                  {stat.icon}
                </div>
                <div className="text-left">
                  <span className="block text-[22px] sm:text-[28px] md:text-[32px] font-sans font-black text-[#0a1c5d] leading-none mb-1">
                    {stat.value}
                  </span>
                  <span className="block text-[10px] sm:text-[12px] md:text-[13px] font-semibold text-gray-500 leading-tight">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- Mission Section (Image 2) --- */}
      <section className="py-8 lg:py-20 bg-transparent relative z-10 border-t border-gray-150">
        <div className="max-w-[1250px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Photos Column */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="w-full h-[320px] md:h-[380px] rounded-[24px] overflow-hidden shadow-lg border border-gray-150 relative bg-slate-50">
                <img 
                  src="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800" 
                  alt="JMS Classes & Study Center Front"
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[
                  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=300",
                  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=300",
                  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=300"
                ].map((imgUrl, i) => (
                  <div key={i} className="aspect-[4/3] rounded-[16px] overflow-hidden border border-gray-150 shadow-sm bg-slate-50">
                    <img src={imgUrl} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" alt={`Library study environment ${i+1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content Column */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              
              <span className="text-[12px] md:text-[13px] font-black text-[#f48c06] uppercase tracking-[0.15em] mb-4 inline-block">
                OUR MISSION
              </span>
              
              <h3 className="text-[32px] md:text-[40px] font-sans font-black text-[#0a1c5d] leading-tight mb-6">
                Empowering Minds,<br/>
                Shaping <span className="text-[#f48c06]">Futures</span>
              </h3>

              <p className="text-gray-600 text-[15px] md:text-[16px] leading-relaxed mb-8 font-medium">
                Our mission is to provide a world-class learning environment that inspires students to achieve academic excellence and become responsible, confident, and successful individuals.
              </p>

              {/* Checklist */}
              <div className="flex flex-col gap-4 w-full">
                {[
                  "Expert faculty with years of teaching experience",
                  "Peaceful and disciplined study environment",
                  "Personal attention to every student",
                  "Regular tests and performance analysis",
                  "Affordable fee structure for quality education"
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-[15px] md:text-[16px] text-gray-700 font-semibold">{text}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* --- Why Choose Section (Image 3) --- */}
      <section className="py-8 lg:py-20 bg-transparent relative z-10 border-t border-gray-150">
        <div className="max-w-[1250px] mx-auto px-4 md:px-8 text-center">
          
          <h3 className="text-[28px] md:text-[36px] font-sans font-black text-[#0a1c5d] mb-8 lg:mb-16">
            WHY CHOOSE <span className="text-[#f48c06]">JMS MODERN CLASSES?</span>
          </h3>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 w-full mb-10 sm:mb-20">
            {[
              {
                title: "Expert Faculty",
                desc: "Learn from experienced and dedicated teachers.",
                icon: <Users className="w-6 h-6 text-[#0a1c5d]" />
              },
              {
                title: "Smart Study",
                desc: "Well-structured study material and resources.",
                icon: <BookOpen className="w-6 h-6 text-[#f48c06]" />
              },
              {
                title: "Regular Tests",
                desc: "Weekly tests and analysis to track your progress.",
                icon: <TrendingUp className="w-6 h-6 text-[#0a1c5d]" />
              },
              {
                title: "Best Library",
                desc: "Fully AC library with 24x7 access.",
                icon: <Landmark className="w-6 h-6 text-[#f48c06]" />
              },
              {
                title: "Personal Guidance",
                desc: "One-to-one interaction and doubt sessions.",
                icon: <Headphones className="w-6 h-6 text-[#0a1c5d]" />
              },
              {
                title: "Affordable Fees",
                desc: "Quality education at reasonable fees.",
                icon: <Wallet className="w-6 h-6 text-[#f48c06]" />
              }
            ].map((card, idx) => (
              <div 
                key={idx} 
                className="card-style-2 p-4 sm:p-8 flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-slate-50 flex items-center justify-center mb-3 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h4 className="text-[14px] sm:text-[18px] font-black text-[#0a1c5d] mb-1 sm:mb-3">{card.title}</h4>
                <p className="text-[11px] sm:text-[14px] text-gray-500 font-semibold leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Banner & Topper Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch w-full text-left">
            
            {/* CTA Banner (Spans 2 cols) */}
            <div className="lg:col-span-2 rounded-[28px] overflow-hidden relative flex items-center p-8 md:p-12 shadow-lg bg-gradient-to-r from-[#051341] to-[#0a226e]">
              {/* Background overlay image */}
              <div 
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800')] bg-cover bg-center mix-blend-overlay opacity-20 z-0"
              />
              
              <div className="flex flex-col items-start relative z-10 max-w-[520px]">
                <span className="text-[12px] md:text-[13px] font-black text-[#f48c06] uppercase tracking-wider mb-2">
                  Join JMS Modern Classes Today
                </span>
                
                <h4 className="text-[28px] md:text-[38px] font-sans font-black text-white leading-tight mb-4">
                  A Better Environment<br/>
                  For <span className="text-[#f48c06]">Better Learning</span>
                </h4>
                
                <p className="text-slate-300 font-medium text-[14px] md:text-[15px] leading-relaxed mb-8">
                  Come and experience the difference in our teaching, facilities, and environment.
                </p>
                
                <button
                  onClick={() => setIsAdmissionOpen(true)}
                  className="px-8 py-3.5 bg-[#f48c06] hover:bg-[#d07403] text-white font-bold rounded-[8px] transition-all duration-300 text-[14px] tracking-wide flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
                >
                  VISIT US TODAY <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Topper Card (Spans 1 col) */}
            <div className="col-span-1 card-style-1 p-8 flex flex-col items-center text-center justify-between">
              <div>
                <span className="text-[#f48c06] font-cursive text-2xl italic mb-1 block">
                  Our Pride
                </span>
                <h4 className="text-[#0a1c5d] font-sans font-black text-[22px] tracking-tight leading-none">
                  BIHAR TOPPER
                </h4>
                <span className="text-gray-400 font-black text-[11px] tracking-widest uppercase mt-2 mb-6 block">
                  BSEB BOARD
                </span>
              </div>

              {/* laurel wreath and avatar wrapper */}
              <div className="hidden lg:flex w-[140px] h-[140px] items-center justify-center relative mb-6">
                {/* Wreath */}
                <svg className="absolute inset-0 w-full h-full text-[#f48c06]" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M 50,85 C 38,85 24,75 22,50 C 20.5,32 30,18 42,12 C 40,16 35,26 36,40 C 37,54 44,70 50,85 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M 23,45 Q 18,42 24,37 Z" /><path d="M 24,35 Q 19,30 26,27 Z" /><path d="M 28,25 Q 24,19 31,18 Z" /><path d="M 33,18 Q 30,12 37,13 Z" /><path d="M 40,13 Q 39,7 45,9 Z" />
                  <path d="M 50,85 C 62,85 76,75 78,50 C 79.5,32 70,18 58,12 C 60,16 65,26 64,40 C 63,54 56,70 50,85 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M 77,45 Q 82,42 76,37 Z" /><path d="M 76,35 Q 81,30 74,27 Z" /><path d="M 72,25 Q 76,19 69,18 Z" /><path d="M 67,18 Q 70,12 63,13 Z" /><path d="M 60,13 Q 61,7 55,9 Z" />
                </svg>

                {/* Topper Image */}
                <div className="w-[82px] h-[82px] rounded-full overflow-hidden border-2 border-white shadow-md z-10 bg-slate-200">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" 
                    className="w-full h-full object-cover scale-110 object-top" 
                    alt="Bihar Topper" 
                  />
                </div>
              </div>

              <div>
                <span className="block text-slate-700 font-black text-[14px] mb-1">
                  Science Stream
                </span>
                
                <span className="text-white bg-[#0a1c5d] px-5 py-1.5 rounded-full font-black text-[11px] tracking-wider uppercase shadow-sm inline-block">
                  1ST RANK
                </span>
                
                <p className="text-gray-400 text-[12px] font-semibold leading-relaxed mt-4 italic max-w-[200px]">
                  We are proud of our student's hard work and achievement.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- Footer & Contact Block --- */}
      <footer className="pt-12 pb-8 bg-black relative z-10 border-t border-gray-900">
        <div className="max-w-[1250px] w-full mx-auto px-4 md:px-8">
          
          {/* Top Info Row */}
          <div className="flex flex-col lg:flex-row justify-between gap-6 mb-16 items-start lg:items-center bg-gray-900 p-6 lg:p-8 rounded-[20px] shadow-sm border border-gray-800">
             <div className="flex flex-col">
               <h4 className="text-[14px] font-black text-white">Get In Touch</h4>
               <p className="text-[12px] text-gray-400 mt-1 font-medium">We are here to help you.<br/>Reach out for any queries.</p>
             </div>
             
             <div className="w-px h-12 bg-gray-800 hidden lg:block"></div>

             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                 <Phone className="w-4 h-4 text-[#f48c06]" />
               </div>
               <div>
                 <p className="text-[12px] font-bold text-white">Call Us</p>
                 <p className="text-[13px] font-black text-white leading-tight mt-0.5">7352527752<br/>9060425858</p>
               </div>
             </div>

             <div className="w-px h-12 bg-gray-800 hidden lg:block"></div>

             <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={openWhatsApp}>
               <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#25d366] fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.59 1.97 14.12 .95 11.487.95c-5.44 0-9.866 4.372-9.87 9.802 0 2.01.524 3.9 1.515 5.526L2.082 22l5.858-1.518c.005.003.005.004.565.372z" /></svg>
               </div>
               <div>
                 <p className="text-[12px] font-bold text-white">WhatsApp Us</p>
                 <p className="text-[12px] text-gray-400 font-medium mt-0.5">Chat with us on WhatsApp</p>
               </div>
             </div>

             <div className="w-px h-12 bg-gray-800 hidden lg:block"></div>

             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                 <MapPin className="w-4 h-4 text-[#f48c06]" />
               </div>
               <div>
                 <p className="text-[12px] font-bold text-white">Visit Us</p>
                 <p className="text-[12px] text-gray-400 font-medium max-w-[200px] leading-snug mt-0.5">Kushwaha Market, Parsauni<br/>Near Parsauni Petrol Pump</p>
               </div>
             </div>
          </div>

          {/* Bottom Footer Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 items-start">
             <div className="col-span-1">
                 <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 bg-gray-900 border border-[#f48c06] rounded flex items-center justify-center">
                       <BookOpen className="w-5 h-5 text-[#f48c06]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[18px] font-black text-white leading-none tracking-tight">JMS</span>
                      <span className="text-[10px] font-black text-[#f48c06] leading-none tracking-widest mt-0.5">MODERN CLASSES</span>
                    </div>
                 </div>
                 <p className="text-[12px] text-gray-400 mt-2 font-medium">Padhaai Aapki, Mahol Hamara</p>
             </div>

             <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center md:gap-20">
               <div>
                 <h5 className="text-[13px] font-black text-white mb-4">Quick Links</h5>
                 <div className="flex flex-col gap-2.5 text-[12px] text-gray-300 font-semibold">
                   <button onClick={() => window.location.href = "/"} className="text-left hover:text-[#f48c06] transition-colors">Home</button>
                   <button onClick={() => window.location.href = "/about-us"} className="text-left hover:text-[#f48c06] transition-colors">About Us</button>
                   <button onClick={() => handleNavClick("facilities")} className="text-left hover:text-[#f48c06] transition-colors">Facilities</button>
                 </div>
               </div>
               <div>
                 <h5 className="text-[13px] font-black text-white mb-4 invisible">Quick Links</h5>
                 <div className="flex flex-col gap-2.5 text-[12px] text-gray-300 font-semibold">
                   <button onClick={() => window.location.href = "/pricing"} className="text-left hover:text-[#f48c06] transition-colors">Pricing</button>
                   <button onClick={() => handleNavClick("courses")} className="text-left hover:text-[#f48c06] transition-colors">Courses</button>
                 </div>
               </div>
               <div>
                 <h5 className="text-[13px] font-black text-white mb-4 invisible">Quick Links</h5>
                 <div className="flex flex-col gap-2.5 text-[12px] text-gray-300 font-semibold">
                   <button onClick={() => handleNavClick("topper")} className="text-left hover:text-[#f48c06] transition-colors">Topper</button>
                   <button onClick={() => handleNavClick("gallery")} className="text-left hover:text-[#f48c06] transition-colors">Gallery</button>
                 </div>
               </div>
               <div>
                 <h5 className="text-[13px] font-black text-white mb-4 invisible">Quick Links</h5>
                 <div className="flex flex-col gap-2.5 text-[12px] text-gray-300 font-semibold">
                   <button onClick={() => handleNavClick("contact")} className="text-left hover:text-[#f48c06] transition-colors">Contact Us</button>
                 </div>
               </div>
             </div>

             <div className="col-span-1 flex flex-col items-start lg:items-end w-full">
                 <div className="w-full max-w-xs">
                   <h5 className="text-[13px] font-black text-white mb-4">Follow Us</h5>
                   <div className="flex gap-2">
                      <a href="#" className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-[#1877F2] transition-colors">
                         <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gradient-to-tr hover:from-[#FFB900] hover:via-[#D1016F] hover:to-[#8F01D7] transition-all">
                         <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-[#25D366] transition-colors">
                         <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.59 1.97 14.12 .95 11.487.95c-5.44 0-9.866 4.372-9.87 9.802 0 2.01.524 3.9 1.515 5.526L2.082 22l5.858-1.518c.005.003.005.004.565.372z"/></svg>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-[#FF0000] transition-colors">
                         <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      </a>
                   </div>
                 </div>
              </div>
          </div>
        </div>
      </footer>

      {/* Admission lead form modal overlay */}
      <AdmissionModal isOpen={isAdmissionOpen} onClose={() => setIsAdmissionOpen(false)} />
    </div>
  );
}
