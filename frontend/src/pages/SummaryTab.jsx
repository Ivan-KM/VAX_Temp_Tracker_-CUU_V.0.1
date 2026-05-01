import React, { useEffect, useState } from "react";
import { getSummary, getDevices, getLatestTemperature } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

import BarChartIcon from '@mui/icons-material/BarChart';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DevicesIcon from '@mui/icons-material/Devices';



const SummaryTab = () => {
  const [summary, setSummary] = useState(null);
  const [devices, setDevices] = useState([]);
  const [latestTemps, setLatestTemps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [summaryRes, devicesRes, latestRes] = await Promise.all([
        getSummary(),
        getDevices(),
        getLatestTemperature(),
      ]);
      setSummary(summaryRes.data);
      setDevices(devicesRes.data);
      setLatestTemps(latestRes.data);
      setError(null);
    } catch (err) {
      setError("Failed to load dashboard summary");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAllData} />;

  const statsCards = [
    { title: "Total Readings", value: summary?.total_readings || 0, icon: <BarChartIcon />, color: "blue" },
    { title: "Average Temperature", value: summary?.average_temperature ? `${summary.average_temperature}°C` : "N/A", icon: <ThermostatIcon />, color: "green" },
    { title: "Latest Reading", value: summary?.latest_temperature ? `${summary.latest_temperature}°C` : "N/A", icon: <ScheduleIcon />, color: "purple" },
    { title: "Active Devices", value: devices.length, icon: <DevicesIcon />, color: "orange" },
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${getColorClasses(stat.color)} rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Devices List */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Registered Devices
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-light-border dark:border-dark-border">
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Device ID</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Name</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Latest Temp</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => {
                const latestTemp = latestTemps.find(
                  (lt) => lt.device_id === device.device_id
                );
                const temp = latestTemp?.temperature;
                const isNormal = temp && temp >= 2 && temp <= 8;
                return (
                  <tr
                    key={device.device_id}
                    className="border-b border-light-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-mono text-sm">
                      {device.device_id}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {device.name || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {temp ? `${temp}°C` : "—"}
                    </td>
                    <td className="py-3 px-4">
                      {temp ? (
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isNormal
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                        >
                          {isNormal ? "✓ Normal" : "⚠ Alert"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                          No Data
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchAllData}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default SummaryTab;