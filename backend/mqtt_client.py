import json
import paho.mqtt.client as mqtt

from db import SessionLocal
from models import BusState, Attraction

MQTT_BROKER = "localhost"
TOPIC = "+/+/telemetry"

BUS_TOPIC = "bus/+/telemetry"
ATTRACTION_TOPIC = "attraction/+/telemetry"


def on_message(client, userdata, msg):
    db = SessionLocal()

    try:
        payload = msg.payload.decode()
        print(f"Otrzymano surowy payload: {payload}")
        print(f"Topic: {msg.topic}")

        if "'" in payload and '"' not in payload:
            payload = payload.replace("'", '"')
            print(f"Poprawiony payload: {payload}")

        data = json.loads(payload)

        # wybór modelu po topicu
        if msg.topic.startswith("bus/"):
            Model = BusState
            id_field = "bus_id"
        elif msg.topic.startswith("attraction/"):
            Model = Attraction
            id_field = "attraction_id"
        else:
            print("Nieznany topic")
            return

        obj = db.query(Model).filter_by(**{id_field: data[id_field]}).first()

        if not obj:
            obj = Model(**{id_field: data[id_field]})
            db.add(obj)

        obj.timestamp = data["timestamp"]

        obj.temperature = data["sensor"]["temperature"]
        obj.humidity = data["sensor"]["humidity"]
        obj.pressure = data["sensor"]["pressure"]

        obj.people_count = data["edge"]["people_count"]
        obj.general_comfort_level = data["edge"]["general_comfort_level"]

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

    client.subscribe(BUS_TOPIC)
    client.subscribe(ATTRACTION_TOPIC)

    client.loop_start()