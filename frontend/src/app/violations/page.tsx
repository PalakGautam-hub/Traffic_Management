"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import { getViolations } from "@/lib/api";

interface Violation {
  id: string;
  junction_id: string;
  vehicle_type: string;
  timestamp: string;
  image_url: string | null;
  junctions?: { name: string; location: string };
}

export default function ViolationsPage() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getViolations(100);
        setViolations(res.data);
      } catch (err) {
        console.error("Failed to fetch violations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const vehicleTypeConfig: Record<string, { color: string; icon: string }> = {
    car: {
      color: "text-steel-400 bg-steel-500/10 border border-steel-500/20",
      icon: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
    },
    bike: {
      color: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
    bus: {
      color: "text-red-400 bg-red-500/10 border border-red-500/20",
      icon: "M8 7h12m0 0L16 3m4 4l-4 4m-8 5H4m0 0l4-4m-4 4l4 4",
    },
    truck: {
      color: "text-purple-400 bg-purple-500/10 border border-purple-500/20",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    },
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto">
        {/* Page Header */}
        <div className="animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <p className="text-steel-500 text-xs font-semibold uppercase tracking-widest mb-1">Enforcement</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Violation Records</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-high">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                </svg>
                {violations.length} violations
              </span>
            </div>
          </div>
          <p className="text-steel-400 text-sm mt-2">Red-light violations detected by the AI system</p>
        </div>

        {/* Violations Table */}
        <div className="glass-card p-5 md:p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="spinner" />
                <p className="text-steel-400 text-sm">Loading violations...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile card view */}
              <div className="sm:hidden space-y-3">
                {violations.map((v, i) => (
                  <div
                    key={v.id}
                    className="glass-card-light p-4 rounded-xl animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white text-sm">{v.junctions?.name || "—"}</p>
                        <p className="text-xs text-steel-500 mt-0.5">
                          {new Date(v.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className={`badge text-xs capitalize ${
                        vehicleTypeConfig[v.vehicle_type]?.color || "text-steel-400 bg-steel-500/10"
                      }`}>
                        {v.vehicle_type}
                      </span>
                    </div>
                    {v.image_url && (
                      <a
                        href={v.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-steel-400 hover:text-steel-300 flex items-center gap-1 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Snapshot
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop table view */}
              <div className="hidden sm:block overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
                <table className="table-glass">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Junction</th>
                      <th>Vehicle Type</th>
                      <th>Timestamp</th>
                      <th>Snapshot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {violations.map((v, i) => (
                      <tr key={v.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                        <td className="text-steel-500 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                        <td className="font-medium text-white">
                          <div>
                            <p>{v.junctions?.name || "—"}</p>
                            {v.junctions?.location && (
                              <p className="text-xs text-steel-500 mt-0.5">{v.junctions.location}</p>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge text-xs capitalize ${
                            vehicleTypeConfig[v.vehicle_type]?.color || "text-steel-400 bg-steel-500/10"
                          }`}>
                            {v.vehicle_type}
                          </span>
                        </td>
                        <td className="text-steel-400 text-xs">
                          <div>
                            <p>{new Date(v.timestamp).toLocaleDateString()}</p>
                            <p className="text-steel-500">{new Date(v.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </td>
                        <td>
                          {v.image_url ? (
                            <a
                              href={v.image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-steel-400 hover:text-white text-xs font-medium bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </a>
                          ) : (
                            <span className="text-steel-600 text-xs">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {violations.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-3 text-steel-500">
                            <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm font-medium">No violations recorded</p>
                            <p className="text-xs text-steel-600">The system is monitoring for infractions</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
