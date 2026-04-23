from sqlalchemy import Column, Integer, Boolean, String, Float, DateTime
from app.database.connection import Base

class TemperatureLog(Base):
    __tablename__ = "temperature_logs"

    id = Column(Integer, primary_key = True, index=True)
    device_id = Column(String)
    timestamp = Column(DateTime)
    temperature = Column(Float)
    binary_code = Column(Integer)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String)
    timestamp = Column(DateTime)
    temperature = Column(Float)
    message = Column(String)
    is_proactive = Column(Boolean, default=False)
    resolved = Column(Boolean, default=False)

class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer,primary_key=True, index=True)
    device_id = Column(String, unique=True, index=True) 
    min_temp = Column(Float)
    max_temp = Column(Float)
    status = Column(String, default="active")
