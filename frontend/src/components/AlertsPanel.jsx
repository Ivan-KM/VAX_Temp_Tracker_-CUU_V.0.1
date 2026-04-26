import React, { useEffect, useState } from "react";
import { getAlerts } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await getAlerts();
      setAlerts(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load alerts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAlerts} />;

  return (
    <div className="space-y-3">
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No alerts detected
        </div>
      ) : (
        alerts.slice(0, 10).map((alert) => (
          <div
            key={alert.id}
            className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg animate-slide-up"
          >
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Device: {alert.device_id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Temperature: {alert.temperature}°C
                </p>
                {alert.message && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {alert.message}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
      {alerts.length > 10 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Showing 10 of {alerts.length} alerts
        </p>
      )}
    </div>
  );
};

export default AlertsPanel;