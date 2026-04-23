import numpy as np

def detect_failure_pattern(readings):

    if len(readings) < 5:
        return {"failure": None}

    temps = np.array(readings)

    # Calculate rate of change
    diffs = np.diff(temps)

    avg_change = np.mean(diffs)
    max_change = np.max(diffs)

    # Door open detection
    if max_change > 2:
        return {
            "failure": "door_open",
            "message": "Possible appliance opening detected"
        }

    # Compressor failure detection
    if avg_change > 0.4:
        return {
            "failure": "compressor_failure",
            "message": "Cooling system losing efficiency"
        }

    # Power failure detection
    if max_change > 7:
        return {
            "failure": "power_failure",
            "message": "Possible power outage detected"
        }

    return {
        "failure": None,
        "message": "System operating normally"
    }