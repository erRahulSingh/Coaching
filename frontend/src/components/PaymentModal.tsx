"use client";

import React, { useState } from "react";
import { X, CheckCircle, ArrowRight, ShieldCheck, CreditCard } from "lucide-react";
import { API_BASE_URL } from "@/config";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: {
    name: string;
    price: number;
    admissionFee: number;
  } | null;
}

export default function PaymentModal({ isOpen, onClose, batch }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !batch) return null;

  const totalAmount = batch.price + batch.admissionFee;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("studentToken");
      const studentInfo = JSON.parse(localStorage.getItem("studentInfo") || "{}");

      if (!token) {
        setError("User session not found. Please log in first.");
        setIsProcessing(false);
        return;
      }

      // 1. Create order on Express backend
      const res = await fetch(`${API_BASE_URL}/api/payment/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          batchName: batch.name,
          amount: totalAmount
        })
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || "Failed to create order on server");
      }

      // 2. Load Razorpay Checkout Script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Unable to connect to Razorpay payment gateway. Please check your internet connection.");
      }

      // 3. Configure Razorpay Gateway Options
      const options = {
        key: "rzp_test_SUIH6k4l3JewbV", // Test Key ID provided
        amount: orderData.amount,
        currency: orderData.currency,
        name: "JMS Modern Classes & Library",
        description: `Enrollment Fee for ${batch.name}`,
        image: "/images/jms.logo.png",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          setIsProcessing(true);
          try {
            // 4. Verify payment signature on the backend
            const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              setIsSuccess(true);
            } else {
              setError(verifyData.error || "Payment signature verification failed");
            }
          } catch (verifyErr: any) {
            setError(verifyErr.message || "Failed to verify transaction");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: studentInfo.name || "",
          email: studentInfo.email || "",
          contact: studentInfo.phone || ""
        },
        notes: {
          address: "Parsauni, Bihar"
        },
        theme: {
          color: "#0a1c5d"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpayObject = new (window as any).Razorpay(options);
      razorpayObject.open();

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={isProcessing ? undefined : onClose}
        className="absolute inset-0 bg-[#00173d]/90 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl z-10 border border-slate-100 flex flex-col text-slate-800">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a1c5d] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#f48c06]" />
            <h3 className="text-base font-black tracking-tight">Secure Payment Checkout</h3>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center bg-white flex flex-col items-center">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 border-2 border-green-200 animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h4 className="text-2xl font-black text-[#0a1c5d] mb-2">Payment Successful!</h4>
            <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed">
              Your enrollment in <strong className="text-[#0a1c5d]">{batch.name}</strong> has been successfully processed via Razorpay.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#0a1c5d] hover:bg-[#f48c06] text-white font-bold rounded-xl transition-all shadow-lg text-sm"
            >
              Okay, Great!
            </button>
          </div>
        ) : (
          <div className="p-6 bg-white space-y-6">
            {/* Summary */}
            <div className="bg-[#0a1c5d]/5 rounded-2xl p-4 border border-[#0a1c5d]/10">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order Summary</h4>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-black text-[#0a1c5d]">{batch.name}</span>
                <span className="text-sm font-bold text-slate-800">₹{batch.price}</span>
              </div>
              <div className="flex justify-between items-center mb-3 text-xs text-gray-500 font-semibold">
                <span>One-time Admission Fee</span>
                <span>₹{batch.admissionFee}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-center font-black">
                <span className="text-sm text-[#0a1c5d]">Total Amount Payable</span>
                <span className="text-lg text-[#f48c06]">₹{totalAmount}</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-xs text-center bg-red-50 py-3 rounded-xl border border-red-200 font-medium">
                {error}
              </div>
            )}

            {/* Payment Call To Action */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleRazorpayPayment}
                disabled={isProcessing}
                className="w-full py-4 bg-[#0a1c5d] hover:bg-[#f48c06] text-white font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Connecting Securely...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> Pay Securely via Razorpay <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex justify-center items-center gap-6 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-green-500" /> PCI-DSS Compliant</span>
                <span>•</span>
                <span>100% Encrypted</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
