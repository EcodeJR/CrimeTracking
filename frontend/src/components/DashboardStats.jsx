import React, { useEffect, useState } from "react";
import API from "../api";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stats) return null;

  const genderData = {
    labels: stats.genderStats.map((g) => g._id || "Unknown"),
    datasets: [{
      data: stats.genderStats.map((g) => g.count),
      backgroundColor: ["#4ade80", "#60a5fa", "#f87171"],
      borderColor: ["#22c55e", "#3b82f6", "#ef4444"],
      borderWidth: 1
    }]
  };

  const stateData = {
    labels: stats.stateStats.map((s) => s._id || "Unknown"),
    datasets: [{
      label: "Criminals by State",
      data: stats.stateStats.map((s) => s.count),
      backgroundColor: "rgba(167, 139, 250, 0.8)",
      borderColor: "rgb(139, 92, 246)",
      borderWidth: 1,
      borderRadius: 5
    }]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Criminal Distribution by State'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Dashboard Metrics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <h4 className="text-lg text-gray-600">Criminals</h4>
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalCriminals}</p>
          <p className="text-sm text-gray-500 mt-2">Total recorded criminals</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <h4 className="text-lg text-gray-600">Suspects</h4>
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalSuspects}</p>
          <p className="text-sm text-gray-500 mt-2">Current suspects</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <h4 className="text-lg text-gray-600">Complainants</h4>
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalComplainants}</p>
          <p className="text-sm text-gray-500 mt-2">Total complainants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
            Criminals Gender Distribution
          </h4>
          <div className="h-48 sm:h-56 lg:h-64">
            <Pie data={genderData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
            Criminals by State
          </h4>
          <div className="h-48 sm:h-56 lg:h-64">
            <Bar data={stateData} options={{ ...barOptions, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;