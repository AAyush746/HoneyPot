# backend/utils/geo.py
import geoip2.database
import os

reader = geoip2.database.Reader(os.path.join(os.path.dirname(__file__), "../GeoLite2-City.mmdb"))

def get_location(ip: str):
    # Default values for local/testing
    default = {"country": "Localhost", "country_code": "XX", "city": "Your PC", "latitude": 20.0, "longitude": 0.0}
    
    if ip in ("127.0.0.1", "::1", "localhost"):
        return default
    
    try:
        response = reader.city(ip)
        return {
            "country": response.country.name or "Unknown",
            "country_code": response.country.iso_code or "XX",
            "city": response.city.name or "Unknown",
            "latitude": response.location.latitude or 0.0,
            "longitude": response.location.longitude or 0.0,
        }
    except Exception as e:
        print(f"GeoIP error for {ip}: {e}")
        return default  # Always return valid data