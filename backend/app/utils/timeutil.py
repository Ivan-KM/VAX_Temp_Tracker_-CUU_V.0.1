from datetime import datetime, timedelta, timezone


SIMULATION_START_DATE = datetime.now(timezone.utc)


def convert_simulation_timestamp(ms_timestamp: int):
    """
    Convert a millisecond timestamp from Tinkercad simulation into a time string (HH:MM:SS).

    Args:
        ms_timestamp: Milliseconds elapsed since simulation start.
        start_time: Absolute UTC start time of the simulation. If None, uses current UTC time.

    Returns:
        String in format 'HH:MM:SS' (strictly two digits each).
    """
    
    delta = timedelta(milliseconds=ms_timestamp)
  


    return SIMULATION_START_DATE + delta

