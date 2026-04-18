import json
from db import SessionLocal, engine, Base
from models import Route, Attraction, BusState

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def forge_world():
    db = SessionLocal()
    
    city_data = {
        "routes": [{"id": "R1", "name": "The Bifrost", "color": "#FF0000", "path": [{"lat": 59.328, "lng": 18.091}, {"lat": 59.329, "lng": 18.085}, {"lat": 59.330, "lng": 18.070}, {"lat": 59.332, "lng": 18.064}]},
                   {"id": "R2", "name": "The Iron Path", "color": "#808080", "path": [{"lat": 59.335, "lng": 18.060}, {"lat": 59.337, "lng": 18.055}, {"lat": 59.340, "lng": 18.050}, {"lat": 59.332, "lng": 18.064}]},
                   {"id": "R3", "name": "Valkyrie Loop", "color": "#FFD700", "path": [{"lat": 59.320, "lng": 18.080}, {"lat": 59.322, "lng": 18.090}, {"lat": 59.325, "lng": 18.100}, {"lat": 59.320, "lng": 18.080}]},
                   {"id": "R4", "name": "Fjord Express", "color": "#0000FF", "path": [{"lat": 59.310, "lng": 18.110}, {"lat": 59.305, "lng": 18.115}, {"lat": 59.300, "lng": 18.120}, {"lat": 59.332, "lng": 18.064}]},
                   {"id": "R5", "name": "The Ghost Line", "color": "#4B0082", "path": [{"lat": 59.360, "lng": 18.030}, {"lat": 59.355, "lng": 18.040}, {"lat": 59.345, "lng": 18.045}]},
                   {"id": "R6", "name": "Odin's Eye", "color": "#006400", "path": [{"lat": 59.332, "lng": 18.064}, {"lat": 59.345, "lng": 18.020}, {"lat": 59.355, "lng": 18.010}]}],
        "attractions": [{"id": "A1", "name": "Viking Ship Museum", "type": "MUSEUM", "lat": 59.328, "lng": 18.091, "cap": 300, "rid": "R1", "open": 9, "close": 18},
                        {"id": "A2", "name": "Thor's Hammer Park", "type": "PARK", "lat": 59.330, "lng": 18.070, "cap": 1000, "rid": "R1", "open": 0, "close": 24},
                        {"id": "A3", "name": "The Great Mead Hall", "type": "RESTAURANT", "lat": 59.335, "lng": 18.060, "cap": 150, "rid": "R2", "open": 11, "close": 23},
                        {"id": "A4", "name": "Odin's Observatory", "type": "MUSEUM", "lat": 59.340, "lng": 18.050, "cap": 200, "rid": "R2", "open": 10, "close": 20},
                        {"id": "A5", "name": "Loki's Garden", "type": "PARK", "lat": 59.320, "lng": 18.080, "cap": 500, "rid": "R3", "open": 6, "close": 21},
                        {"id": "A6", "name": "Rune Stone Gallery", "type": "MUSEUM", "lat": 59.325, "lng": 18.100, "cap": 100, "rid": "R3", "open": 9, "close": 17},
                        {"id": "A7", "name": "Freya's Waterfall", "type": "PARK", "lat": 59.310, "lng": 18.110, "cap": 800, "rid": "R4", "open": 0, "close": 24},
                        {"id": "A8", "name": "Valhalla Gate", "type": "HUB", "lat": 59.332, "lng": 18.064, "cap": 2000, "rid": "R1", "open": 0, "close": 24},
                        {"id": "A9", "name": "Berserker Training Ground", "type": "ACTIVITY", "lat": 59.350, "lng": 18.040, "cap": 50, "rid": "R2", "open": 8, "close": 20},
                        {"id": "A10", "name": "Ancient Burial Mounds", "type": "PARK", "lat": 59.360, "lng": 18.030, "cap": 500, "rid": "R5", "open": 0, "close": 24},
                        {"id": "A11", "name": "Longboat Harbor", "type": "STATION", "lat": 59.315, "lng": 18.130, "cap": 1000, "rid": "R4", "open": 5, "close": 23},
                        {"id": "A12", "name": "The Seer's Hut", "type": "MUSEUM", "lat": 59.345, "lng": 18.020, "cap": 20, "rid": "R6", "open": 12, "close": 16},
                        {"id": "A13", "name": "Shieldmaiden Academy", "type": "ACTIVITY", "lat": 59.355, "lng": 18.010, "cap": 80, "rid": "R6", "open": 9, "close": 19},
                        {"id": "A14", "name": "Mjolnir Forge", "type": "ACTIVITY", "lat": 59.300, "lng": 18.120, "cap": 40, "rid": "R4", "open": 10, "close": 18},
                        {"id": "A15", "name": "Yggdrasil Plaza", "type": "HUB", "lat": 59.345, "lng": 18.045, "cap": 1500, "rid": "R5", "open": 0, "close": 24}],
        "buses": [{"id": "B01", "rid": "R1", "cap": 20}, {"id": "B02", "rid": "R1", "cap": 20},
                  {"id": "B03", "rid": "R2", "cap": 20}, {"id": "B04", "rid": "R2", "cap": 20},
                  {"id": "B05", "rid": "R3", "cap": 20}, {"id": "B06", "rid": "R3", "cap": 20},
                  {"id": "B07", "rid": "R4", "cap": 20}, {"id": "B08", "rid": "R4", "cap": 20},
                  {"id": "B09", "rid": "R5", "cap": 20}, {"id": "B10", "rid": "R6", "cap": 20}] 
    }

    db.query(Route).delete()
    db.query(Attraction).delete()
    db.query(BusState).delete()

    for r in city_data["routes"]:
        db.add(Route(
            id=r["id"], 
            name=r["name"], 
            color=r["color"], 
            path=json.dumps(r["path"]) # Convert list to string
        ))

    for a in city_data["attractions"]:
        db.add(Attraction(
            id=a["id"], name=a["name"], type=a["type"],
            lat=a["lat"], lng=a["lng"], capacity=a.get("cap", 500),
            route_id=a["rid"], open_hour=a["open"], close_hour=a["close"]
        ))

    for b in city_data["buses"]:
        db.add(BusState(
            bus_id=b["id"],
            route_id=b["rid"],
            capacity=b.get("cap", 20),
            temperature=20.0, # Initial default
            people_count=0
        ))

    db.commit()
    db.close()
    print("Viking City Forged Successfully!")

if __name__ == "__main__":
    forge_world()