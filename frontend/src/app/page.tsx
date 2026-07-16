"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Wifi,
  Wind,
  Shield,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Newspaper,
  CheckCircle,
  Play,
  Mail
} from "lucide-react";
// Framer motion stripped
import { useTheme } from "@/components/AppWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import AdmissionModal from "@/components/AdmissionModal";

// --- Types & Data ---

interface Topper {
  name: string;
  rank: string;
  marks: string;
  year: string;
  image: string;
  achievement: string;
}

interface Testimonial {
  name: string;
  role: "Student" | "Parent";
  text: string;
  rating: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

const TOPPERS: Topper[] = [
  {
    name: "Aman Kumar",
    rank: "BSEB Rank 4",
    marks: "482/500",
    year: "2025",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600",
    achievement: "District Topper & BSEB Top 5"
  },
  {
    name: "Priya Kumari",
    rank: "BSEB Rank 7",
    marks: "479/500",
    year: "2025",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600",
    achievement: "Girls topper in Science stream"
  },
  {
    name: "Vikram Shah",
    rank: "BSEB Rank 12",
    marks: "474/500",
    year: "2024",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600",
    achievement: "100% Marks in Mathematics"
  }
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ranjan Prasad (Parent)",
    role: "Parent",
    text: "The environment of JMS Library is exceptionally quiet and perfect for long hours of self-study. My son secured 94% in BSEB Class 12, thanks to their systematic approach and guidance.",
    rating: 5
  },
  {
    name: "Shweta Roy",
    role: "Student",
    text: "I was looking for a library with premium amenities in Parsauni. JMS provides excellent WiFi speeds, comfortable ergonomic chairs, and pin-drop silence. Highly recommended!",
    rating: 5
  },
  {
    name: "Anil Pathak",
    role: "Student",
    text: "The library runs 24x7. I studied during the night shift. The security (CCTV) and RO drinking water facilities are excellent. It feels premium and professional.",
    rating: 5
  }
];

const FAQS: FAQItem[] = [
  {
    question: "What are the timings of the JMS Library?",
    answer: "Our smart library runs 24x7. We have divided the operations into multiple flexible slots: Morning (6 AM - 12 PM), Midday (12 PM - 6 PM), Evening (6 PM - 11 PM), and Full Day (24 Hours access)."
  },
  {
    question: "Does JMS provide coaching along with library facilities?",
    answer: "Yes! We run JMS Modern Classes which offers highly professional foundation courses for Class 9, 10, 11, and 12 for both BSEB (Bihar Board) and CBSE streams, alongside specialized test preparation."
  },
  {
    question: "Are seats reserved or open-sharing?",
    answer: "We offer both! You can opt for a standard seat, or pay a small premium for a Special Reserved Seat with your own dedicated desk lockable cabinet."
  },
  {
    question: "What amenities are included in the library fee?",
    answer: "High-speed high-bandwidth dual WiFi connections, Air-conditioned (AC) study rooms, private lockers, RO purified water, CCTV surveillance, charging ports at every desk, and daily newspapers (Hindi & English)."
  }
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200",
  "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1200",
  "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=1200",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200"
];

