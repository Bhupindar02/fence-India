"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  X,
  FileText,
  ArrowUpRight,
  Loader2,
  Calendar,
  Ruler,
  MapPin,
  Lock,
  Phone,
  Mail,
  User,
  Home,
  Layers,
} from "lucide-react";
import { inquiryOptions } from "@/data/inquiryOptions";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  zipCode: string;
  preferredContactMethod: string;
  propertyType: string;
  fenceType: string;
  fenceLength: string;
  fenceHeight: string;
  gatesCount: string;
  timeline: string;
  description: string;
  website_hp: string; // Honeypot field
}

interface FormErrors {
  [key: string]: string;
}

export default function InquiryFormSection() {
  const [values, setValues] = useState<FormValues>({
    fullName: "",
    email: "",
    phone: "",
    zipCode: "",
    preferredContactMethod: "Phone Call",
    propertyType: "Independent Villa / Bungalow / Kothi",
    fenceType: "Wood Privacy (Teak / Treated Hardwood)",
    fenceLength: "",
    fenceHeight: "6 Feet (Standard Residential Privacy)",
    gatesCount: "1 Single Pedestrian Walk Gate (4 ft)",
    timeline: "Immediately (1–2 Weeks)",
    description: "",
    website_hp: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{
    leadId: string;
    fullName: string;
    fenceType: string;
    zipCode: string;
  } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preselection support via URL params or custom event
  useEffect(() => {
    // 1. Check URL parameters e.g. ?fence=vinyl or #inquiry-form?type=aluminum
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get("type") || urlParams.get("fence");
    if (typeParam) {
      const match = inquiryOptions.fenceTypes.find(
        (t) =>
          t.id.toLowerCase().includes(typeParam.toLowerCase()) ||
          t.label.toLowerCase().includes(typeParam.toLowerCase())
      );
      if (match) {
        setValues((prev) => ({ ...prev, fenceType: match.label }));
      }
    }

    // 2. Custom event listener from other CTA buttons
    const handlePreselect = (event: CustomEvent<{ fenceType?: string; footage?: number }>) => {
      if (event.detail?.fenceType) {
        const match = inquiryOptions.fenceTypes.find(
          (t) =>
            t.id.toLowerCase().includes(event.detail.fenceType!.toLowerCase()) ||
            t.label.toLowerCase().includes(event.detail.fenceType!.toLowerCase())
        );
        if (match) {
          setValues((prev) => ({
            ...prev,
            fenceType: match.label,
            fenceLength: event.detail.footage ? String(event.detail.footage) : prev.fenceLength,
          }));
        }
      }
    };

    window.addEventListener("preselectFencingOption" as any, handlePreselect as any);
    return () => {
      window.removeEventListener("preselectFencingOption" as any, handlePreselect as any);
    };
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 28,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "all",
        });
      }

      if (formCardRef.current) {
        gsap.from(formCardRef.current, {
          scrollTrigger: {
            trigger: formCardRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 35,
          duration: 0.75,
          ease: "power2.out",
          clearProps: "all",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Format Phone Number for India (e.g. +91 98765 43210 or 98765 43210)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const hasPlus = val.startsWith("+");
    const raw = val.replace(/\D/g, "");
    let digits = raw;
    if (digits.startsWith("91") && digits.length > 10) {
      digits = digits.slice(2);
    }
    digits = digits.slice(0, 10);
    let formatted = digits;
    if (digits.length > 5) {
      formatted = `${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    if (hasPlus) {
      formatted = `+91 ${formatted}`.trim();
    }
    setValues((prev) => ({ ...prev, phone: formatted }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // File Upload Handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit. Please choose a smaller file.");
      setSelectedFile(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Supported formats: JPG, PNG, WEBP, HEIC, or PDF.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Client-Side Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.fullName.trim() || values.fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim() || !emailRegex.test(values.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    const rawPhoneDigits = values.phone.replace(/\D/g, "");
    if (rawPhoneDigits.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit telephone number.";
    }

    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!values.zipCode.trim() || !pinRegex.test(values.zipCode.trim())) {
      newErrors.zipCode = "Please enter a valid 6-digit Indian PIN code.";
    }

    if (!values.propertyType) {
      newErrors.propertyType = "Please select your property type.";
    }

    if (!values.fenceType) {
      newErrors.fenceType = "Please select your preferred fencing material.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        formData.append(key, val);
      });

      if (selectedFile) {
        formData.append("projectFile", selectedFile);
      }

      const res = await fetch("/api/inquiry", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setServerError(
            data.message || "Unable to submit your request at this time. Please try again."
          );
        }
        setIsSubmitting(false);
        return;
      }

      // Successful server response
      setSubmitSuccess({
        leadId: data.leadId,
        fullName: values.fullName,
        fenceType: values.fenceType,
        zipCode: values.zipCode,
      });
      setIsSubmitting(false);
    } catch (err) {
      console.error("Submission failed:", err);
      setServerError("Network error: Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitSuccess(null);
    setServerError(null);
    setErrors({});
    setSelectedFile(null);
    setValues({
      fullName: "",
      email: "",
      phone: "",
      zipCode: "",
      preferredContactMethod: "Phone Call",
      propertyType: "Residential Single-Family",
      fenceType: "Wood Privacy (Western Red Cedar / Pine)",
      fenceLength: "",
      fenceHeight: "6 Feet (Standard Residential Privacy)",
      gatesCount: "1 Single Walk Gate (4 ft)",
      timeline: "Immediately (1–2 Weeks)",
      description: "",
      website_hp: "",
    });
  };

  return (
    <section
      id="inquiry-form"
      ref={sectionRef}
      aria-label="Request a Fencing Estimate"
      className="relative z-20 w-full bg-[#070b08] text-white py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-neutral-800/80 overflow-hidden"
    >
      {/* Background Decorative Radial Lighting */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-[#16271c]/40 to-transparent blur-3xl pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-10 w-[550px] h-[350px] bg-[#f95721]/5 blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-5xl mx-auto">
        {/* SECTION HEADER */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16271c] border border-[#27402f] text-xs font-mono font-medium tracking-wider text-neutral-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#f95721] animate-pulse" />
            <span>FREE ON-SITE ESTIMATE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight text-white mb-6">
            <span>Tell Us About Your </span>
            <span className="text-[#f95721] italic">Fencing Project</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-neutral-400 font-light leading-relaxed max-w-2xl mx-auto">
            Provide a few project details and our team will review your property boundaries, verify
            local setback guidelines, and deliver a transparent, itemized proposal within 24 business
            hours.
          </p>
        </div>

        {/* MAIN FORM CONTAINER OR SUCCESS CONFIRMATION */}
        <div
          ref={formCardRef}
          className="relative rounded-3xl bg-[#0c120e]/95 border border-[#1f2e22] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 sm:p-10 md:p-12 backdrop-blur-md"
        >
          {submitSuccess ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="text-center py-8 sm:py-12 max-w-xl mx-auto animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#16271c] border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-normal text-white mb-3">
                Estimate Request Received!
              </h3>

              <div className="inline-block px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-[#f95721] mb-6">
                Reference ID: {submitSuccess.leadId}
              </div>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8">
                Thank you, <span className="text-white font-medium">{submitSuccess.fullName}</span>!
                Our estimating team is reviewing your project details for{" "}
                <span className="text-[#f95721] font-medium">{submitSuccess.fenceType}</span> in PIN{" "}
                <span className="text-white font-medium">{submitSuccess.zipCode}</span>. A dedicated
                project lead will follow up via your preferred contact method with an itemized
                breakdown.
              </p>

              <div className="p-4 rounded-xl bg-black/40 border border-neutral-800 text-left text-xs text-neutral-400 space-y-2 mb-8">
                <div className="flex items-center gap-2 text-neutral-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Next Steps in Our Process:</span>
                </div>
                <p>1. Property boundary &amp; municipal setback review</p>
                <p>2. Running-footage and gate hardware itemization</p>
                <p>3. Direct follow-up with no obligation or high-pressure sales</p>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-[#16271c] hover:bg-[#1f3727] border border-[#27402f] text-white text-xs sm:text-sm font-medium transition-all shadow-md hover:shadow-lg"
              >
                Submit Another Estimate Request
              </button>
            </div>
          ) : (
            /* CONVERSION-FOCUSED INQUIRY FORM */
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* Top Server Error Alert if failed */}
              {serverError && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs sm:text-sm flex items-start gap-3 shadow-md"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white mb-0.5">Submission Error</p>
                    <p className="text-red-300">{serverError}</p>
                  </div>
                </div>
              )}

              {/* SECTION 1: CONTACT INFORMATION */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4 pb-2 border-b border-neutral-800">
                  <User className="w-4 h-4 text-[#f95721]" />
                  <span>1. Contact Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Full Name <span className="text-[#f95721]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        autoComplete="name"
                        value={values.fullName}
                        onChange={handleInputChange}
                        aria-invalid={!!errors.fullName}
                        aria-describedby={errors.fullName ? "fullName-error" : undefined}
                        placeholder="Aarav Mehta"
                        className={`w-full px-4 py-2.5 rounded-xl bg-black/60 border ${
                          errors.fullName ? "border-red-500 focus:ring-red-500" : "border-neutral-800 focus:border-[#27402f] focus:ring-[#f95721]"
                        } text-white text-base sm:text-sm placeholder-neutral-500 outline-none focus:ring-2 transition-all min-h-[44px]`}
                      />
                    </div>
                    {errors.fullName && (
                      <p id="fullName-error" className="mt-1 text-xs text-red-400">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Email Address <span className="text-[#f95721]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={values.email}
                        onChange={handleInputChange}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        placeholder="aarav@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl bg-black/60 border ${
                          errors.email ? "border-red-500 focus:ring-red-500" : "border-neutral-800 focus:border-[#27402f] focus:ring-[#f95721]"
                        } text-white text-base sm:text-sm placeholder-neutral-500 outline-none focus:ring-2 transition-all min-h-[44px]`}
                      />
                    </div>
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-xs text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Phone Number <span className="text-[#f95721]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        value={values.phone}
                        onChange={handlePhoneChange}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        placeholder="+91 98765 43210"
                        className={`w-full px-4 py-2.5 rounded-xl bg-black/60 border ${
                          errors.phone ? "border-red-500 focus:ring-red-500" : "border-neutral-800 focus:border-[#27402f] focus:ring-[#f95721]"
                        } text-white text-base sm:text-sm placeholder-neutral-500 outline-none focus:ring-2 transition-all min-h-[44px]`}
                      />
                    </div>
                    {errors.phone && (
                      <p id="phone-error" className="mt-1 text-xs text-red-400">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: PROPERTY & LOCATION */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4 pb-2 border-b border-neutral-800">
                  <Home className="w-4 h-4 text-[#f95721]" />
                  <span>2. Property &amp; Location</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Property PIN Code */}
                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Property PIN Code <span className="text-[#f95721]">*</span>
                    </label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      required
                      autoComplete="postal-code"
                      maxLength={6}
                      value={values.zipCode}
                      onChange={handleInputChange}
                      aria-invalid={!!errors.zipCode}
                      aria-describedby={errors.zipCode ? "zipCode-error" : undefined}
                      placeholder="e.g. 560001"
                      className={`w-full px-4 py-2.5 rounded-xl bg-black/60 border ${
                        errors.zipCode ? "border-red-500 focus:ring-red-500" : "border-neutral-800 focus:border-[#27402f] focus:ring-[#f95721]"
                      } text-white text-base sm:text-sm placeholder-neutral-500 outline-none focus:ring-2 transition-all min-h-[44px]`}
                    />
                    {errors.zipCode && (
                      <p id="zipCode-error" className="mt-1 text-xs text-red-400">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>

                  {/* Property Type */}
                  <div>
                    <label
                      htmlFor="propertyType"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Property Type <span className="text-[#f95721]">*</span>
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={values.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-neutral-800 text-white text-base sm:text-sm outline-none focus:ring-2 focus:ring-[#f95721] focus:border-[#27402f] transition-all cursor-pointer min-h-[44px]"
                    >
                      {inquiryOptions.propertyTypes.map((pt) => (
                        <option key={pt} value={pt} className="bg-neutral-900 text-white">
                          {pt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label
                      htmlFor="preferredContactMethod"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Preferred Contact Method
                    </label>
                    <select
                      id="preferredContactMethod"
                      name="preferredContactMethod"
                      value={values.preferredContactMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-neutral-800 text-white text-base sm:text-sm outline-none focus:ring-2 focus:ring-[#f95721] focus:border-[#27402f] transition-all cursor-pointer min-h-[44px]"
                    >
                      {inquiryOptions.contactMethods.map((cm) => (
                        <option key={cm} value={cm} className="bg-neutral-900 text-white">
                          {cm}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: FENCE SPECIFICATIONS */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4 pb-2 border-b border-neutral-800">
                  <Layers className="w-4 h-4 text-[#f95721]" />
                  <span>3. Fencing Specifications</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Preferred Fencing Type */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="fenceType"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Preferred Fencing Material <span className="text-[#f95721]">*</span>
                    </label>
                    <select
                      id="fenceType"
                      name="fenceType"
                      value={values.fenceType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-neutral-800 text-white text-base sm:text-sm outline-none focus:ring-2 focus:ring-[#f95721] focus:border-[#27402f] transition-all cursor-pointer min-h-[44px]"
                    >
                      {inquiryOptions.fenceTypes.map((ft) => (
                        <option key={ft.id} value={ft.label} className="bg-neutral-900 text-white">
                          {ft.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Approximate Fence Length */}
                  <div>
                    <label
                      htmlFor="fenceLength"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Approx. Length (Running Ft / Rft)
                    </label>
                    <input
                      id="fenceLength"
                      name="fenceLength"
                      type="text"
                      value={values.fenceLength}
                      onChange={handleInputChange}
                      placeholder="e.g. 150 Rft"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-neutral-800 text-white text-base sm:text-sm placeholder-neutral-500 outline-none focus:ring-2 focus:ring-[#f95721] focus:border-[#27402f] transition-all min-h-[44px]"
                    />
                  </div>

                  {/* Desired Fence Height */}
                  <div>
                    <label
                      htmlFor="fenceHeight"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Desired Fence Height
                    </label>
                    <select
                      id="fenceHeight"
                      name="fenceHeight"
                      value={values.fenceHeight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-neutral-800 text-white text-base sm:text-sm outline-none focus:ring-2 focus:ring-[#f95721] focus:border-[#27402f] transition-all cursor-pointer min-h-[44px]"
                    >
                      {inquiryOptions.fenceHeights.map((fh) => (
                        <option key={fh} value={fh} className="bg-neutral-900 text-white">
                          {fh}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Number of Gates */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="gatesCount"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Gates Needed
                    </label>
                    <select
                      id="gatesCount"
                      name="gatesCount"
                      value={values.gatesCount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-neutral-800 text-white text-base sm:text-sm outline-none focus:ring-2 focus:ring-[#f95721] focus:border-[#27402f] transition-all cursor-pointer min-h-[44px]"
                    >
                      {inquiryOptions.gateOptions.map((go) => (
                        <option key={go} value={go} className="bg-neutral-900 text-white">
                          {go}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project Timeline */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="timeline"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Project Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={values.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-neutral-800 text-white text-base sm:text-sm outline-none focus:ring-2 focus:ring-[#f95721] focus:border-[#27402f] transition-all cursor-pointer min-h-[44px]"
                    >
                      {inquiryOptions.timelines.map((tl) => (
                        <option key={tl} value={tl} className="bg-neutral-900 text-white">
                          {tl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4: PROJECT DESCRIPTION & OPTIONAL FILE UPLOAD */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4 pb-2 border-b border-neutral-800">
                  <FileText className="w-4 h-4 text-[#f95721]" />
                  <span>4. Project Notes &amp; Attachments</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Project Description Textarea */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Project Description &amp; Site Notes (Optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={values.description}
                      onChange={handleInputChange}
                      placeholder="Mention any existing boundary wall tear-out, slopes, pool safety, or specific RWA architectural guidelines..."
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neutral-800 text-white text-base sm:text-sm placeholder-neutral-500 outline-none focus:ring-2 focus:ring-[#f95721] focus:border-[#27402f] transition-all resize-none"
                    />
                  </div>

                  {/* Optional File Upload Field */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Property Survey / Backyard Photo (Optional, Max 5MB)
                    </label>
                    <div className="relative border-2 border-dashed border-neutral-800 hover:border-[#27402f] rounded-xl p-4 text-center transition-colors bg-black/40 flex flex-col items-center justify-center min-h-[120px]">
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="projectFile"
                        name="projectFile"
                        accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />

                      {selectedFile ? (
                        <div className="flex items-center gap-3 bg-[#16271c] border border-[#27402f] px-4 py-2 rounded-lg text-left w-full justify-between">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-[#f95721] shrink-0" />
                            <span className="text-xs text-white truncate max-w-[180px]">
                              {selectedFile.name}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              ({(selectedFile.size / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile();
                            }}
                            className="p-1 rounded-full hover:bg-black/50 text-neutral-400 hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center pointer-events-none">
                          <UploadCloud className="w-7 h-7 text-neutral-500 mb-1.5" />
                          <p className="text-xs text-neutral-300 font-medium">
                            Click or drag file here to attach
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5">
                            JPG, PNG, WEBP, or PDF
                          </p>
                        </div>
                      )}
                    </div>
                    {fileError && <p className="mt-1 text-xs text-red-400">{fileError}</p>}
                  </div>
                </div>
              </div>

              {/* HONEYPOT ANTI-SPAM (Hidden from sighted users and screen readers) */}
              <div aria-hidden="true" className="hidden">
                <label htmlFor="website_hp">Leave this field blank</label>
                <input
                  type="text"
                  id="website_hp"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website_hp}
                  onChange={handleInputChange}
                />
              </div>

              {/* PRIVACY POLICY NOTE */}
              <div className="flex items-start gap-2.5 pt-2 text-xs text-neutral-400">
                <Lock className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-neutral-300">Privacy Notice:</strong> Your information is
                  used strictly to prepare your fencing estimate and coordinate your project. We
                  respect your privacy and never sell or share customer contact details with third
                  parties.
                </p>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Licensed &amp; Certified · Pan-India Standards</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto pl-8 pr-2.5 py-3 rounded-full bg-[#16271c] hover:bg-[#1f3727] border border-[#27402f] hover:border-[#385b42] text-white text-sm sm:text-base font-medium transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-4 group ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="tracking-wide">
                    {isSubmitting ? "Submitting Your Estimate Request..." : "Request My Free Estimate"}
                  </span>
                  <span className="w-10 h-10 rounded-full bg-[#f95721] group-hover:bg-[#ff6834] flex items-center justify-center text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 shadow-md shrink-0">
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

