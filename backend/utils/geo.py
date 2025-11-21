# backend/utils/geo.py
import geoip2.database
import os

# Fixed path - works whether you run from backend/ or project root
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GEOIP_DB = os.path.join(BASE_DIR, "../geoip/GeoLite2-City.mmdb")

if not os.path.exists(GEOIP_DB):
    raise FileNotFoundError(
        "\nGeoLite2-City.mmdb not found!\n"
        "Run this in backend/ folder:\n"
        "mkdir -p geoip && wget -O geoip/GeoLite2-City.mmdb https://git.io/GeoLite2-City.mmdb\n"
    )

reader = geoip2.database.Reader(GEOIP_DB)

def get_location(ip: str):
    try:
        response = reader.city(ip)
        return {
            "country": response.country.name or "Unknown",
            "country_code": response.country.iso_code or "XX",
            "city": response.city.name or "Unknown",
            "latitude": response.location.latitude,
            "longitude": response.location.longitude
        }
    except Exception:
        return {"country": "Unknown", "country_code": "XX", "city": "Unknown"}