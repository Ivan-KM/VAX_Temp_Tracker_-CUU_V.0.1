import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 10000
});


// Todo: add response Interceptor for Error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error: ", error.response?.data || error.message);
        return Promise.reject(error);
    }
)

export const uploadCSV = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return API.post("/upload-csv", formData, {
        headers: {"Content-Type": "multipart/form-data"},
    });
};

export const checkAllDevices = () => API.post("/check-all-devices")

export const getProactiveAlerts = (resolved = false) =>
    API.get(`/proactive-alerts?resolved=${resolved}`);

export const getRiskForDevice = (deviceId) => API.get(`/risk/${deviceId}`);

export const getFailureForDevice = (deviceId) => API.get(`/detect/${deviceId}`);


export const getDevices = () => API.get("/devices");
export const getTemperatureTrend = (devicedId) => API.get(`/temperature/trend/${devicedId}`);
export const getAlerts = () => API.get("/alerts");
export const getAlertStats = ()=> API.get("/alerts/stats");
export const getTemperature = (deviceId) => API.get(`/temperature/${deviceId}`);
export const getDeviceAlerts = (deviceId) => API.get(`alerts/${deviceId}`);
export const getLatestTemperature = ()=> API.get("latest-temperature");
export const getDailyAverage = (deviceId) => API.get(`/temperature/${deviceId}/daily-average`);
export const getMinMax = (deviceId) => API.get(`/temperature/${deviceId}/min-max`);
export const getSummary = () => API.get("/summary")
export const getRisk = () => API.get("/risk")
export const getDetectFailure = () => API.get("/detect")


export default API;