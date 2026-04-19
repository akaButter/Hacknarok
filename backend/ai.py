import onnxruntime as rt
import numpy as np
import os

from models import Attraction

MODEL_PATH = "ai_engine/viking_comfort_model.onnx"

class VikingAI:
    def __init__(self):
        self.session = rt.InferenceSession(MODEL_PATH, providers=['CPUExecutionProvider'])
        self.input_name = self.session.get_inputs()[0].name
        self.label_name = self.session.get_outputs()[0].name

    def predict_comfort(self, age, gender, height, weight, temp, humidity, density, pressure) -> int:
        """
        Receives raw data from the bus sensors/user profile and returns 1-8.
        """
        input_data = np.array([[
            float(age), 
            float(gender), 
            float(height), 
            float(weight), 
            float(temp), 
            float(humidity), 
            float(density), 
            float(pressure)
        ]], dtype=np.float32)

        prediction = self.session.run([self.label_name], {self.input_name: input_data})[0]
        
        return int(prediction[0])

viking_predictor = VikingAI()

def compute_comfort(bus, user) -> int:
    """
    Translates Database Objects into AI-ready inputs.
    """
    try:
        if type(bus) == Attraction:
            humidity = 50  # Default humidity for attractions
            density = 0   # No people count for attractions
            pressure = 1013  # Default pressure for attractions
        else:
            humidity = bus.humidity if bus.humidity is not None else 50
            density = bus.people_count/bus.capacity if bus.capacity else 0
            pressure = bus.pressure if bus.pressure is not None else 1013
        score = viking_predictor.predict_comfort(
            age=user.age,
            gender=0 if user.gender.lower() == "male" else 1,
            height=user.height,
            weight=user.weight,
            temp=bus.temperature,
            humidity=humidity,
            density=density,
            pressure=pressure
        )
        return score
    except Exception as e:
        print(f"AI Logic Error: {e}")
        return 4