"use client";

import React, { useState } from "react";
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
  Shield,
  Wallet,
  Calendar,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useTheme } from "@/components/AppWrapper";
import AdmissionModal from "@/components/AdmissionModal";

// --- Pricing Types & Data ---
type Batch = {
  name: string;
  time: string;
  price: number;
  admissionFee: number;
  features: string[];
  color: string; // for pricing badge & CTA button
  bulletColor: string; // checkbox color
};

type TabData = {
  [key: string]: Batch[];
};

const BATCH_DATA: TabData = {
  "class-9-10": [
    {
      name: "Morning Batch",
      time: "06:00 AM - 11:00 AM",
      price: 3000,
      admissionFee: 500,
      features: ["Daily 5 Hours Classes", "Doubt Solving Sessions", "Weekly Tests", "Library Access"],
      color: "bg-[#0a1c5d] hover:bg-[#071444] text-white",
      bulletColor: "text-[#0a1c5d]"
    },
    {
      name: "Midday Batch",
      time: "11:00 AM - 04:00 PM",
      price: 4000,
      admissionFee: 500,
      features: ["Daily 5 Hours Classes", "Doubt Solving Sessions", "Weekly Tests", "Library Access"],
      color: "bg-[#f48c06] hover:bg-[#d07403] text-white",
      bulletColor: "text-[#f48c06]"
    },
    {
      name: "Evening Batch",
      time: "04:00 PM - 09:00 PM",
      price: 3000,
      admissionFee: 500,
      features: ["Daily 5 Hours Classes", "Doubt Solving Sessions", "Weekly Tests", "Library Access"],
      color: "bg-[#10b981] hover:bg-[#059669] text-white",
      bulletColor: "text-[#10b981]"
    },
    {
      name: "Full Day Batch (School + Coaching)",
      time: "06:00 AM - 09:00 PM",
      price: 6000,
      admissionFee: 1000,
      features: ["All Subject Classes", "Doubt Solving Sessions", "Weekly & Monthly Tests", "Library Access (24/7)", "Personal Mentorship"],
      color: "bg-[#6366f1] hover:bg-[#4f46e5] text-white",
      bulletColor: "text-[#6366f1]"
    }
  ],
  "class-11-12": [
    {
      name: "Morning Batch",
      time: "06:00 AM - 11:00 AM",
      price: 3500,
      admissionFee: 500,
      features: ["Daily 5 Hours Classes", "Doubt Solving Sessions", "Weekly Tests", "Library Access"],
      color: "bg-[#0a1c5d] hover:bg-[#071444] text-white",
      bulletColor: "text-[#0a1c5d]"
    },
    {
      name: "Midday Batch",
      time: "11:00 AM - 04:00 PM",
      price: 4500,
      admissionFee: 500,
      features: ["Daily 5 Hours Classes", "Doubt Solving Sessions", "Weekly Tests", "Library Access"],
      color: "bg-[#f48c06] hover:bg-[#d07403] text-white",
      bulletColor: "text-[#f48c06]"
    },
    {
      name: "Evening Batch",
      time: "04:00 PM - 09:00 PM",
      price: 3500,
      admissionFee: 500,
      features: ["Daily 5 Hours Classes", "Doubt Solving Sessions", "Weekly Tests", "Library Access"],
      color: "bg-[#10b981] hover:bg-[#059669] text-white",
      bulletColor: "text-[#10b981]"
    },
    {
      name: "Full Day Batch (School + Coaching)",
      time: "06:00 AM - 09:00 PM",
      price: 7000,
      admissionFee: 1000,
      features: ["All Subject Classes", "Doubt Solving Sessions", "Weekly & Monthly Tests", "Library Access (24/7)", "Personal Mentorship"],
      color: "bg-[#6366f1] hover:bg-[#4f46e5] text-white",
      bulletColor: "text-[#6366f1]"
    }
  ],
  "competitive-exams": [
    {
      name: "Morning Batch (JEE/NEET Prep)",
      time: "06:00 AM - 11:00 AM",
      price: 4000,
      admissionFee: 500,
      features: ["Specialized Coaching", "Doubt Solving Sessions", "Regular Mock Tests", "Library Access"],
      color: "bg-[#0a1c5d] hover:bg-[#071444] text-white",
      bulletColor: "text-[#0a1c5d]"
    },
    {
      name: "Midday Batch (NTSE/Olympiad)",
      time: "11:00 AM - 04:00 PM",
      price: 5000,
      admissionFee: 500,
      features: ["Specialized Coaching", "Doubt Solving Sessions", "Regular Mock Tests", "Library Access"],
      color: "bg-[#f48c06] hover:bg-[#d07403] text-white",
      bulletColor: "text-[#f48c06]"
    },
    {
      name: "Evening Batch (JEE/NEET Prep)",
      time: "04:00 PM - 09:00 PM",
      price: 4000,
      admissionFee: 500,
      features: ["Specialized Coaching", "Doubt Solving Sessions", "Regular Mock Tests", "Library Access"],
      color: "bg-[#10b981] hover:bg-[#059669] text-white",
      bulletColor: "text-[#10b981]"
    },
    {
      name: "Full Day Batch (Premium Prep)",
      time: "06:00 AM - 09:00 PM",
      price: 8000,
      admissionFee: 1000,
      features: ["All Subject Coaching", "One-to-One Mentor Sessions", "National Test Series", "Library Access (24/7)", "Study Room Locker"],
      color: "bg-[#6366f1] hover:bg-[#4f46e5] text-white",
      bulletColor: "text-[#6366f1]"
    }
  ],
  "foundation-courses": [
    {
      name: "Morning Batch (Foundation)",
      time: "06:00 AM - 11:00 AM",
      price: 3200,
      admissionFee: 500,
      features: ["Core Subjects Foundation", "Doubt Solving Sessions", "Weekly Tests", "Library Access"],
      color: "bg-[#0a1c5d] hover:bg-[#071444] text-white",
      bulletColor: "text-[#0a1c5d]"
    },
    {
      name: "Midday Batch (Foundation)",
      time: "11:00 AM - 04:00 PM",
      price: 4200,
      admissionFee: 500,
      features: ["Core Subjects Foundation", "Doubt Solving Sessions", "Weekly Tests", "Library Access"],
      color: "bg-[#f48c06] hover:bg-[#d07403] text-white",
      bulletColor: "text-[#f48c06]"
    },
    {
      name: "Evening Batch (Foundation)",
      time: "04:00 PM - 09:00 PM",
      price: 3200,
      admissionFee: 500,
      features: ["Core Subjects Foundation", "Doubt Solving Sessions", "Weekly Tests", "Library Access"],
      color: "bg-[#10b981] hover:bg-[#059669] text-white",
      bulletColor: "text-[#10b981]"
    },
    {
      name: "Full Day Batch (Premium Foundation)",
      time: "06:00 AM - 09:00 PM",
      price: 6500,
      admissionFee: 1000,
      features: ["Complete Core Prep", "Personal Attention Sessions", "Advanced Tests & Analytics", "Library Access (24/7)", "Dedicated Mentoring"],
      color: "bg-[#6366f1] hover:bg-[#4f46e5] text-white",
      bulletColor: "text-[#6366f1]"
    }
  ]
};

