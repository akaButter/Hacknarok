from datetime import datetime

from sqlalchemy import Column, DateTime, DateTime, String, Float, Integer, BigInteger, ForeignKey
from db import Base


class BusState(Base):
    __tablename__ = "bus_state"
    bus_id = Column(String, primary_key=True)
    route_id = Column(String, ForeignKey("routes.id")) # Link to Route
    capacity = Column(Integer) # Added capacity
    timestamp = Column(BigInteger)
    temperature = Column(Float)
    humidity = Column(Float)
    pressure = Column(Float)
    people_count = Column(Integer)
    general_comfort_level = Column(Integer)

class Route(Base):
    __tablename__ = "routes"
    id = Column(String, primary_key=True)
    name = Column(String)
    color = Column(String)
    path = Column(String)

class Attraction(Base):
    __tablename__ = "attractions"
    id = Column(String, primary_key=True)
    name = Column(String)
    type = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    capacity = Column(Integer)
    route_id = Column(String, ForeignKey("routes.id"))
    open_hour = Column(Integer)
    close_hour = Column(Integer)
    temperature = Column(Float)
    humidity = Column(Float)
    pressure = Column(Float)
    people_count = Column(Integer)

class User(Base):
    __tablename__ = "users"
    user_id = Column(String, primary_key=True)
    age = Column(Integer)
    gender = Column(String)
    height = Column(Integer)
    weight = Column(Integer)


class ComfortFeedback(Base):
    __tablename__ = "comfort_feedback"

    id = Column(Integer, primary_key=True)
    bus_id = Column(String)
    user_id = Column(String, nullable=True)

    temperature = Column(Float)
    humidity = Column(Float)
    people_count = Column(Integer)

    predicted_comfort = Column(Float)
    user_feedback = Column(Float)  # np. 1–5 albo -1/1

    timestamp = Column(DateTime, default=datetime.utcnow)