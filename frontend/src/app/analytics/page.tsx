"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import StatCard from "@/components/StatCard";
import {
  getAnalyticsSummary,
  getTrafficTrends,
  getVehicleDistribution,
} from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface TrendData {
  timestamp: string;
  cars: number;
  bikes: number;
  buses: number;
  trucks: number;
  total: number;
  density: string;
}

const COLORS = ["#3b82f6", "#f97316", "#ef4444", "#8b5cf6"];

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [distribution, setDistribution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, trendsRes, distRes] = await Promise.all([
          getAnalyticsSummary(),
          getTrafficTrends(),
          getVehicleDistribution(),
        ]);
        setSummary(summaryRes.data);
        setTrends(
          trendsRes.data.map((t: TrendData) => ({
            ...t,
            time: new Date(t.timestamp).toLocaleTimeString(),
          }))
        );
        setDistribution(distRes.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pieData = distribution
    ? [
        { name: "Cars", value: distribution.cars },
        { name: "Bikes", value: distribution.bikes },
        { name: "Buses", value: distribution.buses },
        { name: "Trucks", value: distribution.trucks },
      ]
    : [];

  const densityPieData = summary
    ? [
        { name: "Low", value: summary.densityDistribution.Low },
        { name: "Medium", value: summary.densityDistribution.Medium },
        { name: "High", value: summary.densityDistribution.High },
      ]
    : [];

  const DENSITY_COLORS = ["#22c55e", "#eab308", "#ef4444"];

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Traffic trends and vehicle distribution</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Total Logs" value={summary?.totalLogs || 0} color="blue" />
              <StatCard title="Total Violations" value={summary?.totalViolations || 0} color="red" />
              <StatCard
                title="Total Vehicles Tracked"
                value={
                  distribution
                    ? distribution.cars + distribution.bikes + distribution.buses + distribution.trucks
                    : 0
                }
                color="green"
              />
              <StatCard title="Junctions" value={summary?.totalJunctions || 0} color="purple" />
            </div>

            {/* Traffic Trends Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Trends</h2>
              {trends.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cars" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="bikes" stroke="#f97316" strokeWidth={2} />
                    <Line type="monotone" dataKey="buses" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="trucks" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-center py-10">No trend data available yet.</p>
              )}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vehicle Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Distribution</h2>
                {pieData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400 text-center py-10">No data available.</p>
                )}
              </div>

              {/* Density Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Density Distribution</h2>
                {densityPieData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={densityPieData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {densityPieData.map((_, i) => (
                          <Cell key={i} fill={DENSITY_COLORS[i]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400 text-center py-10">No data available.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedLayout>
  );
}
