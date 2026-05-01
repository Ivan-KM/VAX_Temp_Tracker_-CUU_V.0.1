import React, { useState, useEffect } from "react";
import {
  getRiskForDevice,
  getFailureForDevice,
  checkAllDevices,
  getProactiveAlerts,
} from "../services/api";
import DeviceSelector from "../components/DeviceSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const RiskFailureTab = () => {
  const [selectedDevice, setSelectedDevice] = useState("");
  const [riskData, setRiskData] = useState(null);
  const [failureData, setFailureData] = useState(null);
  const [proactiveAlerts, setProactiveAlerts] = useState([]);
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [loadingFailure, setLoadingFailure] = useState(false);
  const [loadingProactive, setLoadingProactive] = useState(false);
  const [error, setError] = useState(null);

  const fetchRisk = async () => {
    if (!selectedDevice) return;
    try {
      setLoadingRisk(true);
      const res = await getRiskForDevice(selectedDevice);
      setRiskData(res.data);
    } catch (err) {
      setError("Risk assessment failed");
    } finally {
      setLoadingRisk(false);
    }
  };

  const fetchFailure = async () => {
    if (!selectedDevice) return;
    try {
      setLoadingFailure(true);
      const res = await getFailureForDevice(selectedDevice);
      setFailureData(res.data);
    } catch (err) {
      setError("Failure detection failed");
    } finally {
      setLoadingFailure(false);
    }
  };

  const fetchProactiveAlerts = async () => {
    try {
      setLoadingProactive(true);
      const res = await getProactiveAlerts(false);
      setProactiveAlerts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProactive(false);
    }
  };

  const runGlobalCheck = async () => {
    try {
      await checkAllDevices();
      fetchProactiveAlerts();
    } catch (err) {
      setError("Proactive check failed");
    }
  };

  useEffect(() => {
    if (selectedDevice) {
      fetchRisk();
      fetchFailure();
    }
  }, [selectedDevice]);

  useEffect(() => {
    fetchProactiveAlerts();
  }, []);

  const getRiskColor = (level) => {
    if (!level) return "gray";
    const l = level.toLowerCase();
    if (l === "high") return "red";
    if (l === "medium") return "yellow";
    return "green";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">AI Predictive Analytics</h2>
        <DeviceSelector onSelect={setSelectedDevice} selectedDeviceId={selectedDevice} />
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

      {selectedDevice ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Card */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4">Future Risk Assessment</h3>
            {loadingRisk ? (
              <LoadingSpinner />
            ) : riskData ? (
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-lg bg-${getRiskColor(riskData.risk_level)}-100 dark:bg-${getRiskColor(
                    riskData.risk_level
                  )}-900/20`}
                >
                  <p className="font-bold">
                    Risk Level: {riskData.risk_level?.toUpperCase() || "Unknown"}
                  </p>
                  <p>Predicted Temp: {riskData.predicted_temperature}°C</p>
                  {riskData.time_window_hours && (
                    <p>Time to breach: ~{riskData.time_window_hours} hours</p>
                  )}
                  <p className="text-sm mt-2">{riskData.message}</p>
                </div>
                <button
                  onClick={fetchRisk}
                  className="w-full py-2 bg-gray-200 dark:bg-dark-card rounded-lg"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <p>Click refresh to analyze</p>
            )}
          </div>

          {/* Failure Detection Card */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4">Failure Pattern Detection</h3>
            {loadingFailure ? (
              <LoadingSpinner />
            ) : failureData ? (
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-lg ${failureData.anomaly_detected
                      ? "bg-red-100 dark:bg-red-900/20"
                      : "bg-green-100 dark:bg-green-900/20"
                    }`}
                >
                  <p className="font-bold">
                    Status: {failureData.anomaly_detected ? "⚠️ Anomaly Detected" : "✅ Normal"}
                  </p>
                  {failureData.pattern && <p>Pattern: {failureData.pattern}</p>}
                  <p className="text-sm mt-2">{failureData.message}</p>
                </div>
                <button
                  onClick={fetchFailure}
                  className="w-full py-2 bg-gray-200 dark:bg-dark-card rounded-lg"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <p>Click refresh to detect</p>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-card p-8 text-center">
          <p>Select a device to see predictions</p>
        </div>
      )}

      {/* Proactive Alerts & Global Check */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Proactive Alerts (Predictive)</h3>
          <button
            onClick={runGlobalCheck}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg"
          >
            Run Global Check
          </button>
        </div>
        {loadingProactive ? (
          <LoadingSpinner />
        ) : proactiveAlerts.length === 0 ? (
          <p>No proactive alerts at this time.</p>
        ) : (
          <div className="space-y-3">
            {proactiveAlerts.map((alert) => (
              <div key={alert.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p>
                  <strong>{alert.device_id}</strong> – {alert.message}
                </p>
                <p className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskFailureTab;


