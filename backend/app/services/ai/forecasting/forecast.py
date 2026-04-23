import numpy as np

SAFE_MAX = 8
SAFE_MIN = 2

# Todo: forecast temperature.
def forecast_temperature(readings):

    if len(readings) < 3:
        return None

    x = np.arange(len(readings))
    y = np.array(readings)

    slope, intercept = np.polyfit(x, y, 1)

    future_index = len(readings) + 9

    predicted_temp = slope * future_index + intercept

    return round(predicted_temp, 2)


# Todo: check future risks
def check_future_risk(readings):

    predicted = forecast_temperature(readings)

    if predicted is None:
        return None

    if predicted > 6.5:
        return {
            "warning": True,
            "message": "Temperature likely to exceed safe range soon",
            "predicted_temp": predicted
        }

    return {
        "warning": False,
        "predicted_temp": predicted
    }
