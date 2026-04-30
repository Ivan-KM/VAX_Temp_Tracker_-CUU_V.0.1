import React, { useEffect, useState } from "react";
import { getDevices } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const DeviceSelector = ({ onSelect, selectedDeviceId }) => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const res = await getDevices();
            setDevices(res.data);
            setError(null);
        } catch (err) {
            setError("Failed to load devices");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={fetchDevices} />;

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Device
            </label>
            <select
                value={selectedDeviceId || ""}
                onChange={(e) => onSelect(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
                <option value="">Select a device</option>
                {devices.map((device) => (
                    <option key={device.device_id} value={device.device_id}>
                        {device.device_id} {device.name ? `- ${device.name}` : ""}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DeviceSelector;