// --- Animating Counter Component ---
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.abs(Math.floor(totalMiliseconds / end));

    // Safety cap
    if (incrementTime < 10) incrementTime = 10;

    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function LandingPage() {
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
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

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - 300 : scrollLeft + 300;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to hash on mount (from other pages)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 500);
    }
  }, []);

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    if (id === "facilities") {
      window.location.href = "/facilities";
      return;
    }
    if (id === "pricing") {
      window.location.href = "/pricing";
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent("Hello JMS, I'm interested in taking admission in Coaching / Library. Please share details.");
    window.open(`https://wa.me/917352527752?text=${text}`, "_blank");
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-800 selection:bg-gold selection:text-slate-800 overflow-hidden">

      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-gold/5 blur-[120px] animate-blob" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] md:w-[700px] h-[400px] md:h-[700px] rounded-full bg-blue-900/10 blur-[130px] animate-blob animation-delay-2000" />
      </div>

      {/* --- Floating Icons Side panel --- */}
      <div className="fixed right-4 bottom-24 flex flex-col gap-3.5 z-50">
        <button
          onClick={() => window.open("tel:7352527752")}
          className="p-3.5 bg-gold hover:bg-gold-dark text-navy-deep rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:shadow-[0_10px_25px_rgba(255,215,0,0.4)] active:scale-95 group relative"
          aria-label="Call Us"
        >
          <Phone className="w-5 h-5 group-hover:animate-bounce" />
          <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-navy-muted border border-gold/30 px-3 py-1 rounded text-xs text-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            Call Us
          </span>
        </button>
        <button
          onClick={openWhatsApp}
          className="p-3.5 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:shadow-[0_10px_25px_rgba(34,197,94,0.4)] active:scale-95 group relative"
          aria-label="WhatsApp Us"
        >
          <MessageSquare className="w-5 h-5 group-hover:animate-bounce" />
          <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-navy-muted border border-gold/30 px-3 py-1 rounded text-xs text-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            WhatsApp Chat
          </span>
        </button>
      </div>

      {/* --- Sticky Header --- */}
      <header className="sticky top-0 z-[100] w-full bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="max-w-[1250px] mx-auto px-4 md:px-8 h-[90px] flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center cursor-pointer h-full" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
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
                const isActive = item === "Home";
                return (
                  <button
                    key={item}
                    onClick={() => handleNavClick(id)}
                    className={`text-[15px] font-bold transition-colors duration-300 relative py-2 ${isActive ? 'text-[#0a1c5d]' : 'text-[#0a1c5d] hover:text-[#f48c06]'}`}
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

      {/* --- Hero Section --- */}
      <section id="home" className="bg-white z-10 pt-4 pb-8 lg:py-6 flex items-center">

        <div className="max-w-[1250px] w-full mx-auto relative lg:min-h-[550px] flex items-center px-4 md:px-8">

          {/* Right Background SVG & Image (Desktop only) */}
          <div className="absolute top-0 right-0 lg:-right-8 w-[45%] h-full z-0 hidden lg:block rounded-r-[40px] overflow-hidden">
            <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {/* Image */}
              <image href="/images/hero.png" width="1000" height="1000" preserveAspectRatio="xMidYMid slice" />

              {/* White Overlay to create curved mask */}
              <path d="M 0,0 L 450,0 C 150,350 150,750 650,1000 L 0,1000 Z" fill="#ffffff" />

              {/* Orange line */}
              <path d="M 450,0 C 250,200 170,300 155,350" fill="none" stroke="#f48c06" strokeWidth="25" strokeLinecap="round" />

              {/* Dark Blue line */}
              <path d="M 230,700 C 350,850 500,950 650,1000" fill="none" stroke="#0a1c5d" strokeWidth="35" strokeLinecap="round" />
            </svg>


          </div>

          {/* Content Container */}
          <div className="w-full relative z-10 flex flex-row items-center justify-between gap-2">

            {/* Content Column */}
            <div className="w-[60%] lg:w-[60%] flex flex-col items-start text-left pt-2 lg:pt-0">

              {/* Padhaai Aapki, Mahol Hamara badge */}
              <div className="relative inline-flex items-center mb-8 select-none">
                {/* The overlapping circle */}
                <div className="absolute left-0 w-14 h-14 rounded-full bg-[#ff5d00] border-2 border-white flex items-center justify-center shadow-md z-10">
                  <svg className="w-7 h-7 text-white fill-white" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5.5 13.53v3.72c0 1.22 1.63 2.2 3.62 2.43 1.05.12 2.18.12 3.23 0 1.99-.23 3.62-1.21 3.62-2.43v-3.72l-4.97 2.71c-.72.39-1.57.39-2.29 0l-5.21-2.84z" />
                  </svg>
                </div>

                {/* The gradient pill */}
                <div className="h-10 bg-gradient-to-r from-[#bba567] to-[#1b6db1] rounded-full flex items-center pl-16 pr-8 border-y border-r border-white/20 shadow-sm relative z-0">
                  <span className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-wider">
                    Padhaai Aapki, Mahol Hamara
                  </span>
                </div>
              </div>

              {/* Main Heading */}
              <h2 className="font-sans font-black tracking-tight leading-[1.05] mb-1 sm:mb-2">
                <span className="block text-[22px] sm:text-[34px] md:text-[46px] xl:text-[50px] text-[#0a1c5d]">JMS MODERN</span>
                <span className="block text-[22px] sm:text-[34px] md:text-[46px] xl:text-[50px] text-[#f48c06]">CLASSES</span>
              </h2>
              <h3 className="text-[12px] sm:text-[18px] md:text-[22px] xl:text-[26px] font-sans font-black tracking-wider text-[#0a1c5d] mb-2 sm:mb-4">
                COACHING + LIBRARY
              </h3>



              {/* Description */}
              <p className="text-[10px] sm:text-[11px] md:text-[12px] text-gray-500 font-medium leading-relaxed max-w-[500px] mt-2 mb-6 sm:mb-6">
                The perfect place to study, grow and achieve.<br />
                Best environment, expert guidance and 24x7 access<br />
                to help you achieve your goals.
              </p>

              {/* 4 Feature Badges Row */}
              <div className="flex flex-nowrap sm:flex-wrap justify-between sm:justify-start gap-1 sm:gap-2 w-full max-w-[550px] mb-6 sm:mb-8 mt-1">
                {[
                  { title: "OPEN 24/7", subtitle: "Learn Anytime", iconPath: <Clock className="w-3 h-3 sm:w-5 sm:h-5 text-[#0a1c5d] stroke-[2]" /> },
                  { title: "Best Environment", subtitle: "for Study", iconPath: <svg className="w-3 h-3 sm:w-5 sm:h-5 text-[#0a1c5d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
                  { title: "Limited Seats", subtitle: "Hurry Up!", iconPath: <svg className="w-3 h-3 sm:w-5 sm:h-5 text-[#0a1c5d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M9 14l2 2 4-4"></path></svg> },
                  { title: "Experienced", subtitle: "Faculty", iconPath: <Award className="w-3 h-3 sm:w-5 sm:h-5 text-[#f48c06] stroke-[2]" /> },
                ].map((badge, idx) => (
                  <div key={idx} className="bg-white px-0.5 py-1.5 sm:px-2 sm:py-3 rounded-[6px] sm:rounded-[12px] border border-[#f48c06]/30 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center flex-1 min-w-0 max-w-[24%] sm:min-w-[100px] sm:max-w-[130px] overflow-hidden">
                    <div className="mb-0.5 sm:mb-1">
                      <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
                        {badge.iconPath}
                      </div>
                    </div>
                    <h4 className="text-[7px] sm:text-[11px] font-black text-[#0a1c5d] leading-tight mb-0.5 truncate w-full px-0.5">{badge.title}</h4>
                    <p className="text-[6px] sm:text-[10px] text-[#0a1c5d] font-semibold truncate w-full px-0.5">{badge.subtitle}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-row gap-1 sm:gap-4 w-full mt-2">
                <button
                  onClick={() => setIsAdmissionOpen(true)}
                  className="flex-1 sm:flex-none px-1 sm:px-6 py-2 sm:py-2.5 bg-[#0a1c5d] hover:bg-[#071444] text-white font-bold rounded-[6px] sm:rounded-[8px] transition-all duration-300 text-[9px] sm:text-[13px] tracking-wide flex items-center justify-center gap-1 shadow-lg whitespace-nowrap"
                >
                  ENROLL NOW <ArrowRight className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => handleNavClick("courses")}
                  className="flex-1 sm:flex-none px-1 sm:px-6 py-2 sm:py-2.5 border-2 border-[#0a1c5d] text-[#0a1c5d] font-bold rounded-[6px] sm:rounded-[8px] transition-all duration-300 text-[9px] sm:text-[13px] tracking-wide flex items-center justify-center gap-1 hover:bg-[#0a1c5d] hover:text-white whitespace-nowrap"
                >
                  EXPLORE MORE <ArrowRight className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                </button>
              </div>

            </div>

            {/* Mobile Image (Visible only on small screens) */}
            <div className="w-[38%] lg:hidden relative shrink-0">
              <div className="relative w-full aspect-[3/4] sm:aspect-square rounded-[16px] overflow-hidden shadow-xl">
                <img src="/images/hero.png" className="w-full h-full object-cover" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- About Us Section --- */}
      <section id="about-us" className="py-8 lg:py-12 bg-white relative z-10">
        <div className="max-w-[1250px] mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Left Image */}
            <div className="hidden lg:block w-full lg:w-[45%] shrink-0">
              <img src="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800" alt="JMS Modern Classes Front" className="w-full h-[350px] md:h-[450px] rounded-[24px] shadow-lg object-cover" />
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-[55%] flex flex-col items-start text-left">
              <p className="font-cursive text-2xl md:text-3xl text-[#f48c06] font-semibold italic mb-2">
                Welcome to
              </p>
              <h3 className="text-3xl md:text-4xl font-sans font-black tracking-tight leading-none mb-6">
                <span className="text-[#0a1c5d]">JMS</span> <span className="text-[#f48c06]">MODERN CLASSES</span>
              </h3>
              <p className="text-gray-500 text-[11px] md:text-[14px] leading-relaxed mb-10 font-medium">
                JMS Modern Classes is a premium study destination for students who dream big and work hard. We provide the perfect blend of peaceful environment, expert guidance, and 24x7 access to help you achieve your goals.
              </p>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full">
                {[
                  { value: "24/7", label: "Library Access" },
                  { value: "1000+", label: "Happy Students" },
                  { value: "1", label: "Bihar Topper" },
                  { value: "100%", label: "Dedicated to Success" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="card-style-2 p-3 sm:p-5 text-center flex flex-col justify-center items-center"
                  >
                    <span className="block text-[20px] sm:text-[28px] md:text-[32px] font-sans font-black text-[#f48c06] leading-none mb-1 sm:mb-2">
                      {stat.value}
                    </span>
                    <span className="block text-[9px] sm:text-[11px] md:text-[12px] font-bold text-[#0a1c5d] leading-tight">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Facilities Section --- */}
      <section id="facilities" className="py-8 lg:py-12 bg-white relative z-10 border-t border-gray-100">
        <div className="max-w-[1250px] w-full mx-auto px-4 md:px-8 text-center">

          <div className="text-[12px] font-bold text-[#0a1c5d] uppercase tracking-wider mb-3">OUR FACILITIES</div>
          <h3 className="text-[28px] md:text-[36px] font-sans font-black text-[#0a1c5d] mb-12">
            Everything You Need For <span className="text-[#f48c06]">Better Learning</span>
          </h3>

          <div className="flex flex-wrap justify-center gap-4 w-full">
            {[
              {
                label: "Fully AC\nFurnished Library",
                icon: <svg className="w-8 h-8 text-[#0a1c5d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="6" width="18" height="8" rx="2" /><path d="M7 6v2M17 6v2" /><path d="M6 14v4M10 14v4M14 14v4M18 14v4" /></svg>
              },
              {
                label: "High Speed\nFree Wi-Fi",
                icon: <svg className="w-8 h-8 text-[#0a1c5d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12.5A10 10 0 0 1 19 12.5M8.5 16a5 5 0 0 1 7 0M12 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM2 9a14 14 0 0 1 20 0" /></svg>
              },
              {
                label: "Locker\nFacilities",
                icon: <svg className="w-8 h-8 text-[#0a1c5d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="4" width="14" height="16" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M12 9.5v2.5h2.5M9 4v16" /></svg>
              },
              {
                label: "Daily Newspaper\n(Hindi/English)",
                icon: <svg className="w-8 h-8 text-[#0a1c5d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 22V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4Z" /><path d="M14 2v18M7 6h4M7 10h4M7 14h4" /></svg>
              },
              {
                label: "Parking\nSpace",
                icon: <svg className="w-8 h-8 text-[#0a1c5d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M9 16V8h4a3 3 0 0 1 0 6H9" /></svg>
              },
              {
                label: "CCTV\nSurveillance",
                icon: <svg className="w-8 h-8 text-[#0a1c5d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 18L14 10l4 4-8 8Z" /><circle cx="15" cy="13" r="2" /><path d="M3 6l3 12M18 14l3 3" /></svg>
              },
              {
                label: "RO + Mineral\nWater",
                icon: <svg className="w-8 h-8 text-[#0a1c5d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2s-8 6-8 11.5a8 8 0 0 0 16 0C20 8 12 2 12 2Z" /><path d="M12 7a2.5 2.5 0 0 0 0 5" /></svg>
              },
              {
                label: "Comfortable\nStudy Desk",
                icon: <svg className="w-8 h-8 text-[#0a1c5d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 18v3M20 18v3M4 10h16M8 10v8M16 10v8" /><path d="M7 5h10v5H7Z" /></svg>
              },

            ].map((fac, idx) => (
              <div
                key={idx}
                className="card-style-1 px-2 py-4 sm:px-3 sm:py-6 text-center flex flex-col items-center justify-center flex-1 min-w-[90px] sm:min-w-[120px] max-w-[110px] sm:max-w-[140px]"
              >
                <div className="mb-2 sm:mb-4 scale-75 sm:scale-100">{fac.icon}</div>
                <h4 className="text-[9px] sm:text-[11px] font-black text-[#0a1c5d] leading-tight whitespace-pre-line">
                  {fac.label}
                </h4>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- Topper Section --- */}
      <section id="topper" className="py-8 lg:py-12 bg-[#fbfdff] relative z-10 border-t border-gray-100">
        <div className="max-w-[1250px] mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Left Topper Image */}
            <div className="hidden lg:flex w-full lg:w-1/3 flex-col items-center">
              <div className="relative w-[280px] h-[300px] flex items-center justify-center">
                {/* Wreath */}
                <svg className="absolute inset-0 w-full h-full text-[#f48c06]" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M 50,85 C 38,85 24,75 22,50 C 20.5,32 30,18 42,12 C 40,16 35,26 36,40 C 37,54 44,70 50,85 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M 23,45 Q 18,42 24,37 Z" /><path d="M 24,35 Q 19,30 26,27 Z" /><path d="M 28,25 Q 24,19 31,18 Z" /><path d="M 33,18 Q 30,12 37,13 Z" /><path d="M 40,13 Q 39,7 45,9 Z" />
                  <path d="M 50,85 C 62,85 76,75 78,50 C 79.5,32 70,18 58,12 C 60,16 65,26 64,40 C 63,54 56,70 50,85 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M 77,45 Q 82,42 76,37 Z" /><path d="M 76,35 Q 81,30 74,27 Z" /><path d="M 72,25 Q 76,19 69,18 Z" /><path d="M 67,18 Q 70,12 63,13 Z" /><path d="M 60,13 Q 61,7 55,9 Z" />
                </svg>

                {/* Student Photo */}
                <div className="w-[160px] h-[160px] rounded-full overflow-hidden border-[4px] border-white shadow-xl z-10 mb-6 bg-slate-200">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" className="w-full h-full object-cover object-top scale-110" alt="Topper" />
                </div>

                {/* Banner */}
                <div className="absolute bottom-4 z-20 flex flex-col items-center w-[240px]">
                  <div className="w-full relative flex justify-center">
                    {/* Ribbon tails */}
                    <div className="absolute top-2 -left-2 border-t-[16px] border-l-[16px] border-b-[16px] border-transparent border-t-[#d07403] border-b-[#d07403] w-0 h-0 z-0"></div>
                    <div className="absolute top-2 -right-2 border-t-[16px] border-r-[16px] border-b-[16px] border-transparent border-t-[#d07403] border-b-[#d07403] w-0 h-0 z-0"></div>

                    <div className="bg-gradient-to-r from-[#f48c06] via-[#f7a233] to-[#f48c06] text-[#0a1c5d] px-6 py-2.5 font-sans font-black text-[16px] tracking-widest text-center shadow-lg w-[200px] z-10 relative">
                      BIHAR TOPPER
                    </div>
                  </div>
                  <div className="text-[14px] font-black text-[#0a1c5d] tracking-widest mt-3 uppercase">BSEB BOARD</div>
                </div>
              </div>
            </div>

            {/* Center Content */}
            <div className="w-full lg:w-1/3 flex flex-col items-start text-left xl:pr-10">
              <h3 className="text-[24px] md:text-[28px] font-sans font-black text-[#0a1c5d] leading-[1.2] mb-4">
                Proud Moment for JMS Modern Classes!
              </h3>
              <p className="text-gray-600 text-[14px] leading-relaxed mb-6 font-medium">
                We are extremely proud to share that our student has secured 1st Rank in BSEB Board Exams. This achievement is a result of hard work, dedication, and the right environment provided by JMS Modern Classes.
              </p>
              <p className="font-cursive text-[24px] text-[#0a1c5d] mb-6 italic">
                Your Success, Our Inspiration.
              </p>
              <button
                onClick={() => setIsAdmissionOpen(true)}
                className="px-7 py-3 bg-[#0a1c5d] hover:bg-[#071444] text-white font-bold rounded-[8px] transition-all duration-300 text-[13px] tracking-wide flex items-center gap-2 shadow-lg"
              >
                JOIN US TODAY <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Trophy */}
            <div className="hidden lg:flex w-full lg:w-1/3 justify-center relative">
              <div className="relative bg-[#fbfdff] z-10 flex items-center justify-center">
                <svg className="w-[280px] h-[280px] drop-shadow-2xl" viewBox="0 0 200 200" fill="none">
                  {/* Confetti */}
                  <circle cx="40" cy="40" r="3" fill="#f48c06" /><circle cx="160" cy="50" r="2.5" fill="#f48c06" />
                  <circle cx="30" cy="80" r="2" fill="#f48c06" /><circle cx="170" cy="90" r="3" fill="#f48c06" />
                  <circle cx="60" cy="30" r="2.5" fill="#f48c06" /><circle cx="140" cy="40" r="2" fill="#f48c06" />
                  <circle cx="20" cy="120" r="2" fill="#f48c06" /><circle cx="180" cy="110" r="2.5" fill="#f48c06" />
                  <circle cx="100" cy="10" r="3" fill="#f48c06" /><circle cx="110" cy="160" r="2" fill="#f48c06" />
                  <path d="M50 50 l 5 5 M150 70 l -5 -5 M30 100 l 5 -5 M160 120 l -5 5" stroke="#f48c06" strokeWidth="2" strokeLinecap="round" />

                  {/* Trophy Base */}
                  <path d="M 80,170 L 120,170 L 125,180 L 75,180 Z" fill="#b88e30" />
                  <path d="M 70,180 L 130,180 L 130,190 L 70,190 Z" fill="#8c6215" />
                  <path d="M 65,190 L 135,190 L 135,195 L 65,195 Z" fill="#5c400c" />

                  {/* Trophy Stem */}
                  <path d="M 95,140 L 105,140 L 110,170 L 90,170 Z" fill="#d4a342" />
                  <ellipse cx="100" cy="140" rx="15" ry="5" fill="#f5d68b" />

                  {/* Trophy Cup */}
                  <path d="M 60,60 C 60,110 140,110 140,60 Z" fill="url(#goldGrad)" />
                  <ellipse cx="100" cy="60" rx="40" ry="12" fill="#f5d68b" />

                  {/* Handles */}
                  <path d="M 60,70 C 40,70 40,100 70,100" fill="none" stroke="#e2b857" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 140,70 C 160,70 160,100 130,100" fill="none" stroke="#e2b857" strokeWidth="6" strokeLinecap="round" />

                  <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f5d68b" />
                      <stop offset="50%" stopColor="#e2b857" />
                      <stop offset="100%" stopColor="#b88e30" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Courses Section --- */}
      <section id="courses" className="py-6 lg:py-10 bg-[#fbfdff] relative z-10 border-t border-gray-100">
        <div className="max-w-[1250px] w-full mx-auto px-4 md:px-8 text-center">
          <div className="text-[12px] font-bold text-[#0a1c5d] uppercase tracking-wider mb-3">OUR COURSES</div>
          <h3 className="text-[28px] md:text-[32px] font-sans font-black text-[#0a1c5d] mb-6">
            We Offer Best Courses For Your Bright Future
          </h3>

          <div className="flex flex-wrap justify-center gap-4 w-full">
            {["Class 9th", "Class 10th", "Class 11th", "Class 12th", "BSEB", "CBSE", "Competitive\nExams"].map((course, idx) => (
              <div key={idx} className="card-style-3 px-8 py-4 text-center flex items-center justify-center whitespace-pre-line text-[#0a1c5d] font-black text-[14px] flex-1 min-w-[140px] max-w-[200px] border-t-blue-500">
                {course}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section id="testimonials" className="py-6 lg:py-10 bg-white relative z-10 border-t border-gray-100 overflow-hidden">
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes marqueeLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marqueeLeft 25s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />

        <div className="max-w-[1250px] w-full mx-auto px-4 md:px-8 text-center">
          <div className="text-[12px] font-bold text-[#0a1c5d] uppercase tracking-wider mb-8">WHAT STUDENTS SAY</div>

          <div className="relative w-full overflow-hidden">
            {/* Fade gradients for smooth entering/exiting (desktop) */}
            <div className="absolute top-0 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute top-0 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

            <div className="animate-marquee gap-6">
              {[
                {
                  text: "The environment here is very peaceful and perfect for study. Faculty members are very supportive.",
                  name: "Anjali Kumari",
                  role: "JMS Student",
                  img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
                },
                {
                  text: "Thanks to JMS Modern Classes for guiding me and helping me achieve 1st Rank in BSEB Exams.",
                  name: "Rohit Kumar",
                  role: "Bihar Topper",
                  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150"
                },
                {
                  text: "Best library in Parsauni! 24x7 access, AC rooms and all facilities are excellent.",
                  name: "Saurav Singh",
                  role: "JMS Student",
                  img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150"
                },
                // Duplicated for seamless loop
                {
                  text: "The environment here is very peaceful and perfect for study. Faculty members are very supportive.",
                  name: "Anjali Kumari",
                  role: "JMS Student",
                  img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
                },
                {
                  text: "Thanks to JMS Modern Classes for guiding me and helping me achieve 1st Rank in BSEB Exams.",
                  name: "Rohit Kumar",
                  role: "Bihar Topper",
                  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150"
                },
                {
                  text: "Best library in Parsauni! 24x7 access, AC rooms and all facilities are excellent.",
                  name: "Saurav Singh",
                  role: "JMS Student",
                  img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150"
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="card-style-1 p-6 flex flex-col text-left shrink-0 w-[300px] md:w-[400px]">
                  <div className="flex gap-4">
                    <svg className="w-8 h-8 text-[#2c4c99] shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M10 11h-4a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h4v8zm11 0h-4a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h4v8z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-[13px] text-[#0a1c5d] font-semibold leading-relaxed mt-1">
                      {testimonial.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-8 pl-12">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-300">
                      <img src={testimonial.img} className="w-full h-full object-cover" alt={testimonial.name} />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-black text-[#0a1c5d]">— {testimonial.name}</h4>
                      <p className="text-[11px] text-gray-500 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Gallery Section --- */}
      <section id="gallery" className="py-6 lg:py-10 bg-white relative z-10 border-t border-gray-100">
        <div className="max-w-[1250px] w-full mx-auto px-4 md:px-8 text-center">
          <div className="text-[12px] font-bold text-[#0a1c5d] uppercase tracking-wider mb-6">OUR LIBRARY GALLERY</div>

          <div className="grid grid-cols-3 md:flex md:flex-wrap md:justify-center gap-1.5 md:gap-3 mb-8 w-full">
            {[
              "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=400",
              "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=400",
              "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400",
              "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400",
              "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400"
              // "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=400"
            ].map((imgUrl, i) => (
              <div key={i} className="w-full h-[80px] sm:h-[120px] md:h-[160px] md:flex-1 md:min-w-[200px] md:max-w-[350px] rounded-[6px] md:rounded-[12px] overflow-hidden border border-gray-150 shadow-sm relative group cursor-pointer">
                <img src={imgUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={"Library " + i} />
              </div>
            ))}
          </div>

          <button className="px-6 py-2 bg-[#f0f4f8] text-[#0a1c5d] font-bold rounded-full text-[12px] flex items-center gap-2 mx-auto hover:bg-[#e2e8f0] transition-colors border border-gray-200 shadow-sm">
            VIEW MORE PHOTOS <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* --- Footer & Contact Block --- */}
      <footer className="pt-12 pb-8 bg-black relative z-10 border-t border-gray-900">
        <div className="max-w-[1250px] w-full mx-auto px-4 md:px-8">

          {/* Top Info Row */}
          <div className="flex flex-col lg:flex-row justify-between gap-6 mb-16 items-start lg:items-center bg-gray-900 p-6 lg:p-8 rounded-[20px] shadow-sm border border-gray-800">
            <div className="flex flex-col">
              <h4 className="text-[14px] font-black text-white">Get In Touch</h4>
              <p className="text-[12px] text-gray-400 mt-1 font-medium">We are here to help you.<br />Reach out for any queries.</p>
            </div>

            <div className="w-px h-12 bg-gray-800 hidden lg:block"></div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-[#f48c06]" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-white">Call Us</p>
                <p className="text-[13px] font-black text-white leading-tight mt-0.5">7352527752<br />9060425858</p>
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
                <p className="text-[12px] text-gray-400 font-medium max-w-[200px] leading-snug mt-0.5">Kushwaha Market, Parsauni<br />Near Parsauni Petrol Pump</p>
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
                  <button onClick={() => handleNavClick("home")} className="text-left hover:text-[#f48c06] transition-colors">Home</button>
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
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-[#25D366] transition-colors">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.59 1.97 14.12 .95 11.487.95c-5.44 0-9.866 4.372-9.87 9.802 0 2.01.524 3.9 1.515 5.526L2.082 22l5.858-1.518c.005.003.005.004.565.372z" /></svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-[#FF0000] transition-colors">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
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
