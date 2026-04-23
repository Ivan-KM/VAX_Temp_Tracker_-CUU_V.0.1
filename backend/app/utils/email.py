import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
ALERT_RECIPIENTS = os.getenv("ALERT_RECEIPIENTS", "").split(",") #This is for comma-separated emails



def send_alert_email(subject: str, body: str, recipients: List[str] = None):
    """Send an email alert."""
    if not SMTP_USER or not SMTP_PASSWORD:
        print("Email credentials not configured. Skipping email send.")
        return False

    if recipients is None:
        recipients = ALERT_RECIPIENTS
    recipients = [r.strip() for r in recipients if r.strip()]
    if not recipients:
        print("No recipients defined. Skipping email.")
        return False

    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = ", ".join(recipients)
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        print(f"Alert email sent to {recipients}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
    


    