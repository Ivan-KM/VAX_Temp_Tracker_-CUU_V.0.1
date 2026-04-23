import smtplib
from email.mime.text import MIMEText

SAFE_MIN = 2
SAFE_MAX = 8

def check_temperature(record):
    temp = record["TemperatureReading"]
    if temp < SAFE_MIN:
        return f"Current temperature is too low: {temp}C"
    if temp > SAFE_MAX:
        return f"Current temperature is too high: {temp}C"
    
    return None


def send_email_alert(device_id, temperature, timestamp):
    sender = "ssozipaule@gmai.com"
    password = ""
    receiver = "admin@vaxtrack.com"
    subject = "Temperature Alert"

    body = f"""
    ALERT DETECTED
    Device: {device_id}
    Temperature: {temperature}

    Temperature is out outside safe range
    """
    
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = receiver

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, password)
        server.sendmail(sender, receiver, msg.as_string())




