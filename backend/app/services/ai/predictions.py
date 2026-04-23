import numpy as np
from datetime import datetime, timedelta, timezone
from typing import List, Tuple, Dict, Optional

SAFE_MIN = 2.0
SAFE_MAX = 8.0

def exponential_smoothing(series: List[float], alpha: float = 0.3) -> List[float]:
    """Apply simple exponential smoothing to a series."""
    smoothed = [series[0]]
    for val in series[1:]:
        smoothed.append(alpha * val + (1 - alpha) * smoothed[-1])
    return smoothed

def predict_future_temperature(
    timestamps: List[datetime],
    temperatures: List[float],
    horizon_minutes: int = 60,
    steps: int = 6,
    max_rate_c_per_hour: float = 5.0,   # physical limit for vaccine fridge
    outlier_std_threshold: float = 2.0
) -> Dict:
    """
    Predict temperature with robust slope estimation and physical constraints.
    """
    if len(temperatures) < 3:
        return {"error": "Insufficient data"}

    # Todo: Convert to minutes since first reading
    base = timestamps[0]
    minutes = [(t - base).total_seconds() / 60.0 for t in timestamps]

    
    #Todo: Compute rolling median and deviation
    temps_arr = np.array(temperatures)
    median = np.median(temps_arr)
    std_dev = np.std(temps_arr)

    # Todo: Identify outliers (more than `outlier_std_threshold` std from median)
    outliers = np.abs(temps_arr - median) > (outlier_std_threshold * std_dev)
    # Todo: Keep only non-outliers
    clean_minutes = [minutes[i] for i in range(len(minutes)) if not outliers[i]]
    clean_temps = [temps_arr[i] for i in range(len(temps_arr)) if not outliers[i]]
    
    # Todo: handle If too many outliers removed, fallback to original data
    if len(clean_temps) < max(3, len(temperatures)//2):
        clean_minutes, clean_temps = minutes, temperatures

    #Todo apply exponential smoothing to reduce noise
    smoothed_temps = exponential_smoothing(clean_temps, alpha=0.3)
    last_smoothed = smoothed_temps[-1]

    #Todo: Handle linear regression on smoothed data
    coeffs = np.polyfit(clean_minutes, smoothed_temps, 1)
    slope_raw = coeffs[0]         
    intercept = coeffs[1]

    # Todo: Clamp slope to physical limits
    max_slope_per_minute = max_rate_c_per_hour / 60.0
    slope = np.clip(slope_raw, -max_slope_per_minute, max_slope_per_minute)

    # Todo: Predict future temperatures
    step_minutes = horizon_minutes / steps
    future_minutes = [clean_minutes[-1] + (i+1)*step_minutes for i in range(steps)]
    future_temps = [slope * m + intercept for m in future_minutes]


    MIN_TEMP = -2.0
    MAX_TEMP = 12.0
    future_temps = [np.clip(t, MIN_TEMP, MAX_TEMP) for t in future_temps]
    predicted_temp = future_temps[-1]

    #Todo: Calculate time left to breach safe range (2-8°C)
    SAFE_MIN = 2.0
    SAFE_MAX = 8.0
    time_to_breach = None
    if slope > 0:
        if last_smoothed < SAFE_MAX:
            minutes_to_max = (SAFE_MAX - last_smoothed) / slope if slope > 0 else None
            time_to_breach = minutes_to_max if minutes_to_max and minutes_to_max > 0 else None
    elif slope < 0:
        if last_smoothed > SAFE_MIN:
            minutes_to_min = (SAFE_MIN - last_smoothed) / slope if slope < 0 else None
            time_to_breach = minutes_to_min if minutes_to_min and minutes_to_min > 0 else None

    #Todo: Determine risk level
    risk_level = "low"
    if time_to_breach is not None:
        if time_to_breach <= 30:
            risk_level = "high"
        elif time_to_breach <= 120:
            risk_level = "medium"
        else:
            risk_level = "low"

    # Todo: Trend description
    if slope > 0.01:
        trend_desc = "rising"
    elif slope < -0.01:
        trend_desc = "falling"
    else:
        trend_desc = "stable"

    #Todo: Build message
    rate_per_hour = abs(slope * 60)
    if time_to_breach:
        message = (f"Temperature {trend_desc} at {rate_per_hour:.1f}°C per hour. "
                   f"Predicted {predicted_temp:.1f}°C in {horizon_minutes}min. "
                   f"Risk of exceeding safe range in {round(time_to_breach)} minutes.")
    else:
        message = (f"Temperature {trend_desc} at {rate_per_hour:.1f}°C per hour. "
                   f"Predicted {predicted_temp:.1f}°C in {horizon_minutes}min. "
                   f"No breach expected within {horizon_minutes} minutes.")

    return {
        "risk_level": risk_level,
        "predicted_temperature": round(predicted_temp, 1),
        "time_to_breach_minutes": round(time_to_breach, 1) if time_to_breach else None,
        "trend": trend_desc,
        "rate_of_change_per_hour": round(rate_per_hour, 2),
        "volatility": round(np.std(clean_temps), 2),
        "message": message
    }




def detect_anomaly_pattern(
    timestamps: List[datetime],
    temperatures: List[float],
    window: int = 5
) -> Dict:
    """
    Detect failure patterns using rolling statistics and sudden changes.
    Returns a dict with anomaly flag, pattern type, and confidence.
    """
    if len(temperatures) < window:
        return {"anomaly_detected": False, "message": "Insufficient data"}

    #Todo: Rolling mean and std
    rolling_means = []
    rolling_stds = []
    for i in range(len(temperatures) - window + 1):
        window_vals = temperatures[i:i+window]
        rolling_means.append(np.mean(window_vals))
        rolling_stds.append(np.std(window_vals))

    #Todo: Recent window (last `window` points)
    recent = temperatures[-window:]
    recent_mean = np.mean(recent)
    recent_std = np.std(recent)

    # Global mean and std
    global_mean = np.mean(temperatures)
    global_std = np.std(temperatures)

    #Todo: Detect sudden jump (door open)
    diffs = np.diff(temperatures[-window:])
    max_jump = np.max(diffs) if len(diffs) > 0 else 0
    if max_jump > 2.0:
        return {
            "anomaly_detected": True,
            "pattern": "door_open",
            "confidence": min(1.0, max_jump / 5.0),
            "message": "Sudden temperature rise detected – possible door open or warm load insertion."
        }

    if len(temperatures) >= 12:  # assuming ~5 min intervals -> 2h = 24 points, but we use 12 for simplicity
        slope, _ = np.polyfit(range(len(temperatures[-12:])), temperatures[-12:], 1)
        if slope > 0.0083:  # 0.5°C per hour ≈ 0.0083 per minute (if 1 reading per minute)
            return {
                "anomaly_detected": True,
                "pattern": "compressor_failure",
                "confidence": min(1.0, slope * 120),
                "message": "Gradual temperature rise – cooling system may be failing."
            }

    # Power failure: sharp drop (if freezer) or flatline? For devices, power loss => temperature rises quickly.
    # Todo: detect if temperature rises > 3°C in last 30 minutes
    if len(temperatures) >= 6:
        last_6 = temperatures[-6:]
        rise = last_6[-1] - last_6[0]
        if rise > 3.0:
            return {
                "anomaly_detected": True,
                "pattern": "power_failure",
                "confidence": min(1.0, rise / 5.0),
                "message": "Rapid temperature increase – possible power interruption."
            }

    # No anomaly
    return {
        "anomaly_detected": False,
        "pattern": "normal",
        "confidence": 1.0,
        "message": "System operating within normal parameters."
    }

# High‑level function for risk assessment (compatible with routes.py)
def check_future_risk(readings: List[float]) -> Dict:
    if len(readings) < 3:
        return {"risk_level": "insufficient_data", "message": "Need at least 3 readings"}

    # Create synthetic timestamps (minutes apart)
    base_time = datetime.now(timezone.utc)
    timestamps = [base_time + timedelta(minutes=i*5) for i in range(len(readings))]

    result = predict_future_temperature(timestamps, readings, horizon_minutes=60, steps=4)
    if "error" in result:
        return {"risk_level": "error", "message": result["error"]}

    return {
        "risk_level": result["risk_level"],
        "predicted_temperature": result["predicted_temperature"],
        "time_window_hours": round(result.get("time_to_breach_minutes", 999) / 60, 1),
        "message": result["message"],
        "trend": result["trend"],
        "rate_per_hour": result["rate_of_change_per_hour"],
        "safe_range": [SAFE_MIN, SAFE_MAX]
    }

def detect_failure_pattern(readings: List[float]) -> Dict:
    """Wrapper for anomaly detection with synthetic timestamps."""
    if len(readings) < 5:
        return {"failure": None, "message": "Insufficient data"}
    base_time = datetime.now(timezone.utc)
    timestamps = [base_time + timedelta(minutes=i*5) for i in range(len(readings))]
    result = detect_anomaly_pattern(timestamps, readings)
    return {
        "failure": result.get("pattern") if result["anomaly_detected"] else None,
        "message": result["message"],
        "confidence": result.get("confidence"),
        "anomaly_detected": result["anomaly_detected"]
    }























