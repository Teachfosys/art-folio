"use client";
import { auth } from "@/lib/firebase";
import { FileText, HardDrive } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        const res = await fetch("/api/stats", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard stats...</div>;

  const usedGB = stats ? (stats.usedBytes / (1024 * 1024 * 1024)).toFixed(4) : 0;
  const maxGB = stats ? (stats.maxBytes / (1024 * 1024 * 1024)).toFixed(2) : 2;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">Welcome to your art-folio control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Storage Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-4 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Cloudflare R2 Storage (2GB Limit)</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {usedGB} <span className="text-sm font-normal text-gray-500">/ {maxGB} GB</span>
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <HardDrive className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${stats?.usedPercentage > 90 ? 'bg-red-600' : 'bg-blue-600'}`} 
              style={{ width: `${Math.min(stats?.usedPercentage || 0, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 text-right">{stats?.usedPercentage || 0}% Used</p>
        </div>

        {/* Quick Links */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Page Content</p>
              <FileText className="w-6 h-6 text-gray-400" />
           </div>
           <h3 className="text-2xl font-bold mt-2">8 Sections</h3>
           <p className="text-xs text-green-500 mt-2">Fully dynamic</p>
        </div>
      </div>
    </div>
  );
}
