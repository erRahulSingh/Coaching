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
  Trophy,
  Target,
  Snowflake,
  Wifi,
  Lock,
  Newspaper,
  Video,
  Droplet,
  Armchair,
  Leaf
} from "lucide-react";
import { useTheme } from "@/components/AppWrapper";
import AdmissionModal from "@/components/AdmissionModal";

export default function FacilitiesPage() {
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
      window.scrollTo({ top: 0, behavior: "smooth" });
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
            <img src="/images/jms.logo.png" alt="JMS Logo" className="h-[55px] md:h-[65px] lg:h-[90px] w-auto object-contain" onError={(e) => {
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
                const isActive = item === "Facilities";
                return (
                  <button
                    key={item}
                    onClick={() => handleNavClick(id)}
                    className={`text-[15px] font-bold transition-colors duration-300 relative py-2 ${isActive ? 'text-[#f48c06]' : 'text-[#0a1c5d] hover:text-[#f48c06]'}`}
                  >
                    {item}
                    {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#f48c06] rounded-full" />}
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
          
          {/* Breadcrumb Navigation */}
          <div className="text-[13px] font-bold text-gray-400 mb-8 flex items-center gap-1.5 justify-start">
            <a href="/" className="hover:text-[#f48c06] transition-colors">Home</a>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-[#0a1c5d]">Facilities</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              <span className="text-[12px] md:text-[13px] font-black text-[#f48c06] uppercase tracking-[0.15em] mb-4 inline-block">
                OUR FACILITIES
              </span>
              
              <h2 className="text-[36px] md:text-[48px] lg:text-[54px] font-sans font-black tracking-tight text-[#0a1c5d] leading-[1.1] mb-6">
                Everything You Need<br/>
                For <span className="text-[#f48c06]">Better Learning</span>
              </h2>

              <p className="text-gray-600 text-[15px] md:text-[17px] font-medium leading-relaxed mb-8 max-w-[600px]">
                At JMS Modern Classes, we provide world-class facilities that create the perfect environment for serious students to study, grow and achieve their dreams.
              </p>

              {/* 3 small stats badges */}
              <div className="flex flex-wrap gap-4 w-full max-w-[550px]">
                {[
                  { label: "24/7", desc: "Library Access", icon: <Clock className="w-5 h-5 text-[#f48c06]" /> },
                  { label: "1000+", desc: "Happy Students", icon: <Users className="w-5 h-5 text-[#f48c06]" /> },
                  { label: "100%", desc: "Dedicated to Success", icon: <Trophy className="w-5 h-5 text-[#f48c06]" /> },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-gray-150 rounded-[16px] p-4 flex items-center gap-3.5 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] flex-1 min-w-[140px]">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                      {stat.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-[15px] font-black text-[#0a1c5d] leading-none mb-1">{stat.label}</p>
                      <p className="text-[10px] text-gray-500 font-bold whitespace-nowrap">{stat.desc}</p>
                    </div>
                  </div>
                ))}
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

        </div>
      </section>

      {/* --- Premium Facilities Grid (Image 1 bottom) --- */}
      <section className="py-8 lg:py-20 bg-transparent relative z-10 border-t border-gray-150">
        <div className="max-w-[1250px] mx-auto px-4 md:px-8 text-center">
          
          <span className="text-[12px] md:text-[13px] font-black text-[#f48c06] uppercase tracking-[0.15em] mb-3 inline-block">
            PREMIUM FACILITIES
          </span>
          
          <h3 className="text-[28px] md:text-[36px] font-sans font-black text-[#0a1c5d] mb-4">
            Designed For Your Success
          </h3>
          
          <div className="flex items-center justify-center gap-4 mb-16 text-slate-300">
            <span className="w-12 h-px bg-slate-200"></span>
            <BookOpen className="w-4 h-4 text-[#f48c06]" />
            <span className="w-12 h-px bg-slate-200"></span>
          </div>

          {/* 10 Facilities Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 w-full">
            {[
              {
                title: "Fully AC Furnished Library",
                desc: "A calm, quiet and fully AC environment to help you focus better.",
                icon: <Snowflake className="w-5 h-5 text-[#0a1c5d]" />,
                img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=300"
              },
              {
                title: "High Speed Free Wi-Fi",
                desc: "Stay connected with our high speed Wi-Fi for online learning.",
                icon: <Wifi className="w-5 h-5 text-[#0a1c5d]" />,
                img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=300"
              },
              {
                title: "Locker Facilities",
                desc: "Secure your belongings with personal locker facilities.",
                icon: <Lock className="w-5 h-5 text-[#0a1c5d]" />,
                img: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=300"
              },
              {
                title: "Daily Newspaper (Hindi/English)",
                desc: "Stay updated with daily newspapers to keep yourself informed.",
                icon: <Newspaper className="w-5 h-5 text-[#0a1c5d]" />,
                img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=300"
              },
              {
                title: "CCTV Surveillance",
                desc: "24/7 CCTV surveillance for safety and a disciplined environment.",
                icon: <Video className="w-5 h-5 text-[#0a1c5d]" />,
                img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=300"
              },
              {
                title: "RO + Mineral Water",
                desc: "Pure and safe drinking water for a healthy lifestyle.",
                icon: <Droplet className="w-5 h-5 text-[#0a1c5d]" />,
                img: "https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=300"
              },
              {
                title: "Comfortable Study Desk",
                desc: "Ergonomic chairs and spacious desks for comfortable study.",
                icon: <Armchair className="w-5 h-5 text-[#0a1c5d]" />,
                img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=300"
              },
              {
                title: "Parking Space",
                desc: "Ample parking space available for students' vehicles.",
                icon: <div className="w-5 h-5 bg-[#0a1c5d] text-white flex items-center justify-center font-black text-[11px] rounded-sm">P</div>,
                img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=300"
              },
              {
                title: "Peaceful Study Environment",
                desc: "Distraction-free atmosphere to help you concentrate better.",
                icon: <Users className="w-5 h-5 text-[#0a1c5d]" />,
                img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=300"
              },
              {
                title: "Green & Clean Environment",
                desc: "A clean, hygienic and green environment for better learning.",
                icon: <Leaf className="w-5 h-5 text-[#0a1c5d]" />,
                img: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=300"
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="card-style-1 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-3 sm:p-5 flex flex-col items-center text-center">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-50 flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="scale-75 sm:scale-100">{item.icon}</div>
                  </div>
                  <h4 className="text-[11px] sm:text-[14px] font-black text-[#0a1c5d] mb-1 sm:mb-2 leading-snug min-h-[32px] sm:min-h-[40px] flex items-center justify-center">
                    {item.title}
                  </h4>
                  <p className="text-[9px] sm:text-[11px] text-gray-500 font-semibold leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="w-full h-[80px] sm:h-[110px] overflow-hidden mt-auto">
                  <img 
                    src={item.img} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={item.title} 
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- Horizontal Stats & CTA Section (Image 2) --- */}
      <section className="py-8 lg:py-20 bg-transparent relative z-10 border-t border-gray-150">
        <div className="max-w-[1250px] mx-auto px-4 md:px-8">
          
          {/* Horizontal Stats Bar */}
          <div className="card-style-2 p-4 sm:p-6 md:p-8 grid grid-cols-2 md:flex md:flex-row justify-around items-center gap-4 sm:gap-6 md:gap-4 w-full mb-8 lg:mb-16">
            {[
              { label: "1000+", desc: "Happy Students", icon: <Users className="w-7 h-7 text-[#0a1c5d]" /> },
              { label: "24/7", desc: "Library Access", icon: <Clock className="w-7 h-7 text-[#0a1c5d]" /> },
              { label: "1", desc: "Bihar Topper", icon: <Trophy className="w-7 h-7 text-[#0a1c5d]" /> },
              { label: "100%", desc: "Success Rate", icon: <Target className="w-7 h-7 text-[#0a1c5d]" /> }
            ].map((stat, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-4 flex-1 justify-start md:justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    {stat.icon}
                  </div>
                  <div className="text-left">
                    <span className="block text-[28px] md:text-[30px] font-sans font-black text-[#f48c06] leading-none mb-1">
                      {stat.label}
                    </span>
                    <span className="block text-[12px] md:text-[13px] font-semibold text-gray-500 leading-tight">
                      {stat.desc}
                    </span>
                  </div>
                </div>
                {i < 3 && <div className="hidden md:block w-px h-12 bg-gray-200" />}
              </React.Fragment>
            ))}
          </div>

          {/* CTA Banner with Overlay and Contact Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch w-full text-left">
            
            {/* CTA Banner (Spans 2 cols) */}
            <div className="lg:col-span-2 rounded-[28px] overflow-hidden relative flex items-center p-8 md:p-12 shadow-lg bg-gradient-to-r from-[#051341] to-[#0a226e]">
              {/* Background overlay image */}
              <div 
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800')] bg-cover bg-center mix-blend-overlay opacity-20 z-0"
              />
              
              <div className="flex flex-col items-start relative z-10 max-w-[500px]">
                <span className="text-[12px] md:text-[13px] font-black text-[#f48c06] uppercase tracking-wider mb-2">
                  Join JMS Modern Classes Today
                </span>
                
                <h4 className="text-[28px] md:text-[38px] font-sans font-black text-white leading-tight mb-4">
                  Better Facilities,<br/>
                  <span className="text-[#f48c06]">Better Future!</span>
                </h4>
                
                <p className="text-slate-300 font-medium text-[14px] md:text-[15px] leading-relaxed mb-8">
                  We are committed to providing the best environment and facilities to help you achieve your goals.
                </p>
                
                <div className="flex flex-row flex-wrap gap-2 sm:gap-4 w-full">
                  <button
                    onClick={() => setIsAdmissionOpen(true)}
                    className="flex-1 sm:flex-none px-2 sm:px-8 py-3 sm:py-3.5 bg-[#f48c06] hover:bg-[#d07403] text-white font-bold rounded-[8px] transition-all duration-300 text-[10px] sm:text-[14px] tracking-wide flex items-center justify-center gap-1 sm:gap-2 shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    ENROLL NOW <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => handleNavClick("facilities")}
                    className="flex-1 sm:flex-none px-2 sm:px-8 py-3 sm:py-3.5 border-2 border-white/35 text-white font-bold rounded-[8px] transition-all duration-300 text-[10px] sm:text-[14px] tracking-wide flex items-center justify-center gap-1 sm:gap-2 hover:bg-white hover:text-[#0a1c5d] hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    LIBRARY <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Sidebar Card (Spans 1 col) */}
            <div className="card-style-1 p-8 flex flex-col items-center justify-center text-center">
              
              <div className="w-20 h-20 rounded-full bg-[#f48c06] flex items-center justify-center mb-6 shadow-md shadow-orange-500/10">
                <Phone className="w-9 h-9 text-white fill-white" />
              </div>

              <div className="text-center mb-8">
                <h5 className="text-gray-400 font-bold text-[14px] uppercase tracking-wider mb-1">
                  Have Questions?
                </h5>
                <p className="text-[#0a1c5d] font-sans font-black text-[22px] tracking-tight leading-tight">
                  Call Us Anytime
                </p>
              </div>

              <a 
                href="tel:7352527752" 
                className="text-[#0a1c5d] font-sans font-black text-[32px] tracking-tight hover:text-[#f48c06] transition-colors leading-none"
              >
                7352527752
              </a>

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
