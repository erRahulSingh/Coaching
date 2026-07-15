import React, { useState } from "react";
import { X, CheckCircle, ArrowRight, Phone, MessageSquare } from "lucide-react";

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdmissionModal({ isOpen, onClose }: AdmissionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    course: "Class 10 (BSEB)",
    shift: "Morning (6 AM - 12 PM)",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Try calling local Express backend
      const response = await fetch("http://localhost:5000/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("Backend offline. Redirection mode.");
      }
    } catch (err) {
      console.warn("Direct API failed, redirecting student directly to WhatsApp notification", err);
      // Fallback: Lead is generated on WhatsApp directly! Extremely effective for mobile users!
      const messageText = `*JMS Modern Classes & Library - Admission Enquiry*\n\n` +
        `*Name:* ${formData.name}\n` +
        `*Phone:* ${formData.phone}\n` +
        `*WhatsApp:* ${formData.whatsapp}\n` +
        `*Course:* ${formData.course}\n` +
        `*Library Shift:* ${formData.shift}`;
      
      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/917352527752?text=${encodedMessage}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, "_blank");
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#00173d]/90 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-lg bg-[#00173d] rounded-2xl overflow-hidden shadow-2xl z-10 border border-gold/30"
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gold/10 bg-[#001235]">
          <h3 className="text-xl font-heading font-bold text-gold">
            JMS Smart Admission Form
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form / Success Screen */}
        <div className="p-6 bg-[#00173d]">
          {isSuccess ? (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/30"
              >
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-heading font-bold text-white mb-2">
                Enquiry Submitted!
              </h4>
              <p className="text-gray-400 mb-6 text-sm max-w-sm mx-auto">
                Thank you for choosing JMS. Our representative will contact you via Phone or WhatsApp within 12 hours.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gold hover:bg-gold-dark text-[#00173d] font-bold rounded-lg transition-colors inline-flex items-center gap-2 text-sm shadow-lg shadow-gold/20"
              >
                Close Window <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gold mb-1.5 uppercase tracking-wider">
                  Student Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Rahul Kumar"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#001235] border border-gold/10 focus:border-gold rounded-lg focus:outline-none text-white text-sm transition-colors placeholder:text-gray-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gold mb-1.5 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. 7352527752"
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#001235] border border-gold/10 focus:border-gold rounded-lg focus:outline-none text-white text-sm transition-colors placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gold mb-1.5 uppercase tracking-wider">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    placeholder="e.g. 9060425858"
                    pattern="[0-9]{10}"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#001235] border border-gold/10 focus:border-gold rounded-lg focus:outline-none text-white text-sm transition-colors placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold mb-1.5 uppercase tracking-wider">
                  Select Course / Class
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#001235] border border-gold/10 focus:border-gold rounded-lg focus:outline-none text-white text-sm transition-colors"
                >
                  <option value="Class 9 (Foundation)">Class 9 (Foundation)</option>
                  <option value="Class 10 (BSEB)">Class 10 (BSEB)</option>
                  <option value="Class 11 (Science/Arts)">Class 11 (Science/Arts)</option>
                  <option value="Class 12 (Board Prep)">Class 12 (Board Prep)</option>
                  <option value="CBSE Foundation">CBSE Foundation</option>
                  <option value="Competitive Exam Prep">Competitive Exam Prep</option>
                  <option value="Smart Library Membership">Smart Library Membership (Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold mb-1.5 uppercase tracking-wider">
                  Preferred Library Shift
                </label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#001235] border border-gold/10 focus:border-gold rounded-lg focus:outline-none text-white text-sm transition-colors"
                >
                  <option value="Morning (6 AM - 12 PM)">Morning Shift (6:00 AM - 12:00 PM)</option>
                  <option value="Midday (12 PM - 6 PM)">Midday Shift (12:00 PM - 6:00 PM)</option>
                  <option value="Evening (6 PM - 11 PM)">Evening Shift (6:00 PM - 11:00 PM)</option>
                  <option value="Full Day (24 Hours)">Full Day Shift (24 Hours access)</option>
                  <option value="Special Reserved Seat">Special Reserved Seat (Fixed desk)</option>
                </select>
              </div>

              {errorMessage && (
                <div className="text-red-500 text-xs mt-1 text-center bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 bg-gold hover:bg-gold-dark disabled:bg-gold/50 text-[#00173d] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-xl shadow-gold/15 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-[#00173d] border-t-transparent" />
                    Submitting...
                  </span>
                ) : (
                  <>
                    Confirm Admission Request <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
