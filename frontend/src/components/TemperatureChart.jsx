import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getTemperatureTrend } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TemperatureChart = ({ deviceId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!deviceId) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [deviceId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getTemperatureTrend(deviceId);
      setData(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      setError("Failed to load temperature data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!deviceId) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-dark-card rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">
          Select a device to view temperature chart
        </p>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-dark-card rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">No temperature data available</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperature (°C)",
        data: data.map((d) => d.temperature),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        grid: {
          color: document.documentElement.classList.contains("dark") ? "#334155" : "#e2e8f0",
        },
        ticks: {
          color: document.documentElement.classList.contains("dark") ? "#94a3b8" : "#64748b",
        },
        title: {
          display: true,
          text: "Time",
          color: document.documentElement.classList.contains("dark") ? "#cbd5e1" : "#334155",
        },
      },
      y: {
        grid: {
          color: document.documentElement.classList.contains("dark") ? "#334155" : "#e2e8f0",
        },
        ticks: {
          color: document.documentElement.classList.contains("dark") ? "#94a3b8" : "#64748b",
        },
        title: {
          display: true,
          text: "Temperature (°C)",
          color: document.documentElement.classList.contains("dark") ? "#cbd5e1" : "#334155",
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="w-full h-96">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TemperatureChart;