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

const COLORS = ["#6A9BB4", "#f59e0b", "#ef4444", "#a78bfa"];
const DENSITY_COLORS = ["#34d399", "#fbbf24", "#f87171"];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-900/95 backdrop-blur-xl border border-steel-800/40 rounded-xl p-3 shadow-glass">
        <p className="text-steel-400 text-xs font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-steel-300 capitalize">{entry.name}:</span>
            <span className="text-white font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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

  return (
    <ProtectedLayout>
      <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto">
        {/* Page Header */}
        <div className="animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <p className="text-steel-500 text-xs font-semibold uppercase tracking-widest mb-1">Insights</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Analytics</h1>
            </div>
            <p className="text-steel-400 text-sm">Traffic trends & vehicle distribution</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="spinner" />
              <p className="text-steel-400 text-sm">Crunching the numbers...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <StatCard title="Total Logs" value={summary?.totalLogs || 0} color="blue" />
              <StatCard title="Total Violations" value={summary?.totalViolations || 0} color="red" />
              <StatCard
                title="Vehicles Tracked"
                value={
                  distribution
                    ? distribution.cars + distribution.bikes + distribution.buses + distribution.trucks
                    : 0
                }
                color="green"
              />
              <StatCard title="Junctions" value={summary?.totalJunctions || 0} color="purple" />
            </div>

            {/* Traffic Trends Chart - Wide Bento */}
            <div className="glass-card p-5 md:p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Traffic Trends</h2>
                  <p className="text-steel-500 text-xs mt-0.5">Vehicle count over time</p>
                </div>
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  {[
                    { name: "Cars", color: "#6A9BB4" },
                    { name: "Bikes", color: "#f59e0b" },
                    { name: "Buses", color: "#ef4444" },
                    { name: "Trucks", color: "#a78bfa" },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs text-steel-400">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
              {trends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trends}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(106,155,180,0.08)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      fontSize={11}
                      tick={{ fill: 'rgba(165,195,210,0.5)' }}
                      axisLine={{ stroke: 'rgba(106,155,180,0.1)' }}
                      tickLine={false}
                    />
                    <YAxis
                      fontSize={11}
                      tick={{ fill: 'rgba(165,195,210,0.5)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="cars" stroke="#6A9BB4" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="bikes" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="buses" stroke="#ef4444" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="trucks" stroke="#a78bfa" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-steel-500">
                  <svg className="w-12 h-12 opacity-20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  <p className="text-sm">No trend data available yet</p>
                </div>
              )}
            </div>

            {/* Charts Row - Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
              {/* Vehicle Distribution */}
              <div className="glass-card p-5 md:p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-white">Vehicle Distribution</h2>
                  <p className="text-steel-500 text-xs mt-0.5">Breakdown by vehicle type</p>
                </div>
                {pieData.some((d) => d.value > 0) ? (
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Custom legend */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                      {pieData.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[i] }} />
                          <span className="text-xs text-steel-400">{item.name}</span>
                          <span className="text-xs font-bold text-white ml-auto">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-steel-500">
                    <p className="text-sm">No data available</p>
                  </div>
                )}
              </div>

              {/* Density Distribution */}
              <div className="glass-card p-5 md:p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-white">Density Distribution</h2>
                  <p className="text-steel-500 text-xs mt-0.5">Traffic congestion levels</p>
                </div>
                {densityPieData.some((d) => d.value > 0) ? (
                  <div>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={densityPieData} barSize={48}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(106,155,180,0.08)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          fontSize={12}
                          tick={{ fill: 'rgba(165,195,210,0.5)' }}
                          axisLine={{ stroke: 'rgba(106,155,180,0.1)' }}
                          tickLine={false}
                        />
                        <YAxis
                          fontSize={11}
                          tick={{ fill: 'rgba(165,195,210,0.5)' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {densityPieData.map((_, i) => (
                            <Cell key={i} fill={DENSITY_COLORS[i]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    {/* Density Legend */}
                    <div className="flex items-center justify-center gap-6 mt-4">
                      {densityPieData.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded" style={{ backgroundColor: DENSITY_COLORS[i] }} />
                          <span className="text-xs text-steel-400">{item.name}</span>
                          <span className="text-xs font-bold text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-steel-500">
                    <p className="text-sm">No data available</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedLayout>
  );
}