export default function PricingPage() {
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("class-9-10");
  
  // FAQ toggles (holds open states)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    if (id === "home") {
      window.location.href = "/";
    } else if (id === "facilities") {
      window.location.href = "/facilities";
    } else if (id === "pricing") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent("Hello JMS, I'm interested in taking admission in Coaching / Library. Please share details.");
    window.open(`https://wa.me/917352527752?text=${text}`, "_blank");
  };

  const faqs = [
    {
      q: "Is there any admission fee?",
      a: "Yes, there is a one-time admission fee of ₹500 for normal batches and ₹1000 for full-day batches."
    },
    {
      q: "Is library access included in all batches?",
      a: "Yes, standard library access is included in all batch schedules during their class hours. Full Day batch has 24/7 library access."
    },
    {
      q: "Can I pay the fees in installments?",
      a: "Yes, for yearly foundation courses, we offer flexible installment options. Monthly plans are paid monthly."
    },
    {
      q: "What is the refund policy?",
      a: "Admission fees are non-refundable. Monthly course fees are also non-refundable after the batch classes begin."
    },
    {
      q: "Are there any extra charges?",
      a: "No, our fee structure is 100% transparent. High-speed WiFi, AC study space, and library facilities are fully included in the plan."
    },
    {
      q: "Do you offer any scholarships?",
      a: "Yes, we offer up to 50% merit scholarship for top performers in our regular internal tests and board toppers."
    }
  ];

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
          <nav className="hidden lg:flex items-center gap-8">
            {["Home", "Facilities", "Courses", "Pricing"].map((item) => {
              const id = item.toLowerCase().replace(" ", "-");
              const isActive = item === "Pricing";
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
            <span className="text-[#0a1c5d]">Pricing</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              <span className="text-[12px] md:text-[13px] font-black text-[#f48c06] uppercase tracking-[0.15em] mb-4 inline-block">
                PRICING PLANS
              </span>
              
              <h2 className="text-[36px] md:text-[48px] lg:text-[54px] font-sans font-black tracking-tight text-[#0a1c5d] leading-[1.1] mb-6">
                Affordable Fees,<br/>
                Quality <span className="text-[#f48c06]">Education</span>
              </h2>

              <p className="text-gray-600 text-[15px] md:text-[17px] font-medium leading-relaxed mb-8 max-w-[600px]">
                We believe that quality education should be accessible to everyone. Our pricing plans are designed to provide the best learning experience at an affordable price.
              </p>

              {/* 3 small stats badges */}
              <div className="flex flex-wrap gap-4 w-full max-w-[580px]">
                {[
                  { label: "No Hidden Charges", desc: "100% Transparent", icon: <Shield className="w-5 h-5 text-[#0a1c5d]" /> },
                  { label: "Affordable Fees", desc: "Best Value for Education", icon: <Award className="w-5 h-5 text-[#0a1c5d]" /> },
                  { label: "Easy Payment", desc: "Flexible Options", icon: <Wallet className="w-5 h-5 text-[#0a1c5d]" /> },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-gray-150 rounded-[16px] p-4 flex items-center gap-3 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] flex-1 min-w-[140px]">
                    <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      {stat.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-[12px] font-black text-[#0a1c5d] leading-tight mb-0.5">{stat.label}</p>
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
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800" 
                  alt="JMS Smart Library Desk Study Room"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Badge overlay */}
              <div className="absolute -bottom-6 left-4 md:-left-6 bg-white rounded-[24px] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.15)] p-4 flex items-center gap-4 border border-gray-50 z-20 w-[240px] md:w-[260px]">
                <div className="w-14 h-14 rounded-full bg-[#0a1c5d] flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[13px] uppercase font-black text-gray-400 tracking-wider leading-none">Invest Today</p>
                  <p className="text-[16px] font-black text-[#0a1c5d] leading-snug mt-1">In Your Future</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- Horizontal Stats Bar --- */}
      <section className="py-6 lg:py-8 bg-transparent relative z-10 border-t border-gray-150">
        <div className="max-w-[1250px] mx-auto px-4 md:px-8">
          <div className="card-style-2 p-4 sm:p-6 md:p-8 grid grid-cols-2 md:flex md:flex-row justify-around items-center gap-4 sm:gap-6 md:gap-4 w-full">
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
                    <span className="block text-[28px] md:text-[30px] font-sans font-black text-[#0a1c5d] leading-none mb-1">
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
        </div>
      </section>

      {/* --- Plans Selector Grid (Image 1 middle/bottom) --- */}
      <section className="py-8 lg:py-20 bg-transparent relative z-10 border-t border-gray-150">
        <div className="max-w-[1250px] mx-auto px-4 md:px-8 text-center">
          
          <span className="text-[12px] md:text-[13px] font-black text-[#f48c06] uppercase tracking-[0.15em] mb-3 inline-block">
            OUR PRICING
          </span>
          
          <h3 className="text-[28px] md:text-[36px] font-sans font-black text-[#0a1c5d] mb-4">
            Choose The Best Plan For You
          </h3>
          
          <div className="flex items-center justify-center gap-4 mb-10 text-slate-200">
            <span className="w-12 h-px bg-slate-200"></span>
            <BookOpen className="w-4 h-4 text-[#f48c06]" />
            <span className="w-12 h-px bg-slate-200"></span>
          </div>

          {/* Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-3.5 mb-16">
            {[
              { id: "class-9-10", label: "Class 9th - 10th" },
              { id: "class-11-12", label: "Class 11th - 12th" },
              { id: "competitive-exams", label: "Competitive Exams" },
              { id: "foundation-courses", label: "Foundation Courses" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full font-black text-[13px] transition-all duration-300 border ${
                    isActive 
                      ? "bg-[#0a1c5d] text-white border-[#0a1c5d] shadow-md shadow-blue-900/10" 
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-350 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch w-full mb-16">
            {BATCH_DATA[activeTab].map((batch, idx) => (
              <div 
                key={idx}
                className={`card-style-3 p-6 ${
                  batch.color.includes('0a1c5d') ? 'border-t-[#0a1c5d]' :
                  batch.color.includes('f48c06') ? 'border-t-[#f48c06]' :
                  batch.color.includes('10b981') ? 'border-t-[#10b981]' :
                  'border-t-[#6366f1]'
                }`}
              >
                {/* Batch Header */}
                <div className="text-center pb-6 border-b border-slate-100">
                  <h4 className="text-[17px] font-black text-[#0a1c5d] mb-1.5 leading-snug min-h-[50px] flex items-center justify-center">
                    {batch.name}
                  </h4>
                  <span className="inline-block text-[11px] font-bold text-gray-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    {batch.time}
                  </span>
                </div>

                {/* Features List */}
                <div className="py-8 flex-1 flex flex-col justify-start">
                  <div className="flex flex-col gap-3.5 text-left">
                    {batch.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5">
                        <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${batch.bulletColor}`} />
                        <span className="text-[13px] text-slate-700 font-semibold">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="mb-6">
                    <span className="text-[28px] font-black text-[#0a1c5d]">
                      ₹ {batch.price}
                    </span>
                    <span className="text-[12px] text-gray-500 font-bold ml-1">/ Month</span>
                  </div>

                  <button
                    onClick={() => setIsAdmissionOpen(true)}
                    className={`w-full py-3.5 rounded-[8px] font-bold text-[13px] tracking-wide uppercase transition-all duration-300 shadow-md ${batch.color}`}
                  >
                    ENROLL NOW →
                  </button>

                  <p className="text-[11px] text-gray-400 font-bold mt-3 leading-none">
                    Admission Fee: ₹{batch.admissionFee} (One Time)
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sibling & Merit Discount Grid (Image 2 top) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch text-left w-full">
            
            {/* Sibling Discount Card */}
            <div className="card-style-2 p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                <Users className="w-5 h-5 text-[#0a1c5d]" />
              </div>
              <div>
                <h5 className="text-[14px] font-black text-[#0a1c5d] mb-1">
                  Sibling Discount
                </h5>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Get 10% discount on monthly fee for second sibling.
                </p>
              </div>
            </div>

            {/* Helper Banner (Center) */}
            <div className="rounded-[20px] overflow-hidden relative p-6 flex items-center shadow-md bg-gradient-to-r from-[#051341] to-[#0a226e]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400')] bg-cover bg-center mix-blend-overlay opacity-15 z-0" />
              <div className="flex flex-col items-start relative z-10 max-w-[280px]">
                <h5 className="text-white font-black text-[14px] mb-1 leading-tight">
                  Need Help Choosing a Plan?
                </h5>
                <p className="text-slate-300 font-medium text-[11px] leading-relaxed mb-4">
                  Our academic counselor will help you choose the best plan for your goals.
                </p>
                <button
                  onClick={() => setIsAdmissionOpen(true)}
                  className="px-4 py-2 border border-[#f48c06] text-[#f48c06] hover:bg-[#f48c06] hover:text-white transition-all font-bold text-[10px] uppercase rounded-[4px] tracking-wider"
                >
                  TALK TO COUNSELOR →
                </button>
              </div>
              {/* Floating student avatar in mockup */}
              <div className="absolute right-0 bottom-0 top-0 w-[110px] hidden md:block pointer-events-none z-0">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300" 
                  alt="Student Helper Avatar" 
                  className="w-full h-full object-cover object-top opacity-50 lg:opacity-75"
                />
              </div>
            </div>

            {/* Merit Scholarship Card */}
            <div className="card-style-2 p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                <Award className="w-5 h-5 text-[#0a1c5d]" />
              </div>
              <div>
                <h5 className="text-[14px] font-black text-[#0a1c5d] mb-1">
                  Merit Scholarship
                </h5>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Scholarships available for meritorious students.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- FAQ Section (Image 2 middle) --- */}
      <section className="py-8 lg:py-20 bg-transparent relative z-10 border-t border-gray-150">
        <div className="max-w-[1250px] mx-auto px-4 md:px-8 text-center">
          
          <span className="text-[12px] md:text-[13px] font-black text-blue-600 uppercase tracking-widest mb-3 inline-block">
            FREQUENTLY ASKED QUESTIONS
          </span>
          
          <h3 className="text-[28px] md:text-[36px] font-sans font-black text-[#0a1c5d] mb-4">
            Fee Related Questions
          </h3>
          
          <div className="flex items-center justify-center gap-4 mb-16 text-slate-200">
            <span className="w-12 h-px bg-slate-200"></span>
            <BookOpen className="w-4 h-4 text-[#f48c06]" />
            <span className="w-12 h-px bg-slate-200"></span>
          </div>

          {/* FAQ Main Content Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full mb-16 text-left relative z-10">
            
            {/* Left Column: Interactive Phone Mockup & Illustration */}
            <div className="hidden lg:flex lg:col-span-5 justify-center items-center relative py-10">
              {/* Background glowing rings */}
              <div className="absolute w-[300px] h-[300px] rounded-full bg-orange-400/10 blur-[50px] animate-pulse" />
              <div className="absolute w-[200px] h-[400px] rounded-full bg-blue-600/5 blur-[60px]" />
              
              {/* Phone Container */}
              <div className="relative w-[280px] h-[540px] rounded-[36px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800 flex flex-col justify-between overflow-hidden group hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 z-10">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center">
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full mb-1" />
                </div>
                
                {/* Screen Content */}
                <div className="w-full h-full rounded-[28px] bg-slate-50 overflow-hidden flex flex-col justify-start relative pt-8 p-3.5 select-none">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-2 py-1 text-[10px] text-slate-400 font-bold mb-3">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-3.5 h-2 bg-slate-400 rounded-xs" />
                    </div>
                  </div>
                  
                  {/* Phone Header */}
                  <div className="text-center mb-4">
                    <h5 className="text-[18px] font-sans font-black text-slate-800 leading-none">FAQ</h5>
                    <p className="text-[8px] text-blue-600 font-black tracking-widest uppercase mt-1">- FREQUENTLY ASKED QUESTIONS</p>
                  </div>
                  
                  {/* Colorful Phone Cards */}
                  <div className="flex flex-col gap-2.5">
                    {[
                      { num: "Q1", title: "Admission Fee?", color: "from-orange-500 to-amber-500", desc: "One time setup fee." },
                      { num: "Q2", title: "Library Hours?", color: "from-blue-500 to-cyan-500", desc: "Access terms & timing." },
                      { num: "Q3", title: "Pricing Plans?", color: "from-yellow-500 to-orange-400", desc: "Batch & course fees." },
                      { num: "Q4", title: "Installments?", color: "from-green-500 to-emerald-500", desc: "Flexible payment terms." },
                      { num: "Q5", title: "Refund Policy?", color: "from-red-500 to-rose-500", desc: "Terms of cancellation." }
                    ].map((card, idx) => (
                      <div key={idx} className="bg-white border border-slate-100 rounded-[14px] p-2 flex items-center gap-2.5 shadow-sm hover:translate-x-1 transition-transform duration-300">
                        <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} text-white flex items-center justify-center font-black text-[12px] shrink-0`}>
                          {card.num}
                        </span>
                        <div className="text-left leading-tight">
                          <p className="text-[11px] font-black text-slate-800">{card.title}</p>
                          <p className="text-[8px] text-slate-400 font-medium">{card.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Little 3D-styled Cartoon character avatar floating next to phone */}
              <div className="absolute -left-12 bottom-6 w-[160px] h-[220px] z-20 pointer-events-none drop-shadow-2xl animate-float">
                <svg className="w-full h-full" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="35" r="18" fill="#e2b857" />
                  <path d="M50 18 C 50 18, 48 10, 38 12 C 34 13, 33 18, 33 18 L 30 25 L 42 22 L 50 18 Z" fill="#2c4c99" />
                  <path d="M 32,32 Q 50,15 68,32" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
                  <path d="M30 65 C30 53, 70 53, 70 65 L 75 110 L 25 110 Z" fill="#0a1c5d" />
                  <path d="M 40,65 L 50,85 L 60,65" stroke="#f48c06" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 68,65 Q 92,60 85,55" stroke="#e2b857" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 35,60 L 35,90 M 65,60 L 65,90" stroke="#f48c06" strokeWidth="4" />
                  <path d="M 45,43 Q 50,47 55,43" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="44" cy="33" r="2" fill="#1e293b" />
                  <circle cx="56" cy="33" r="2" fill="#1e293b" />
                </svg>
              </div>
            </div>

            {/* Right Column: Unified Accordion List (Gradient Border Card) */}
            <div className="lg:col-span-7 card-style-1 p-6 md:p-8 flex flex-col w-full shadow-lg">
              <div className="flex flex-col">
                {faqs.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  const isLast = idx === faqs.length - 1;
                  return (
                    <div 
                      key={idx} 
                      className={`w-full py-4.5 ${!isLast ? "border-b border-gray-100" : ""}`}
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between text-left font-black text-[15px] md:text-[16px] text-[#0a1c5d] hover:text-[#f48c06] transition-colors py-2 focus:outline-none"
                      >
                        <span className="pr-4">{item.q}</span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm text-[#0a1c5d] hover:bg-slate-100 transition-colors">
                          <span className="font-bold text-[18px] leading-none select-none">
                            {isOpen ? "−" : "+"}
                          </span>
                        </div>
                      </button>
                      
                      {/* Accordion Smooth Expand */}
                      <div 
                        className={`transition-all duration-300 overflow-hidden ${
                          isOpen ? "max-h-[200px] opacity-100 mt-3" : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-[13px] md:text-[14px] text-gray-500 font-semibold leading-relaxed pl-1 pr-6 pb-2">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Bottom Full-Width Banner (Image 2 bottom) */}
          <div className="w-full rounded-[20px] overflow-hidden relative p-6 sm:p-8 md:p-10 shadow-lg bg-[#040e2d] border border-blue-900/10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-left">
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-full bg-blue-900/30 flex items-center justify-center shrink-0">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-[12px] font-black text-slate-400 tracking-wider uppercase block mb-1">
                  Admission Open For 2024-25 Session
                </span>
                <h4 className="text-[24px] md:text-[28px] font-sans font-black text-white leading-none">
                  Secure Your Seat <span className="text-[#f48c06]">Today!</span>
                </h4>
              </div>
            </div>

            <button
              onClick={() => setIsAdmissionOpen(true)}
              className="px-8 py-3.5 bg-[#f48c06] hover:bg-[#d07403] text-white font-bold rounded-[8px] transition-all duration-300 text-[13px] tracking-wide flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 z-10 whitespace-nowrap"
            >
              ENROLL NOW →
            </button>
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
