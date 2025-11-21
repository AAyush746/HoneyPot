# backend/api.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text  # ← THIS IS THE KEY IMPORT
from database import SessionLocal, Attack
from typing import List
from pydantic import BaseModel
from datetime import datetime, date

app = FastAPI(title="Honeypot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AttackResponse(BaseModel):
    id: int
    timestamp: datetime
    src_ip: str
    username: str
    password: str
    command: str | None
    country: str
    country_code: str
    city: str

@app.get("/attacks", response_model=List[AttackResponse])
def get_attacks(db: Session = Depends(get_db), limit: int = 500):
    return db.query(Attack).order_by(Attack.timestamp.desc()).limit(limit).all()

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    today = date.today()

    total = db.query(Attack).count()
    today_attacks = db.query(Attack).filter(Attack.timestamp >= today).count()
    unique_ips = db.query(Attack.src_ip).distinct().count()

    # ← FIXED WITH text() ←
    top_countries = db.execute(text("""
        SELECT country_code, country, COUNT(*) as count 
        FROM attacks 
        GROUP BY country_code, country 
        ORDER BY count DESC 
        LIMIT 10
    """)).fetchall()

    return {
        "total_attacks": total,
        "today_attacks": today_attacks,
        "unique_ips": unique_ips,
        "top_countries": [
            {"code": row[0], "name": row[1] or "Unknown", "count": row[2]}
            for row in top_countries
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)