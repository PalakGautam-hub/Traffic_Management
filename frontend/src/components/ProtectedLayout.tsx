import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "./Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-navy-950">
        <div className="flex flex-col items-center gap-4 animate-scale-in">
          <div className="w-12 h-12 border-4 border-steel-800 border-t-steel-400 rounded-full animate-spin" />
          <p className="text-steel-400 text-sm font-medium tracking-widest uppercase animate-pulse">Initializing System</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-navy-950 text-white selection:bg-steel-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="orb orb-1 opacity-20" />
        <div className="orb orb-2 opacity-20" />
        <div className="orb orb-3 opacity-20" />
      </div>

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative z-10 transition-all duration-300">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-navy-900/90 backdrop-blur-xl border-b border-steel-800/40 sticky top-0 z-30 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-steel-500 to-steel-700 flex items-center justify-center shadow-glow">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight">SmartTraffic</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-steel-400 hover:text-white bg-steel-800/30 border border-steel-700/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
