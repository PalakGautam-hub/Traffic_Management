"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import StatCard from "@/components/StatCard";
import { getAnalyticsSummary, getTrafficLogs, getJunctionStats } from "@/lib/api";

interface Summary {
  totalLogs: number;
  totalViolations: number;
  totalJunctions: number;
  densityDistribution: { Low: number; Medium: number; High: number };
}

interface TrafficLog {
  id: string;
  junction_id: string;
  timestamp: string;
  cars: number;
  bikes: number;
  buses: number;
  trucks: number;
  total: number;
  density: string;
  green_time: number;
  junctions?: { name: string; location: string };
}

interface JunctionStat {
  id: string;
  name: string;
  location: string;
  logCount: number;
  violationCount: number;
  latestDensity: string;
  latestGreenTime: number;
  latestTotal: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [logs, setLogs] = useState<TrafficLog[]>([]);
  const [junctions, setJunctions] = useState<JunctionStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, logsRes, junctionRes] = await Promise.all([
          getAnalyticsSummary(),
          getTrafficLogs(10),
          getJunctionStats(),
        ]);
        setSummary(summaryRes.data);
        setLogs(logsRes.data);
        setJunctions(junctionRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const densityBadge = (d: string) => {
    if (d === "Low") return "badge badge-low";
    if (d === "Medium") return "badge badge-medium";
    return "badge badge-high";
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto">
        {/* Page Header */}
        <div className="animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <p className="text-steel-500 text-xs font-semibold uppercase tracking-widest mb-1">Overview</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-steel-400">
              <div className="pulse-dot bg-emerald-400" />
              <span>Real-time monitoring</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="spinner" />
              <p className="text-steel-400 text-sm">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Bento Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <StatCard
                title="Total Traffic Logs"
                value={summary?.totalLogs || 0}
                color="blue"
                subtitle="All monitored sessions"
              />
              <StatCard
                title="Total Violations"
                value={summary?.totalViolations || 0}
                color="red"
                subtitle="Red-light infractions"
              />
              <StatCard
                title="Active Junctions"
                value={summary?.totalJunctions || 0}
                color="green"
                subtitle="Currently monitored"
              />
              <StatCard
                title="High Density Events"
                value={summary?.densityDistribution.High || 0}
                color="yellow"
                subtitle="Congestion alerts"
              />
            </div>

            {/* Junction Status - Bento Cards */}
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="glass-card p-5 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-white">Junction Status</h2>
                    <p className="text-steel-500 text-xs mt-0.5">Live monitoring across all intersections</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 text-xs text-steel-500">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>Low</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Medium</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400"></span>High</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {junctions.map((j, index) => (
                    <div
                      key={j.id}
                      className="glass-card-light p-4 rounded-xl hover:bg-white/[0.08] transition-all group animate-fade-in"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white text-sm">{j.name}</h3>
                          <p className="text-xs text-steel-500 mt-0.5">{j.location}</p>
                        </div>
                        <span className={densityBadge(j.latestDensity)}>
                          {j.latestDensity}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-steel-400">Vehicles</span>
                          <span className="font-semibold text-white">{j.latestTotal}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-steel-400">Green Time</span>
                          <span className="font-medium text-emerald-400">{j.latestGreenTime}s</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-steel-400">Violations</span>
                          <span className="font-medium text-red-400">{j.violationCount}</span>
                        </div>
                      </div>
                      {/* Progress bar (density visualization) */}
                      <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            j.latestDensity === "Low"
                              ? "bg-emerald-500 w-1/3"
                              : j.latestDensity === "Medium"
                              ? "bg-amber-500 w-2/3"
                              : "bg-red-500 w-full"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                  {junctions.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-steel-500">
                      <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="text-sm">No junctions configured yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Traffic Logs */}
            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="glass-card p-5 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-white">Recent Traffic Logs</h2>
                    <p className="text-steel-500 text-xs mt-0.5">Latest vehicle detection records</p>
                  </div>
                  <span className="text-xs font-medium text-steel-500 bg-white/5 px-3 py-1.5 rounded-lg">
                    Last {logs.length} entries
                  </span>
                </div>

                <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
                  <table className="table-glass">
                    <thead>
                      <tr>
                        <th>Junction</th>
                        <th className="hidden sm:table-cell">Cars</th>
                        <th className="hidden sm:table-cell">Bikes</th>
                        <th className="hidden md:table-cell">Buses</th>
                        <th className="hidden md:table-cell">Trucks</th>
                        <th>Total</th>
                        <th>Density</th>
                        <th className="hidden lg:table-cell">Green Time</th>
                        <th className="hidden sm:table-cell">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td className="font-medium text-white">
                            {log.junctions?.name || "—"}
                          </td>
                          <td className="hidden sm:table-cell">{log.cars}</td>
                          <td className="hidden sm:table-cell">{log.bikes}</td>
                          <td className="hidden md:table-cell">{log.buses}</td>
                          <td className="hidden md:table-cell">{log.trucks}</td>
                          <td className="font-semibold text-white">{log.total}</td>
                          <td>
                            <span className={densityBadge(log.density)}>
                              {log.density}
                            </span>
                          </td>
                          <td className="hidden lg:table-cell text-emerald-400">{log.green_time}s</td>
                          <td className="hidden sm:table-cell text-steel-500 text-xs">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {logs.length === 0 && (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-steel-500">
                            <div className="flex flex-col items-center gap-2">
                              <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              <p className="text-sm">No traffic logs yet</p>
                              <p className="text-xs text-steel-600">Start the ML service to begin monitoring</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedLayout>
  );
}
