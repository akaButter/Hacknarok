import sys
import json
import time
import random
import paho.mqtt.client as mqtt
from datetime import datetime

BROKER = "localhost"
PORT = 1883


def generate_sensor_data(entity_type):
    # normalne zakresy + czasem ekstremalne wartości
    if random.random() < 0.15:  # 15% szansy na "złe warunki"
        temperature = random.uniform(30, 40) if entity_type == "bus" else random.uniform(28, 38)
        humidity = random.uniform(80, 95)
        pressure = random.uniform(995, 1005)
        people = random.randint(50, 120)
        comfort = random.randint(1, 3)
    else:
        temperature = random.uniform(10, 28)
        humidity = random.uniform(30, 70)
        pressure = random.uniform(1005, 1025)
        people = random.randint(5, 40)
        comfort = random.randint(4, 9)

    return {
        "sensor": {
            "temperature": round(temperature, 1),
            "humidity": round(humidity, 1),
            "pressure": round(pressure, 1),
        },
        "edge": {
            "people_count": people,
            "general_comfort_level": comfort
        }
    }


def main():
    if len(sys.argv) != 3:
        print("Użycie: python publisher.py [bus|attraction] [id]")
        sys.exit(1)

    entity_type = sys.argv[1]
    entity_id = sys.argv[2]

    if entity_type not in ["bus", "attraction"]:
        print("Pierwszy argument musi być 'bus' albo 'attraction'")
        sys.exit(1)

    client = mqtt.Client()
    client.connect(BROKER, PORT, 60)

    data = generate_sensor_data(entity_type)

    payload = {
        f"{entity_type}_id": entity_id,
        "timestamp": datetime.utcnow().isoformat(),
        **data
    }

    topic = f"{entity_type}/{entity_id}/telemetry"

    client.publish(topic, json.dumps(payload))

    print(f"Wysłano do {topic}:")
    print(json.dumps(payload, indent=2))

    client.disconnect()


if __name__ == "__main__":
    main()