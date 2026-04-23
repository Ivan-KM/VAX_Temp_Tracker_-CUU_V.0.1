SAFE_MIN_TEMP = 2.0
SAFE_MAX_TEMP = 8.0


def check_temperature(temp: float) -> int:
    """
    Returns binary alert code
    0 = temperature OK
    1 = temperature out of safe range
    """
    
    if temp < SAFE_MIN_TEMP or temp > SAFE_MAX_TEMP:
        return 1
    
    return 0

