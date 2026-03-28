"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

const navLinks = [
  { label: "Solutions", href: "#features" },
  { label: "Platform", href: "#stats" },
  { label: "Analytics", href: "#features" },
  { label: "About", href: "#about" },
];

const stats = [
  { value: "112+", label: "Junctions Monitored" },
  { value: "<2s", label: "Detection Latency" },
  { value: "4", label: "Vehicle Classes" },
  { value: "99.97%", label: "System Uptime" },
];

const features = [
  {
    category: "Detection",
    title: "Vehicle Detection",
    description: "YOLOv8-powered detection of cars, bikes, buses, and trucks with real-time bounding box tracking.",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    span: "col-span-1 row-span-2",
  },
  {
    category: "ML Model",
    title: "Density Classification",
    description: "ML-driven traffic density classification as Low, Medium, or High using vehicle count analysis.",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
    span: "col-span-1",
  },
  {
    category: "Analytics",
    title: "Live Analytics",
    description: "Real-time dashboards with vehicle counts, density trends, and junction performance metrics.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    span: "col-span-1",
  },
  {
    category: "Enforcement",
    title: "Violation Detection",
    description: "Automatic red-light violation capture using stop-line logic with timestamped evidence.",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
    span: "col-span-1",
  },
  {
    category: "Optimization",
    title: "Signal Optimization",
    description: "Adaptive green signal timing recommendations based on real-time traffic density analysis.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    span: "col-span-1",
  },
  {
    category: "Control",
    title: "Multi-Junction Control",
    description: "Centralized monitoring and management across all junctions with unified dashboard.",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    span: "col-span-1",
  },
];

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 text-steel-200 overflow-x-hidden">
      {/* ═══════════════════ NAVIGATION ═══════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy-950/90 backdrop-blur-xl border-b border-steel-800/30 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-steel-500 to-steel-700 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">SmartTraffic</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-steel-400 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-steel-300 hover:text-white transition-colors font-medium px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold bg-gradient-to-r from-steel-600 to-steel-500 text-white px-5 py-2.5 rounded-xl hover:shadow-glow transition-all hover:-translate-y-0.5"
            >
              Get Demo
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-steel-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-navy-900/95 backdrop-blur-xl border-t border-steel-800/30 mt-2 animate-slide-up">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-steel-400 hover:text-white hover:bg-steel-800/20 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-steel-800/30 mt-3 space-y-2">
                <Link href="/login" className="block px-4 py-3 text-sm text-steel-300 hover:text-white rounded-xl transition-colors">
                  Sign In
                </Link>
                <Link href="/login" className="block px-4 py-3 text-sm font-semibold text-center bg-gradient-to-r from-steel-600 to-steel-500 text-white rounded-xl">
                  Get Demo
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-steel-500/10 border border-steel-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-steel-400 tracking-wider uppercase">Computer Vision Powered</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 animate-slide-up">
              <span className="text-white">Smart Traffic </span>
              <span className="text-gradient">Enforcement</span>
              <br />
              <span className="text-gradient">& Management</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-steel-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
              AI-powered platform using YOLOv8 and computer vision to detect vehicles,
              classify traffic density, enforce violations, and optimize signal timings in real time.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link
                href="/login"
                className="btn-primary flex items-center gap-2 text-base px-8 py-4 rounded-2xl shadow-glow hover:shadow-glow-lg"
              >
                Request a Demo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 text-sm font-semibold text-steel-300 hover:text-white px-6 py-3.5 rounded-2xl border border-steel-700/50 hover:border-steel-500/50 transition-all hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Overview
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ROBOT SHOWCASE ═══════════════════ */}
      <section className="relative pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative glass-card p-6 md:p-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-steel-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Robot image */}
            <div className="relative flex-shrink-0 animate-float">
              <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden bg-gradient-to-br from-steel-800/30 to-navy-900/50 flex items-center justify-center relative">
                <img
                  src="/images/robot-mascot.png"
                  alt="SmartTraffic AI Robot"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
              {/* AI Online badge */}
              <div className="absolute -top-2 -right-2 md:top-2 md:-right-4 glass-card px-3 py-1.5 rounded-full flex items-center gap-2 animate-fade-in" style={{ animationDelay: '500ms' }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-white whitespace-nowrap">AI Online</span>
              </div>
            </div>

            {/* Info panel */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Meet Your AI Traffic Officer
              </h2>
              <p className="text-steel-400 text-sm sm:text-base leading-relaxed mb-6">
                Our AI-powered system works 24/7, monitoring intersections with computer vision
                to detect vehicles, identify violations, and optimize signal timings automatically.
                No manual intervention needed.
              </p>

              {/* Live detection badge */}
              <div className="inline-flex items-center gap-3 glass-card-light px-5 py-3 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-steel-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-steel-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Live Detection</p>
                  <p className="text-xs text-steel-500">Cars · Bikes · Buses · Trucks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section id="stats" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-steel-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES BENTO GRID ═══════════════════ */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-steel-500 text-xs font-semibold uppercase tracking-widest mb-3">Platform Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Everything You Need
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-steel-500/30 rounded-2xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass animate-slide-up ${
                  i === 0 ? "sm:row-span-2" : ""
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Category tag */}
                <div className="flex items-center gap-2 mb-4 md:mb-5">
                  <div className="w-8 h-8 rounded-lg bg-steel-500/10 group-hover:bg-steel-500/20 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-steel-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-steel-500 uppercase tracking-widest">
                    {feature.category}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-steel-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-steel-500 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover glow */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-steel-500 rounded-full opacity-0 group-hover:opacity-[0.03] blur-3xl transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ ABOUT / CTA ═══════════════════ */}
      <section id="about" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-steel-600/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                Ready to optimize your traffic?
              </h2>
              <p className="text-steel-400 text-base max-w-xl mx-auto mb-8 leading-relaxed">
                Deploy AI-powered traffic management across your city&apos;s intersections.
                Get started in minutes with our platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl text-base shadow-glow"
                >
                  Get Started Free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold text-steel-300 hover:text-white px-6 py-3.5 rounded-2xl border border-steel-700/50 hover:border-steel-500/50 transition-all"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-steel-800/30 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-steel-500 to-steel-700 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-white">SmartTraffic</span>
            </div>
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-xs text-steel-500 hover:text-steel-300 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
            <p className="text-xs text-steel-600">
              © 2025 SmartTraffic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
