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

  const vehicleTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      car: "text-blue-700 bg-blue-100",
      bike: "text-orange-700 bg-orange-100",
      bus: "text-red-700 bg-red-100",
      truck: "text-purple-700 bg-purple-100",
    };
    return colors[type] || "text-gray-700 bg-gray-100";
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Violation Records</h1>
          <p className="text-gray-500 mt-1">Red-light violations detected by the system</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">Junction</th>
                    <th className="pb-3 pr-4">Vehicle Type</th>
                    <th className="pb-3 pr-4">Timestamp</th>
                    <th className="pb-3">Snapshot</th>
                  </tr>
                </thead>
                <tbody>
                  {violations.map((v, i) => (
                    <tr key={v.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                      <td className="py-3 pr-4 font-medium text-gray-900">
                        {v.junctions?.name || "—"}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${vehicleTypeColor(v.vehicle_type)}`}>
                          {v.vehicle_type}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {new Date(v.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3">
                        {v.image_url ? (
                          <a
                            href={v.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {violations.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        No violations recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
