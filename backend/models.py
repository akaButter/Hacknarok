from sqlalchemy import Column, String, Float, Integer, BigInteger
from db import Base


class BusState(Base):
    __tablename__ = "bus_state"

    bus_id = Column(String, primary_key=True)

    timestamp = Column(BigInteger)

    temperature = Column(Float)
    humidity = Column(Float)
    pressure = Column(Float)

    people_count = Column(Integer)
    general_comfort_level = Column(Integer)


class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True)

    age = Column(Integer)
    gender = Column(String)
    height = Column(Integer)
    weight = Column(Integer)