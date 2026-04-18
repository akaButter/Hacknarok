import json
from db import SessionLocal, engine, Base
from models import Route, Attraction, BusState

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def forge_world():
    db = SessionLocal()
    
    city_data = {
  "routes": [
    {"id": "R1", "name": "The Bifrost", "color": "#FF0000", "path": [{"lat": 69.723, "lng": 18.620}, {"lat": 69.718, "lng": 18.615}, {"lat": 69.715, "lng": 18.605}, {"lat": 69.692, "lng": 18.618}]},
    {"id": "R2", "name": "The Iron Path", "color": "#808080", "path": [{"lat": 69.695, "lng": 18.610}, {"lat": 69.700, "lng": 18.600}, {"lat": 69.705, "lng": 18.590}, {"lat": 69.692, "lng": 18.618}]},
    {"id": "R3", "name": "Valkyrie Loop", "color": "#FFD700", "path": [{"lat": 69.710, "lng": 18.640}, {"lat": 69.712, "lng": 18.650}, {"lat": 69.715, "lng": 18.660}, {"lat": 69.710, "lng": 18.640}]},
    {"id": "R4", "name": "Fjord Express", "color": "#0000FF", "path": [{"lat": 69.705, "lng": 18.670}, {"lat": 69.700, "lng": 18.680}, {"lat": 69.695, "lng": 18.690}, {"lat": 69.692, "lng": 18.618}]},
    {"id": "R5", "name": "The Ghost Line", "color": "#4B0082", "path": [{"lat": 69.730, "lng": 18.580}, {"lat": 69.725, "lng": 18.590}, {"lat": 69.720, "lng": 18.595}]},
    {"id": "R6", "name": "Odin's Eye", "color": "#006400", "path": [{"lat": 69.692, "lng": 18.618}, {"lat": 69.685, "lng": 18.600}, {"lat": 69.680, "lng": 18.580}]}
  ],
  "attractions": [
    {"id": "A1", "name": "Viking Ship Museum", "type": "MUSEUM", "lat": 69.723, "lng": 18.620, "cap": 300, "rid": "R1", "open": 9, "close": 18},
    {"id": "A2", "name": "Thor's Hammer Park", "type": "PARK", "lat": 69.715, "lng": 18.605, "cap": 1000, "rid": "R1", "open": 0, "close": 24},
    {"id": "A3", "name": "The Great Mead Hall", "type": "RESTAURANT", "lat": 69.695, "lng": 18.610, "cap": 150, "rid": "R2", "open": 11, "close": 23},
    {"id": "A4", "name": "Odin's Observatory", "type": "MUSEUM", "lat": 69.705, "lng": 18.590, "cap": 200, "rid": "R2", "open": 10, "close": 20},
    {"id": "A5", "name": "Loki's Garden", "type": "PARK", "lat": 69.710, "lng": 18.640, "cap": 500, "rid": "R3", "open": 6, "close": 21},
    {"id": "A6", "name": "Rune Stone Gallery", "type": "MUSEUM", "lat": 69.715, "lng": 18.660, "cap": 100, "rid": "R3", "open": 9, "close": 17},
    {"id": "A7", "name": "Freya's Waterfall", "type": "PARK", "lat": 69.705, "lng": 18.670, "cap": 800, "rid": "R4", "open": 0, "close": 24},
    {"id": "A8", "name": "Valhalla Gate", "type": "HUB", "lat": 69.692, "lng": 18.618, "cap": 2000, "rid": "R1", "open": 0, "close": 24},
    {"id": "A9", "name": "Berserker Training Ground", "type": "ACTIVITY", "lat": 69.700, "lng": 18.600, "cap": 50, "rid": "R2", "open": 8, "close": 20},
    {"id": "A10", "name": "Ancient Burial Mounds", "type": "PARK", "lat": 69.730, "lng": 18.580, "cap": 500, "rid": "R5", "open": 0, "close": 24},
    {"id": "A11", "name": "Longboat Harbor", "type": "STATION", "lat": 69.702, "lng": 18.685, "cap": 1000, "rid": "R4", "open": 5, "close": 23},
    {"id": "A12", "name": "The Seer's Hut", "type": "MUSEUM", "lat": 69.685, "lng": 18.600, "cap": 20, "rid": "R6", "open": 12, "close": 16},
    {"id": "A13", "name": "Shieldmaiden Academy", "type": "ACTIVITY", "lat": 69.680, "lng": 18.580, "cap": 80, "rid": "R6", "open": 9, "close": 19},
    {"id": "A14", "name": "Mjolnir Forge", "type": "ACTIVITY", "lat": 69.695, "lng": 18.690, "cap": 40, "rid": "R4", "open": 10, "close": 18},
    {"id": "A15", "name": "Yggdrasil Plaza", "type": "HUB", "lat": 69.720, "lng": 18.595, "cap": 1500, "rid": "R5", "open": 0, "close": 24}
  ],
  "buses": [
    {"id": "B01", "rid": "R1"}, {"id": "B02", "rid": "R1"},
    {"id": "B03", "rid": "R2"}, {"id": "B04", "rid": "R2"},
    {"id": "B05", "rid": "R3"}, {"id": "B06", "rid": "R3"},
    {"id": "B07", "rid": "R4"}, {"id": "B08", "rid": "R4"},
    {"id": "B09", "rid": "R5"}, {"id": "B10", "rid": "R6"}
  ]
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