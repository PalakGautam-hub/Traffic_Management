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

  const densityColor = (d: string) => {
    if (d === "Low") return "text-green-600 bg-green-100";
    if (d === "Medium") return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time traffic monitoring overview</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Traffic Logs" value={summary?.totalLogs || 0} color="blue" />
              <StatCard title="Total Violations" value={summary?.totalViolations || 0} color="red" />
              <StatCard title="Active Junctions" value={summary?.totalJunctions || 0} color="green" />
              <StatCard
                title="High Density Events"
                value={summary?.densityDistribution.High || 0}
                color="yellow"
              />
            </div>

            {/* Junction Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Junction Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {junctions.map((j) => (
                  <div key={j.id} className="border rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold text-gray-900">{j.name}</h3>
                    <p className="text-sm text-gray-500">{j.location}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${densityColor(j.latestDensity)}`}>
                        {j.latestDensity}
                      </span>
                      <span className="text-sm text-gray-600">
                        {j.latestTotal} vehicles
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Green Time: <span className="font-medium text-gray-700">{j.latestGreenTime}s</span>
                      {" | "}Violations: <span className="font-medium text-red-600">{j.violationCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Traffic Logs */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Traffic Logs</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-3 pr-4">Junction</th>
                      <th className="pb-3 pr-4">Cars</th>
                      <th className="pb-3 pr-4">Bikes</th>
                      <th className="pb-3 pr-4">Buses</th>
                      <th className="pb-3 pr-4">Trucks</th>
                      <th className="pb-3 pr-4">Total</th>
                      <th className="pb-3 pr-4">Density</th>
                      <th className="pb-3 pr-4">Green Time</th>
                      <th className="pb-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 pr-4 font-medium text-gray-900">
                          {log.junctions?.name || "—"}
                        </td>
                        <td className="py-3 pr-4 text-gray-700">{log.cars}</td>
                        <td className="py-3 pr-4 text-gray-700">{log.bikes}</td>
                        <td className="py-3 pr-4 text-gray-700">{log.buses}</td>
                        <td className="py-3 pr-4 text-gray-700">{log.trucks}</td>
                        <td className="py-3 pr-4 font-medium text-gray-900">{log.total}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${densityColor(log.density)}`}>
                            {log.density}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gray-700">{log.green_time}s</td>
                        <td className="py-3 text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-gray-400">
                          No traffic logs yet. Start the ML service to begin monitoring.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedLayout>
  );
}
