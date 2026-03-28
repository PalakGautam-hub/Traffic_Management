"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api";
import { setToken, setUser } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = isRegister
        ? await register(email, password)
        : await login(email, password);

      setToken(res.data.token);
      setUser(res.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden bg-navy-950">
      {/* ═══ Abstract flowing ribbons background (SHRUHH-style) ═══ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main flowing ribbon 1 */}
        <div
          className="absolute animate-float"
          style={{
            top: '-10%',
            right: '-5%',
            width: '800px',
            height: '800px',
            background: 'linear-gradient(135deg, rgba(90,143,163,0.25) 0%, rgba(106,155,180,0.15) 30%, rgba(74,117,137,0.2) 60%, transparent 100%)',
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
            filter: 'blur(40px)',
            transform: 'rotate(-15deg)',
          }}
        />
        {/* Flowing ribbon 2 */}
        <div
          className="absolute animate-float-delayed"
          style={{
            bottom: '-15%',
            left: '-10%',
            width: '700px',
            height: '700px',
            background: 'linear-gradient(225deg, rgba(106,155,180,0.2) 0%, rgba(90,143,163,0.12) 40%, rgba(42,65,83,0.15) 70%, transparent 100%)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            filter: 'blur(50px)',
            transform: 'rotate(20deg)',
          }}
        />
        {/* Accent ribbon 3 */}
        <div
          className="absolute"
          style={{
            top: '20%',
            left: '15%',
            width: '500px',
            height: '500px',
            background: 'linear-gradient(180deg, rgba(106,155,180,0.08) 0%, rgba(90,143,163,0.15) 50%, transparent 100%)',
            borderRadius: '50% 50% 40% 60% / 30% 60% 40% 70%',
            filter: 'blur(60px)',
            animation: 'float 14s ease-in-out infinite 1s',
          }}
        />
        {/* Sharp flowing line 1 */}
        <div
          className="absolute"
          style={{
            top: '10%',
            right: '10%',
            width: '600px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, rgba(106,155,180,0.3), transparent)',
            transform: 'rotate(-30deg)',
            filter: 'blur(1px)',
          }}
        />
        {/* Sharp flowing line 2 */}
        <div
          className="absolute"
          style={{
            bottom: '20%',
            left: '5%',
            width: '400px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(106,155,180,0.2), transparent)',
            transform: 'rotate(25deg)',
            filter: 'blur(1px)',
          }}
        />
        {/* Concentrated glow spots */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-steel-500/10 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-steel-600/8 rounded-full blur-2xl animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* ═══ Glass Login Card (SHRUHH-style) ═══ */}
      <div className="w-full max-w-sm relative z-10 animate-scale-in">
        {/* The glass card */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(10, 16, 23, 0.55)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(106, 155, 180, 0.12)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.05)',
          }}
        >
          {/* Top glow effect */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(106,155,180,0.4), transparent)',
            }}
          />

          <div className="px-8 py-10 sm:px-10 sm:py-12">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-steel-500/30 to-steel-700/30 border border-steel-500/20 flex items-center justify-center mb-4 shadow-glow">
                <svg className="w-7 h-7 text-steel-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-steel-500 uppercase tracking-[0.25em]">SmartTraffic</span>
            </div>

            {/* Welcome text */}
            <h1 className="text-2xl sm:text-[1.7rem] font-bold text-white text-center mb-8 tracking-tight">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field - SHRUHH underline style */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-steel-400/80 tracking-wider uppercase">
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent border-0 border-b border-steel-700/60 focus:border-steel-400 text-white text-sm py-3 px-1 outline-none transition-colors duration-300 placeholder:text-steel-600"
                    placeholder="admin@example.com"
                    id="login-email"
                  />
                  {/* Focus underline glow */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-steel-600 via-steel-400 to-steel-600 scale-x-0 peer-focus:scale-x-100 transition-transform origin-center" />
                </div>
              </div>

              {/* Password field - SHRUHH underline style */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-steel-400/80 tracking-wider uppercase">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border-0 border-b border-steel-700/60 focus:border-steel-400 text-white text-sm py-3 px-1 outline-none transition-colors duration-300 placeholder:text-steel-600"
                  placeholder="Enter your password"
                  id="login-password"
                />
              </div>

              {/* Forget Password */}
              <div className="text-left">
                <button type="button" className="text-xs text-steel-500 hover:text-steel-300 transition-colors">
                  Forget Password ?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs p-3 rounded-xl bg-red-500/10 border border-red-500/15 animate-slide-up">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Login Button - SHRUHH gradient style */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden rounded-2xl py-4 font-bold text-base tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                style={{
                  background: 'linear-gradient(135deg, rgba(106,155,180,0.25) 0%, rgba(90,143,163,0.4) 50%, rgba(106,155,180,0.25) 100%)',
                  border: '1px solid rgba(106,155,180,0.2)',
                  color: '#A5C3D2',
                  boxShadow: '0 4px 24px rgba(90,143,163,0.15)',
                }}
                id="login-submit"
              >
                {/* Hover glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-steel-500/0 via-steel-500/20 to-steel-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-steel-400/30 border-t-steel-400 rounded-full animate-spin" />
                      Please wait...
                    </span>
                  ) : (
                    isRegister ? "Sign Up" : "Login"
                  )}
                </span>
              </button>
            </form>

            {/* Register/Login toggle - SHRUHH style */}
            <p className="text-center text-sm text-steel-500 mt-8">
              {isRegister ? "Already have an account? " : "Are You New Member ? "}
              <button
                onClick={() => { setIsRegister(!isRegister); setError(""); }}
                className="font-bold text-white hover:text-steel-300 transition-colors"
                id="login-toggle"
              >
                {isRegister ? "Login" : "Sign UP"}
              </button>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-steel-600 hover:text-steel-400 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
