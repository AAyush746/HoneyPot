from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import SessionLocal, Attack
from typing import List
from datetime import datetime, date

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def get_db(): db = SessionLocal(); yield db; db.close()

@app.get("/attacks")
def attacks(db: Session = Depends(get_db), limit: int = 500):
    return db.query(Attack).order_by(Attack.timestamp.desc()).limit(limit).all()

@app.get("/stats")
def stats(db: Session = Depends(get_db)):
    today = date.today()
    total = db.query(Attack).count()
    today_attacks = db.query(Attack).filter(Attack.timestamp >= today).count()
    unique_ips = db.query(Attack.src_ip).distinct().count()
    top = db.execute(text("""
        SELECT country_code, country, COUNT(*) FROM attacks 
        GROUP BY country_code ORDER BY COUNT(*) DESC LIMIT 10
    """)).fetchall()
    return {
        "total_attacks": total, "today_attacks": today_attacks,
        "unique_ips": unique_ips,
        "top_countries": [{"code": c[0], "name": c[1] or "Unknown", "count": c[2]} for c in top]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)