# backend/database.py
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database.db")

engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Attack(Base):
    __tablename__ = "attacks"        # ← THIS WAS MISSING BEFORE!

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    src_ip = Column(String, index=True)
    src_port = Column(Integer)
    username = Column(String)
    password = Column(String)
    command = Column(Text, nullable=True)
    country = Column(String)
    country_code = Column(String)
    city = Column(String)
    latitude = Column(Float, nullable=True)    # ← NEW
    longitude = Column(Float, nullable=True)   # ← NEW

# Create the table with new schema
# Base.metadata.create_all(bind=engine)
# print("Database created successfully with latitude/longitude!")