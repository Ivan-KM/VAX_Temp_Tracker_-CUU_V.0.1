import pandas as pd
from app.utils.temperature import check_temperature
from app.models.models import TemperatureLog, Alert, Device
from app.database.connection import SessionLocal
from app.utils.timeutil import convert_simulation_timestamp
import re
from app.utils.email import send_alert_email

def process_csv(file, db):

    df = pd.read_csv(file)
    df.columns = [re.sub(r'(?<!^)(?=[A-Z])', '_', col).lower().strip().replace(" ", "_")
                    for col in df.columns
                    ]
    
    
    db = SessionLocal()
    
    records = []
    alerts = []
    devices = []

    existing_devices = {
        d.device_id for d in db.query(Device.device_id).all()
    }

    for _, row in df.iterrows():
        device_id = row["device_id"]
        temperature = float(row["temperature_reading"])
        timestamp_ms = int(row["time_stamp"])

        timestamp = convert_simulation_timestamp(timestamp_ms)
        alert_code = check_temperature(temperature)

        record = TemperatureLog(
            device_id= row["device_id"],
            timestamp= timestamp,
            temperature= temperature,
            binary_code = alert_code
        )
        records.append(record)

        if device_id not in existing_devices:
            device = Device(
                device_id = device_id,
                status = "active",
            )
            devices.append(device)
            existing_devices.add(device_id)


        if alert_code == 1:
            alert = Alert(
                device_id=row["device_id"],
                timestamp=timestamp,
                temperature=temperature,
                message="Temperature out of range"
            )

            alerts.append(alert)

            # Todo: send email notification for reactive alerts
            send_alert_email(
                subject=f"VaxTrack ALERT! Device {device_id} out of safe temperature range",
                body=f"Device {device_id} reported temperature {temperature}°C at {timestamp}. Safe range is 2-8°C."
            )

    # Todo: Add record to Database
    db.add_all(records)
    db.add_all(alerts)
    db.add_all(devices)

    db.commit()
    db.close()
    
    return records, alerts, devices





