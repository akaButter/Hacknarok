import json
import paho.mqtt.client as mqtt

from db import SessionLocal
from models import BusState

MQTT_BROKER = "localhost"
TOPIC = "bus/+/telemetry"

def on_message(client, userdata, msg):
    db = SessionLocal()
    
    try:
        payload = msg.payload.decode()
        print(f"Otrzymano surowy payload: {payload}")  # Debugowanie
        
        # Zamień pojedyncze cudzysłowy na podwójne (awaryjnie)
        if "'" in payload and '"' not in payload:
            payload = payload.replace("'", '"')
            print(f"Poprawiony payload: {payload}")
        
        data = json.loads(payload)
        
        # Reszta kodu...
        bus = db.query(BusState).filter_by(bus_id=data["bus_id"]).first()

        if not bus:
            bus = BusState(bus_id=data["bus_id"])
            db.add(bus)

        bus.timestamp = data["timestamp"]

        bus.temperature = data["sensor"]["temperature"]
        bus.humidity = data["sensor"]["humidity"]
        bus.pressure = data["sensor"]["pressure"]

        bus.people_count = data["edge"]["people_count"]
        bus.general_comfort_level = data["edge"]["general_comfort_level"]

        db.commit()

    except json.JSONDecodeError as e:
            print(f"Błąd JSON: {e}")
            print(f"Problematic payload: {msg.payload.decode()}")
    except Exception as e:
        print(f"Inny błąd: {e}")
    finally:
        db.close()

def start_mqtt():
    client = mqtt.Client()
    client.on_message = on_message

    client.connect(MQTT_BROKER, 1883, 60)
    client.subscribe(TOPIC)

    client.loop_start()