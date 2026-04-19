import json
import time
import paho.mqtt.client as mqtt

BROKER = "localhost"
PORT = 1883

with open(r"C:\Users\kingu\Documents\Hacknarok\backend\mqtt_helpers\json1.json", "r") as f:
    data = json.load(f)

client = mqtt.Client()
client.connect(BROKER, PORT, 60)

for bus in data:
    topic = f"bus/{bus['bus_id']}/telemetry"
    payload = json.dumps(bus)

    client.publish(topic, payload)
    print(f"Wysłano do {topic}: {payload}")

    time.sleep(0.5)

client.disconnect()